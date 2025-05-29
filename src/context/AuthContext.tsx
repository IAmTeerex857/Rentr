import React, { createContext, useContext, useState, useEffect } from "react";
import { Subscription } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import { DeepPartial } from "react-hook-form";
import { Database } from "../supabase/database.types";

// Define user types
export type UserType = "seeker" | "provider";

// Define user interface
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	country: string;
	userType: UserType;
	providerType: string;
	avatarUrl: string | null;
	completedOnboarding: boolean;
	settings: {
		notifications: {
			email: boolean;
			sms: boolean;
			app: boolean;
		};
		preferences: {
			currency: string;
			language: string;
			newsletter: boolean;
		};
	};
}

export type UserFormData = Omit<User, "id" | "avatarUrl"> & {
	avatar: File | null;
	agreeToTerms: boolean;
};

// Define auth context interface
interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	initializing: boolean;
	login: (
		email: string,
		password: string,
	) => Promise<{ success: boolean; message: string }>;
	loginWithOauth: (type: "google" | "facebook") => Promise<void>;
	logout: () => void;
	register: (
		email: string,
		password: string,
	) => Promise<{ success: boolean; message: string }>;
	updateUserProfile: (
		userData: DeepPartial<UserFormData>,
	) => Promise<{ success: boolean; message: string }>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [initializing, setInitializing] = useState<boolean>(true);
	const location = useLocation();
	const navigate = useNavigate();

	const loadUserProfile = async (userId: string, skipNav = false) => {
		try {
			// Fetch the user profile
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			if (profileError) throw profileError;
			if (!profile) throw new Error("profile not found");

			const { data: settings, error: settingsError } = await supabase
				.from("profile_settings")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			if (settingsError) throw settingsError;
			if (!settings) throw new Error("settings not found");

			const user: User = {
				id: profile.id,
				email: profile.email,
				firstName: profile.first_name,
				lastName: profile.last_name,
				phone: profile.phone,
				completedOnboarding: profile.completed_onboarding,
				address: profile.address,
				city: profile.city,
				country: profile.country,
				userType: profile.user_type as UserType,
				providerType: profile.provider_type,
				avatarUrl: profile.avatar_url,
				// We'll fetch these separately if needed
				settings: {
					notifications: {
						email: settings.notifications_email,
						sms: settings.notifications_sms,
						app: settings.notifications_app,
					},
					preferences: {
						currency: settings.currency,
						language: settings.language,
						newsletter: settings.newsletter,
					},
				},
			};
			setUser(user);
			setIsAuthenticated(true);
			if (
				!profile.completed_onboarding &&
				location.pathname !== "/register" &&
				!skipNav
			)
				navigate("/onboarding");
			return user;
		} catch (profileError) {
			console.error("Error loading user profile:", profileError);
			return user;
		}
	};

	// Listen for auth state changes
	useEffect(() => {
		setInitializing(true);
		// Get the current session
		const getInitialSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session) await loadUserProfile(session.user.id);
			} catch (error) {
				console.error("Error getting initial session:", error);
			} finally {
				setInitializing(false);
			}
		};

		getInitialSession();

		// Set up the auth state listener
		let subscription: Subscription;

		try {
			const authListener = supabase.auth.onAuthStateChange(
				async (event, session) => {
					if (
						session &&
						(event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
					)
						loadUserProfile(session.user.id);
					else if (event === "SIGNED_OUT") {
						setUser(null);
						setIsAuthenticated(false);
					}
				},
			);

			subscription = authListener.data.subscription;
		} catch (error) {
			console.error("Error setting up auth listener:", error);
		}

		// Cleanup subscription on unmount
		return () => {
			try {
				subscription?.unsubscribe();
			} catch (error) {
				console.error("Error unsubscribing:", error);
			}
		};
	}, []);

	// Login function
	const login = async (email: string, password: string) => {
		try {
			setLoading(true);
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			await loadUserProfile(data.user.id);
			setLoading(false);
			return { success: true, message: "Login successful" };
		} catch (error: any) {
			setLoading(false);
			return { success: false, message: error.message || "Login failed" };
		}
	};

	// Logout function
	const logout = async () => {
		try {
			setLoading(true);
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			setUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Error signing out:", error);
		} finally {
			setLoading(false);
		}
	};

	// Register function
	const register = async (email: string, password: string) => {
		try {
			setLoading(true);

			// Create user in Supabase Auth
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) throw error;

			if (!data.user) throw new Error("failed to signup");

			setLoading(false);
			return { success: true, message: "Registration successful" };
		} catch (error: any) {
			setLoading(false);
			return {
				success: false,
				message: error.message || "Registration failed",
			};
		}
	};

	const loginWithOauth = async (type: "google" | "facebook") => {
		supabase.auth.signInWithOAuth({
			provider: type,
		});
	};

	const uploadAvatar = async (avatar: File | null) => {
		if (!avatar) return null;
		const bucket = "rentr";
		const { data, error: uploadError } = await supabase.storage
			.from(bucket)
			.upload(`avatars/${Date.now()}-${avatar.name}`, avatar, {
				cacheControl: "3600",
				upsert: false,
			});
		if (uploadError) throw uploadError;
		return supabase.storage.from(bucket).getPublicUrl(data.fullPath).data
			.publicUrl;
	};

	// Update user profile
	const updateUserProfile = async ({
		settings,
		...userData
	}: DeepPartial<UserFormData>): Promise<{
		success: boolean;
		message: string;
	}> => {
		try {
			if (!user || !user.id) throw new Error("User not authenticated");

			const now = new Date().toISOString();
			if (Object.keys(userData)) {
				// Map our User interface to database fields
				const profileData: Database["public"]["Tables"]["profiles"]["Update"] =
					{
						updated_at: now,
						completed_onboarding: true,
					};

				if (userData.firstName)
					profileData.first_name = userData.firstName;
				if (userData.lastName)
					profileData.last_name = userData.lastName;
				if (userData.avatar)
					profileData.avatar_url = await uploadAvatar(
						userData.avatar,
					);
				if (userData.phone) profileData.phone = userData.phone;
				if (userData.address) profileData.address = userData.address;
				if (userData.city) profileData.city = userData.city;
				if (userData.country) profileData.country = userData.country;
				if (userData.userType)
					profileData.user_type = userData.userType;
				if (userData.providerType)
					profileData.provider_type = userData.providerType;

				// Update profile in Supabase
				const { error } = await supabase
					.from("profiles")
					.update(profileData)
					.eq("id", user.id);

				if (error) throw error;
			}

			// Update notifications and preferences if provided
			if (settings?.notifications || settings?.preferences) {
				const settingsData: Database["public"]["Tables"]["profile_settings"]["Update"] =
					{
						updated_at: now,
					};

				if (settings.notifications) {
					settingsData.notifications_email =
						settings.notifications.email;
					settingsData.notifications_sms = settings.notifications.sms;
					settingsData.notifications_app = settings.notifications.app;
				}

				if (settings.preferences) {
					settingsData.currency = settings.preferences.currency;
					settingsData.language = settings.preferences.language;
					settingsData.newsletter = settings.preferences.newsletter;
				}

				const { error: settingsError } = await supabase
					.from("profile_settings")
					.update(settingsData)
					.eq("user_id", user.id);

				if (settingsError) throw settingsError;
			}

			await loadUserProfile(user.id, true);

			return { success: true, message: "Profile updated successfully" };
		} catch (error: any) {
			console.error("Error updating profile:", error);
			return {
				success: false,
				message: error.message || "Failed to update profile",
			};
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				loading,
				initializing,
				login,
				loginWithOauth,
				logout,
				register,
				updateUserProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const countries = [
	{ code: "cy", name: "Cyprus" },
	{ code: "tr", name: "Turkey" },
	{ code: "gb", name: "United Kingdom" },
	{ code: "de", name: "Germany" },
	{ code: "ru", name: "Russia" },
	{ code: "us", name: "United States" },
];

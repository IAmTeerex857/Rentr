import React, { createContext, useContext, useState, useEffect } from "react";
import { Subscription } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

// Define user types
export type UserType = "seeker" | "provider";

// Define user interface
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	city: string;
	country: string;
	userType: UserType;
	providerType: string;
	avatarUrl: string | null;
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
};

// Map database profile to our User interface
const mapProfileToUser = (profile: any): User => {
	return {
		id: profile.id,
		firstName: profile.first_name,
		lastName: profile.last_name,
		email: profile.email,
		phone: profile.phone || "",
		city: profile.city,
		country: profile.country,
		userType: profile.user_type,
		providerType: profile.provider_type,
		avatarUrl: profile.avatar_url,
		// We'll fetch these separately if needed
		settings: {
			notifications: {
				email: true,
				sms: false,
				app: true,
			},
			preferences: {
				currency: "USD",
				language: "English",
				newsletter: true,
			},
		},
	};
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
		userData: Omit<UserFormData, "settings">,
		password: string,
	) => Promise<{ success: boolean; message: string }>;
	updateUserProfile: (
		userData: Partial<UserFormData>,
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

	const loadUserProfile = async (userId: string) => {
		try {
			// Fetch the user profile
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (profileError) throw profileError;

			const { data: settings, error: settingsError } = await supabase
				.from("profile_settings")
				.select("*")
				.eq("id", userId)
				.single();

			if (settingsError) throw settingsError;

			setUser(mapProfileToUser({ ...profile, settings }));
			setIsAuthenticated(true);
		} catch (profileError) {
			console.error("Error loading user profile:", profileError);
		}
	};

	// Listen for auth state changes
	useEffect(() => {
		setInitializing(true);
		// Get the current session
		const getInitialSession = async () => {
			try {
				setLoading(true);

				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session) await loadUserProfile(session.user.id);
			} catch (error) {
				console.error("Error getting initial session:", error);
			} finally {
				setLoading(false);
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
						await loadUserProfile(session.user.id);
					else if (event === "SIGNED_OUT") {
						setUser(null);
						setIsAuthenticated(false);
					}
				},
			);

			subscription = authListener.data.subscription;
		} catch (error) {
			console.error("Error setting up auth listener:", error);
		} finally {
			setInitializing(false);
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
	const register = async (
		userData: Omit<UserFormData, "settings">,
		password: string,
	): Promise<{ success: boolean; message: string }> => {
		try {
			setLoading(true);

			// Create user in Supabase Auth
			const { data, error } = await supabase.auth.signUp({
				email: userData.email,
				password,
				options: { data: userData },
			});

			if (error) throw error;

			if (!data.user) throw new Error("failed to signup");

			const { error: profileError } = await supabase
				.from("profiles")
				.upsert({
					id: data.user.id,
					first_name: userData.firstName,
					last_name: userData.lastName,
					email: userData.email,
					phone: userData.phone,
					city: userData.city,
					country: userData.country,
					user_type: userData.userType,
					provider_type: userData.providerType,
					avatar_url: await uploadAvatar(userData.avatar),
				});

			if (profileError) throw profileError;

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
		console.log(type);
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
	const updateUserProfile = async (
		userData: Partial<UserFormData>,
	): Promise<{ success: boolean; message: string }> => {
		try {
			const now = new Date().toISOString();

			if (!user || !user.id) throw new Error("User not authenticated");

			// Map our User interface to database fields
			const profileData: any = {
				updated_at: now,
			};

			if (userData.firstName) profileData.first_name = userData.firstName;
			if (userData.lastName) profileData.last_name = userData.lastName;
			if (userData.avatar)
				profileData.avatar_url = await uploadAvatar(userData.avatar);
			if (userData.phone) profileData.phone = userData.phone;
			if (userData.city) profileData.city = userData.city;
			if (userData.country) profileData.country = userData.country;
			if (userData.userType) profileData.user_type = userData.userType;
			if (userData.providerType)
				profileData.provider_type = userData.providerType;

			// Update profile in Supabase
			const { error } = await supabase
				.from("profiles")
				.update(profileData)
				.eq("id", user.id);

			if (error) throw error;

			// Update notifications and preferences if provided
			if (
				userData.settings?.notifications ||
				userData.settings?.preferences
			) {
				const settingsData: any = {
					updated_at: now,
				};

				if (userData.settings.notifications) {
					settingsData.notifications_email =
						userData.settings.notifications.email;
					settingsData.notifications_sms =
						userData.settings.notifications.sms;
					settingsData.notifications_app =
						userData.settings.notifications.app;
				}

				if (userData.settings.preferences) {
					settingsData.currency =
						userData.settings.preferences.currency;
					settingsData.language =
						userData.settings.preferences.language;
					settingsData.newsletter =
						userData.settings.preferences.newsletter;
				}

				const { error: settingsError } = await supabase
					.from("user_settings")
					.update(settingsData)
					.eq("user_id", user.id);

				if (settingsError) throw settingsError;
			}

			await loadUserProfile(user.id);

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

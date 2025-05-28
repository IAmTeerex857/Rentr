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
	address?: string;
	city: string;
	country: string;
	userType: UserType;
	providerType: string;
	avatarUrl?: string | null;
	notifications?: {
		email: boolean;
		sms: boolean;
		app: boolean;
	};
	preferences?: {
		currency: string;
		language: string;
		newsletter: boolean;
	};
}

// Map database profile to our User interface
const mapProfileToUser = (profile: any): User => {
	return {
		id: profile.id,
		firstName: profile.first_name,
		lastName: profile.last_name,
		email: profile.email,
		phone: profile.phone || "",
		address: profile.address,
		city: profile.city,
		country: profile.country,
		userType: profile.user_type,
		providerType: profile.provider_type,
		avatarUrl: profile.avatar_url,
		// We'll fetch these separately if needed
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
	};
};

// Define auth context interface
interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	login: (
		email: string,
		password: string,
	) => Promise<{ success: boolean; message: string }>;
	loginWithOauth: (type: "google" | "facebook") => Promise<void>;
	logout: () => void;
	register: (
		userData: Partial<User>,
		password: string,
	) => Promise<{ success: boolean; message: string }>;
	updateUserProfile: (
		userData: Partial<User>,
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
	const [loading, setLoading] = useState<boolean>(true);

	const loadUserProfile = async (userId: string) => {
		try {
			// Fetch the user profile
			const { data: profile, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) throw error;
			if (profile) {
				setUser(mapProfileToUser(profile));
				setIsAuthenticated(true);
			}
		} catch (profileError) {
			console.error("Error loading user profile:", profileError);
		}
	};

	// Listen for auth state changes
	useEffect(() => {
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
			return { success: true, message: "Login successful" };
		} catch (error: any) {
			return { success: false, message: error.message || "Login failed" };
		} finally {
			setLoading(false);
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
		userData: Partial<User>,
		password: string,
	): Promise<{ success: boolean; message: string }> => {
		setLoading(true);

		if (!userData.email) {
			return { success: false, message: "Email is required" };
		}

		try {
			// Create user in Supabase Auth
			const { data, error } = await supabase.auth.signUp({
				email: userData.email,
				password,
				options: {
					data: {
						first_name: userData.firstName,
						last_name: userData.lastName,
					},
				},
			});

			if (error) throw error;

			if (data.user) {
				// Create user profile in the profiles table
				const { error: profileError } = await supabase
					.from("profiles")
					.insert([
						{
							id: data.user.id,
							first_name: userData.firstName || "",
							last_name: userData.lastName || "",
							email: userData.email,
							phone: userData.phone || "",
							address: userData.address || "",
							city: userData.city || "",
							country: userData.country || "",
							user_type: userData.userType || "seeker",
							created_at: new Date().toISOString(),
						},
					]);

				if (profileError) {
					console.error("Error creating user profile:", profileError);
					return {
						success: false,
						message: "Error creating user profile",
					};
				}

				// Create user settings
				const { error: settingsError } = await supabase
					.from("user_settings")
					.insert([
						{
							user_id: data.user.id,
							notifications_email: true,
							notifications_sms: false,
							notifications_app: true,
							currency: "USD",
							language: "English",
							newsletter: true,
							created_at: new Date().toISOString(),
						},
					]);

				if (settingsError) {
					console.error(
						"Error creating user settings:",
						settingsError,
					);
				}

				return { success: true, message: "Registration successful" };
			}

			return { success: false, message: "Registration failed" };
		} catch (error: any) {
			let errorMessage = "Registration failed";

			if (error.message) {
				errorMessage = error.message;
			}

			return { success: false, message: errorMessage };
		} finally {
			setLoading(false);
		}
	};

	const loginWithOauth = async (type: "google" | "facebook") => {
		console.log(type);
	};

	// Update user profile
	const updateUserProfile = async (
		userData: Partial<User>,
	): Promise<{ success: boolean; message: string }> => {
		if (!user || !user.id) {
			return { success: false, message: "User not authenticated" };
		}

		try {
			// Map our User interface to database fields
			const profileData = {
				first_name: userData.firstName,
				last_name: userData.lastName,
				phone: userData.phone,
				address: userData.address,
				city: userData.city,
				country: userData.country,
				user_type: userData.userType,
				avatar_url: userData.avatarUrl,
				updated_at: new Date().toISOString(),
			};

			// Remove undefined values
			Object.keys(profileData).forEach((key) => {
				if (
					profileData[key as keyof typeof profileData] === undefined
				) {
					delete profileData[key as keyof typeof profileData];
				}
			});

			// Update profile in Supabase
			const { error } = await supabase
				.from("profiles")
				.update(profileData)
				.eq("id", user.id);

			if (error) throw error;

			// Update notifications and preferences if provided
			if (userData.notifications || userData.preferences) {
				const settingsData: any = {
					updated_at: new Date().toISOString(),
				};

				if (userData.notifications) {
					settingsData.notifications_email =
						userData.notifications.email;
					settingsData.notifications_sms = userData.notifications.sms;
					settingsData.notifications_app = userData.notifications.app;
				}

				if (userData.preferences) {
					settingsData.currency = userData.preferences.currency;
					settingsData.language = userData.preferences.language;
					settingsData.newsletter = userData.preferences.newsletter;
				}

				const { error: settingsError } = await supabase
					.from("user_settings")
					.update(settingsData)
					.eq("user_id", user.id);

				if (settingsError) {
					console.error(
						"Error updating user settings:",
						settingsError,
					);
				}
			}

			// Update local user state
			setUser((prev) => (prev ? { ...prev, ...userData } : null));

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

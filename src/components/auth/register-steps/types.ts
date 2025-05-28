import { User } from "../../../context/AuthContext";

export type CommonProps = {
	formData: RegisterFormData;
	updateFormData: (data: Partial<RegisterFormData>) => void;
	nextStep: () => void;
	prevStep: () => void;
};

export type RegisterFormData = Omit<User, "avatarUrl"> & {
	password: string;
	confirmPassword: string;
	avatar: File | null;
	agreeToTerms: boolean;
};

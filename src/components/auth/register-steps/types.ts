import { UserFormData } from "../../../context/AuthContext";

export type CommonProps = {
	formData: RegisterFormData;
	updateFormData: (data: Partial<RegisterFormData>) => void;
	nextStep: () => void;
	prevStep: () => void;
};

export type RegisterFormData = Omit<UserFormData, "settings"> & {
	password: string;
	confirmPassword: string;
	agreeToTerms: boolean;
};

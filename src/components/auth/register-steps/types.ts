import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "../../../context/AuthContext";

export type CommonProps = {
	form: UseFormReturn<UserFormData>;
	nextStep: () => void;
	prevStep: () => void;
};

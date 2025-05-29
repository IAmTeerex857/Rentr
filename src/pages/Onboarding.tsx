import { useState } from "react";

// Step components
import UserTypeStep from "../components/auth/register-steps/UserTypeStep";
import ProfileInfoStep from "../components/auth/register-steps/ProfileInfoStep";
import TermsStep from "../components/auth/register-steps/TermsStep";
import SuccessStep from "../components/auth/register-steps/SuccessStep";
import { useForm } from "react-hook-form";
import { useAuth, UserFormData } from "../context/AuthContext";

const Onboarding = () => {
	// State to track current step
	const [currentStep, setCurrentStep] = useState(1);
	const [error, setError] = useState<Error>();

	const { updateUserProfile } = useAuth();
	const form = useForm<UserFormData>();

	const formData = form.watch();

	// Go to next step
	const nextStep = async () => {
		try {
			setError(undefined);
			if (currentStep === 3) {
				const result = await updateUserProfile(form.getValues());
				if (!result.success) throw new Error(result.message);
			}
			setCurrentStep((prev) => Math.min(prev + 1, 4));
		} catch (err: any) {
			setError(err);
		}
	};

	// Go to previous step
	const prevStep = async () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	// Render progress bar
	const renderProgressBar = () => {
		return (
			<div className="w-full mb-8">
				<div className="flex justify-between mb-2">
					{["User Type", "Profile", "Terms"].map((step, index) => (
						<div
							key={index}
							className={`text-xs font-medium ${
								currentStep > index + 1
									? "text-rose-600"
									: currentStep === index + 1
										? "text-gray-800"
										: "text-gray-400"
							}`}
						>
							{step}
						</div>
					))}
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-rose-600 h-2 rounded-full transition-all duration-300"
						style={{ width: `${(currentStep - 1) * 33.33}%` }}
					></div>
				</div>
			</div>
		);
	};

	// Render current step
	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<UserTypeStep
						form={form}
						nextStep={nextStep}
						prevStep={prevStep}
					/>
				);
			case 2:
				return (
					<ProfileInfoStep
						form={form}
						nextStep={nextStep}
						prevStep={prevStep}
					/>
				);
			case 3:
				return (
					<TermsStep
						form={form}
						nextStep={nextStep}
						prevStep={prevStep}
					/>
				);
			case 4:
				return <SuccessStep userType={formData.userType} />;
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
				{error && (
					<div className="rounded-md bg-red-50 p-4">
						<h3 className="text-sm text-center font-medium text-red-800">
							{error.message}
						</h3>
					</div>
				)}

				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						{currentStep === 4
							? "Registration Complete!"
							: "Create your account"}
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						{currentStep === 4
							? "You can now access all features. "
							: "Join North Cyprus AirBnB to find or list properties. "}
					</p>
				</div>

				{currentStep < 4 && renderProgressBar()}

				{renderStep()}
			</div>
		</div>
	);
};

export default Onboarding;

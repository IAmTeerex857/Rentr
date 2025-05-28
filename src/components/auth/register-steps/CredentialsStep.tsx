import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { CommonProps } from "./types";

type CredentialsStepProps = CommonProps;

const CredentialsStep: React.FC<CredentialsStepProps> = ({
	formData,
	updateFormData,
	nextStep,
	prevStep,
}) => {
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		updateFormData({ [name]: value });

		// Clear error when field is being edited
		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleContinue = () => {
		const newErrors: typeof errors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			nextStep();
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					Account Credentials
				</h3>
				<p className="text-sm text-gray-500 mb-4">
					Enter your email and create a secure password
				</p>

				<div className="space-y-4">
					{/* Email Field */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email Address
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Mail className="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								value={formData.email}
								onChange={handleChange}
								className={`pl-10 block w-full shadow-sm rounded-md py-3 px-4 border ${
									errors.email
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
								}`}
								placeholder="your.email@example.com"
							/>
						</div>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600">
								{errors.email}
							</p>
						)}
					</div>

					{/* Password Field */}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="new-password"
								value={formData.password}
								onChange={handleChange}
								className={`pl-10 block w-full shadow-sm rounded-md py-3 px-4 border ${
									errors.password
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
								}`}
								placeholder="Create a secure password"
							/>
							<div
								className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5 text-gray-400" />
								) : (
									<Eye className="h-5 w-5 text-gray-400" />
								)}
							</div>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">
								{errors.password}
							</p>
						)}
						<p className="mt-1 text-xs text-gray-500">
							Password must be at least 8 characters
						</p>
					</div>

					{/* Confirm Password Field */}
					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Confirm Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								autoComplete="new-password"
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`pl-10 block w-full shadow-sm rounded-md py-3 px-4 border ${
									errors.confirmPassword
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
								}`}
								placeholder="Confirm your password"
							/>
							<div
								className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-5 w-5 text-gray-400" />
								) : (
									<Eye className="h-5 w-5 text-gray-400" />
								)}
							</div>
						</div>
						{errors.confirmPassword && (
							<p className="mt-1 text-sm text-red-600">
								{errors.confirmPassword}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="pt-4 flex justify-between">
				<button
					type="button"
					onClick={prevStep}
					className="flex items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back
				</button>

				<button
					type="button"
					onClick={handleContinue}
					className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
				>
					Continue <ArrowRight className="ml-2 h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

export default CredentialsStep;

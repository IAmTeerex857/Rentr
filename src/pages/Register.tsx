import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
	const { register, loading: isLoading } = useAuth();
	const [submitted, setSubmitted] = useState(false);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState<{
		general?: string;
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
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleContinue = async (e: React.FormEvent) => {
		e.preventDefault();

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
			console.log(formData);
			const result = await register(formData.email, formData.password);

			if (result.success) {
				setSubmitted(true);
			} else {
				setErrors({ general: result.message });
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					<div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
						<LogIn className="h-6 w-6 text-rose-600" />
					</div>
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Create your account
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Or{" "}
					<Link
						to="/login"
						className="font-medium text-rose-600 hover:text-rose-500"
					>
						login to your account
					</Link>
				</p>
			</div>

			<form
				onSubmit={handleContinue}
				className="mt-4 max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md"
			>
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Account Credentials
					</h3>
					<p className="text-sm text-gray-500 mb-4">
						Enter your email and create a secure password
					</p>
				</div>

				{errors.general && (
					<div className="rounded-md bg-red-50 p-4">
						<div className="flex">
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800">
									{errors.general}
								</h3>
							</div>
						</div>
					</div>
				)}

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

				<div>
					<button
						disabled={submitted}
						type="submit"
						className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
							isLoading || submitted
								? "opacity-70 cursor-not-allowed"
								: ""
						}`}
					>
						{isLoading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Signing up...
							</>
						) : (
							"Continue"
						)}
					</button>
				</div>

				{submitted && (
					<p className="mt-1 text-sm text-green-600 text-center">
						Proceed to your email to verify your account
					</p>
				)}
			</form>
		</div>
	);
};

export default Register;

import React, { useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	UserCircle,
	Phone,
	MapPin,
	Upload,
} from "lucide-react";
import { CommonProps } from "./types";

type ProfileInfoStepProps = CommonProps;

const ProfileInfoStep: React.FC<ProfileInfoStepProps> = ({
	formData,
	updateFormData,
	nextStep,
	prevStep,
}) => {
	const [errors, setErrors] = useState<{
		firstName?: string;
		lastName?: string;
		phone?: string;
		country?: string;
		city?: string;
	}>({});

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		updateFormData({ [name]: value });

		// Clear error when field is being edited
		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			updateFormData({ avatar: file });

			// Create preview URL
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleContinue = () => {
		const newErrors: typeof errors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		}

		if (!formData.country) {
			newErrors.country = "Country is required";
		}

		if (!formData.city.trim()) {
			newErrors.city = "City is required";
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			nextStep();
		}
	};

	// List of countries (simplified for demo)
	const countries = [
		{ code: "cy", name: "Cyprus" },
		{ code: "tr", name: "Turkey" },
		{ code: "gb", name: "United Kingdom" },
		{ code: "de", name: "Germany" },
		{ code: "ru", name: "Russia" },
		{ code: "us", name: "United States" },
	];

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					Profile Information
				</h3>
				<p className="text-sm text-gray-500 mb-4">
					Tell us a bit about yourself
				</p>

				{/* Avatar Upload */}
				<div className="flex justify-center mb-6">
					<div className="relative">
						<div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center">
							{avatarPreview ? (
								<img
									src={avatarPreview}
									alt="Avatar preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<UserCircle className="w-16 h-16 text-gray-400" />
							)}
						</div>
						<label
							htmlFor="avatar-upload"
							className="absolute bottom-0 right-0 bg-rose-600 rounded-full p-2 cursor-pointer shadow-sm"
						>
							<Upload className="h-4 w-4 text-white" />
							<input
								id="avatar-upload"
								name="avatar"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
						</label>
					</div>
				</div>

				<div className="space-y-4">
					{/* Name Fields */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="firstName"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								First Name
							</label>
							<input
								id="firstName"
								name="firstName"
								type="text"
								value={formData.firstName}
								onChange={handleChange}
								className={`block w-full shadow-sm rounded-md py-3 px-4 border ${
									errors.firstName
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
								}`}
								placeholder="John"
							/>
							{errors.firstName && (
								<p className="mt-1 text-sm text-red-600">
									{errors.firstName}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="lastName"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Last Name
							</label>
							<input
								id="lastName"
								name="lastName"
								type="text"
								value={formData.lastName}
								onChange={handleChange}
								className={`block w-full shadow-sm rounded-md py-3 px-4 border ${
									errors.lastName
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
								}`}
								placeholder="Doe"
							/>
							{errors.lastName && (
								<p className="mt-1 text-sm text-red-600">
									{errors.lastName}
								</p>
							)}
						</div>
					</div>

					{/* Phone Field */}
					<div>
						<label
							htmlFor="phone"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Phone Number
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Phone className="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="phone"
								name="phone"
								type="tel"
								value={formData.phone}
								onChange={handleChange}
								className={`pl-10 block w-full shadow-sm rounded-md py-3 px-4 border ${
									errors.phone
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
								}`}
								placeholder="+1 (555) 123-4567"
							/>
						</div>
						{errors.phone && (
							<p className="mt-1 text-sm text-red-600">
								{errors.phone}
							</p>
						)}
					</div>

					{/* Location Fields */}
					<div>
						<label
							htmlFor="country"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Country
						</label>
						<select
							id="country"
							name="country"
							value={formData.country}
							onChange={handleChange}
							className={`block w-full shadow-sm rounded-md py-3 px-4 border ${
								errors.country
									? "border-red-300 focus:ring-red-500 focus:border-red-500"
									: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
							}`}
						>
							<option value="">Select a country</option>
							{countries.map((country) => (
								<option key={country.code} value={country.code}>
									{country.name}
								</option>
							))}
						</select>
						{errors.country && (
							<p className="mt-1 text-sm text-red-600">
								{errors.country}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="city"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							City
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<MapPin className="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="city"
								name="city"
								type="text"
								value={formData.city}
								onChange={handleChange}
								className={`pl-10 block w-full shadow-sm rounded-md py-3 px-4 border ${
									errors.city
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
								}`}
								placeholder="Enter your city"
							/>
						</div>
						{errors.city && (
							<p className="mt-1 text-sm text-red-600">
								{errors.city}
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

export default ProfileInfoStep;

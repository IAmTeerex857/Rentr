import React, { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { CommonProps } from "./types";

type TermsStepProps = CommonProps;

const TermsStep: React.FC<TermsStepProps> = ({
	formData,
	updateFormData,
	nextStep,
	prevStep,
}) => {
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateFormData({ agreeToTerms: e.target.checked });
		if (error) setError(null);
	};

	const handleContinue = () => {
		if (!formData.agreeToTerms) {
			setError("You must agree to the terms and conditions to continue");
			return;
		}
		nextStep();
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					Terms and Conditions
				</h3>
				<p className="text-sm text-gray-500 mb-4">
					Please review and accept our terms to continue
				</p>

				<div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-48 overflow-y-auto mb-4 text-sm text-gray-700">
					<h4 className="font-medium mb-2">
						North Cyprus AirBnB Terms of Service
					</h4>

					<p className="mb-2">Last Updated: April 17, 2025</p>

					<p className="mb-2">
						Welcome to North Cyprus AirBnB. By using our platform,
						you agree to these Terms of Service.
					</p>

					<h5 className="font-medium mt-4 mb-1">
						1. Acceptance of Terms
					</h5>
					<p className="mb-2">
						By accessing or using our services, you agree to be
						bound by these Terms and our Privacy Policy.
					</p>

					<h5 className="font-medium mt-4 mb-1">2. User Accounts</h5>
					<p className="mb-2">
						You are responsible for maintaining the confidentiality
						of your account information and for all activities that
						occur under your account.
					</p>

					<h5 className="font-medium mt-4 mb-1">
						3. Listing and Booking Properties
					</h5>
					<p className="mb-2">
						Property providers are responsible for the accuracy of
						their listings. Property seekers agree to respect the
						properties they book and follow all house rules.
					</p>

					<h5 className="font-medium mt-4 mb-1">
						4. Payments and Fees
					</h5>
					<p className="mb-2">
						Our platform charges service fees for bookings. All
						payment terms will be clearly disclosed before any
						transaction is completed.
					</p>

					<h5 className="font-medium mt-4 mb-1">
						5. Cancellations and Refunds
					</h5>
					<p className="mb-2">
						Cancellation policies vary by property. Please review
						the specific policy for each property before booking.
					</p>

					<h5 className="font-medium mt-4 mb-1">
						6. Prohibited Activities
					</h5>
					<p className="mb-2">
						Users may not use our platform for any illegal or
						unauthorized purpose, including but not limited to
						fraud, misrepresentation, or harassment.
					</p>

					<h5 className="font-medium mt-4 mb-1">
						7. Limitation of Liability
					</h5>
					<p className="mb-2">
						North Cyprus AirBnB is not responsible for the condition
						of properties, disputes between users, or any damages
						arising from the use of our services.
					</p>

					<h5 className="font-medium mt-4 mb-1">
						8. Modifications to Terms
					</h5>
					<p className="mb-2">
						We reserve the right to modify these Terms at any time.
						Continued use of our services after any changes
						constitutes acceptance of the new Terms.
					</p>

					<h5 className="font-medium mt-4 mb-1">9. Governing Law</h5>
					<p>
						These Terms are governed by the laws of Northern Cyprus.
					</p>
				</div>

				<div className="flex items-start">
					<div className="flex items-center h-5">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							checked={formData.agreeToTerms}
							onChange={handleChange}
							className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
						/>
					</div>
					<div className="ml-3 text-sm">
						<label
							htmlFor="terms"
							className="font-medium text-gray-700"
						>
							I agree to the Terms and Conditions and Privacy
							Policy
						</label>
						<p className="text-gray-500">
							By checking this box, you acknowledge that you have
							read and agree to our terms.
						</p>
					</div>
				</div>

				{error && (
					<div className="mt-2 flex items-center text-sm text-red-600">
						<AlertCircle className="h-4 w-4 mr-1" />
						{error}
					</div>
				)}
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
					Complete Registration{" "}
					<CheckCircle className="ml-2 h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

export default TermsStep;

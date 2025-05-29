import React from "react";
import { CheckCircle, User, Building, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../../context/AuthContext";

interface SuccessStepProps {
	userType: UserType;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ userType }) => {
	const navigate = useNavigate();

	const handleStartExploring = () => {
		if (userType === "seeker") {
			navigate("/search");
		} else {
			navigate("/list-property");
		}
	};
	return (
		<div className="text-center py-6">
			<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
				<CheckCircle className="h-10 w-10 text-green-600" />
			</div>

			<h3 className="text-xl font-medium text-gray-900 mb-2">
				Registration Complete!
			</h3>
			<p className="text-gray-500 mb-6">
				Your account has been successfully created.
			</p>

			<div className="bg-gray-50 rounded-lg p-4 mb-6">
				<div className="flex items-center justify-center mb-2">
					{userType === "seeker" ? (
						<User className="h-6 w-6 text-rose-600" />
					) : (
						<Building className="h-6 w-6 text-rose-600" />
					)}
					<span className="ml-2 font-medium">
						{userType === "seeker"
							? "Property Seeker"
							: "Property Provider"}
					</span>
				</div>

				<p className="text-sm text-gray-600">
					{userType === "seeker"
						? "You can now search for properties, save favorites, and contact property owners."
						: "You can now list your properties, manage bookings, and connect with potential clients."}
				</p>
			</div>

			<div className="flex flex-col gap-3">
				<button
					onClick={handleStartExploring}
					className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
				>
					{userType === "seeker"
						? "Start Exploring Properties"
						: "List Your First Property"}
					<ArrowRight className="ml-2 h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

export default SuccessStep;

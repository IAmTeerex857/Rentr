import React from "react";
import { User, Building, ArrowRight } from "lucide-react";
import { CommonProps } from "./types";
import { Controller } from "react-hook-form";

type UserTypeStepProps = CommonProps;

const UserTypeStep: React.FC<UserTypeStepProps> = ({ form, nextStep }) => {
	const formData = form.watch();

	return (
		<form
			className="space-y-6"
			onSubmit={form.handleSubmit(() => {
				nextStep();
			})}
		>
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					I am a...
				</h3>
				<p className="text-sm text-gray-500 mb-4">
					Select the option that best describes you
				</p>

				<Controller
					name="userType"
					control={form.control}
					rules={{ required: true, deps: ["providerType"] }}
					render={({ field: { value, onChange } }) => {
						return (
							<div className="grid grid-cols-1 gap-4">
								{/* Property Seeker Option */}
								<div
									className={`border rounded-lg p-4 cursor-pointer transition-all ${
										value === "seeker"
											? "border-rose-500 bg-rose-50"
											: "border-gray-300 hover:border-rose-300"
									}`}
									onClick={() => onChange("seeker")}
								>
									<div className="flex items-center">
										<div
											className={`p-2 rounded-full ${value === "seeker" ? "bg-rose-100" : "bg-gray-100"}`}
										>
											<User
												className={`h-6 w-6 ${value === "seeker" ? "text-rose-600" : "text-gray-500"}`}
											/>
										</div>
										<div className="ml-4">
											<h4 className="text-base font-medium">
												Property Seeker
											</h4>
											<p className="text-sm text-gray-500">
												I'm looking to rent or buy
												property
											</p>
										</div>
									</div>
								</div>

								{/* Property Provider Option */}
								<div
									className={`border rounded-lg p-4 cursor-pointer transition-all ${
										value === "provider"
											? "border-rose-500 bg-rose-50"
											: "border-gray-300 hover:border-rose-300"
									}`}
									onClick={() => onChange("provider")}
								>
									<div className="flex items-center">
										<div
											className={`p-2 rounded-full ${value === "provider" ? "bg-rose-100" : "bg-gray-100"}`}
										>
											<Building
												className={`h-6 w-6 ${value === "provider" ? "text-rose-600" : "text-gray-500"}`}
											/>
										</div>
										<div className="ml-4">
											<h4 className="text-base font-medium">
												Property Provider
											</h4>
											<p className="text-sm text-gray-500">
												I want to list my property for
												rent or sale
											</p>
										</div>
									</div>
								</div>
							</div>
						);
					}}
				/>

				{formData.userType === "provider" && (
					<Controller
						name="providerType"
						control={form.control}
						rules={{ required: true }}
						render={({ field: { value, onChange } }) => {
							return (
								<div className="mt-6">
									<h4 className="text-sm font-medium text-gray-900 mb-2">
										I am a...
									</h4>
									<div className="grid grid-cols-2 gap-4">
										<div
											className={`border rounded-lg p-3 cursor-pointer transition-all ${
												value === "agent"
													? "border-rose-500 bg-rose-50"
													: "border-gray-300 hover:border-rose-300"
											}`}
											onClick={() => onChange("agent")}
										>
											<div className="text-center">
												<h5 className="text-sm font-medium">
													Real Estate Agent
												</h5>
												<p className="text-xs text-gray-500">
													I represent multiple
													properties
												</p>
											</div>
										</div>

										<div
											className={`border rounded-lg p-3 cursor-pointer transition-all ${
												value === "homeowner"
													? "border-rose-500 bg-rose-50"
													: "border-gray-300 hover:border-rose-300"
											}`}
											onClick={() =>
												onChange("homeowner")
											}
										>
											<div className="text-center">
												<h5 className="text-sm font-medium">
													Homeowner
												</h5>
												<p className="text-xs text-gray-500">
													I'm listing my own property
												</p>
											</div>
										</div>
									</div>
								</div>
							);
						}}
					/>
				)}
			</div>

			<div className="pt-4">
				<button
					type="submit"
					disabled={
						!form.formState.isValid || form.formState.isSubmitting
					}
					className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
				>
					Continue <ArrowRight className="ml-2 h-4 w-4" />
				</button>
			</div>
		</form>
	);
};

export default UserTypeStep;

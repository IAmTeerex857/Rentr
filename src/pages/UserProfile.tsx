import { useState, useEffect } from "react";
import { countries, useAuth, UserFormData } from "../context/AuthContext";
import {
	User as UserIcon,
	Mail,
	Phone,
	MapPin,
	Home,
	Save,
	ArrowLeft,
	Bell,
	Lock,
	LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeepPartial, useForm } from "react-hook-form";

const UserProfile = () => {
	const { user, logout, updateUserProfile } = useAuth();
	const navigate = useNavigate();

	const form = useForm<Omit<UserFormData, "settings">>();
	const notificationsForm =
		useForm<DeepPartial<UserFormData["settings"]["notifications"]>>();
	const preferencesForm =
		useForm<DeepPartial<UserFormData["settings"]["preferences"]>>();

	const notificationsFormData = notificationsForm.watch();

	// Initialize states
	const [activeTab, setActiveTab] = useState("personal");
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!user) return;
		const { settings, ...profile } = user;
		form.reset(profile);
		notificationsForm.reset(settings.notifications);
		preferencesForm.reset(settings.preferences);
	}, [user]);

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-50 pt-20 pb-12">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row gap-6">
					{/* Sidebar */}
					<div className="w-full md:w-64 bg-white rounded-xl shadow-md p-6">
						<div className="flex items-center mb-6">
							<UserIcon className="h-10 w-10 text-airbnb-red mr-4" />
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									{user.firstName} {user.lastName}
								</h1>
								<p className="text-gray-600">
									{user.userType === "seeker"
										? "Property Seeker"
										: "Property Provider"}
								</p>
							</div>
						</div>

						<nav className="space-y-1">
							<button
								onClick={() => setActiveTab("personal")}
								className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
									activeTab === "personal"
										? "bg-red-50 text-airbnb-red"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<UserIcon className="h-5 w-5 mr-3" />
								Personal Info
							</button>

							<button
								onClick={() => setActiveTab("security")}
								className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
									activeTab === "security"
										? "bg-red-50 text-airbnb-red"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<Lock className="h-5 w-5 mr-3" />
								Security
							</button>

							<button
								onClick={() => setActiveTab("notifications")}
								className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
									activeTab === "notifications"
										? "bg-red-50 text-airbnb-red"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<Bell className="h-5 w-5 mr-3" />
								Notifications
							</button>

							<button
								onClick={() => setActiveTab("preferences")}
								className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
									activeTab === "preferences"
										? "bg-red-50 text-airbnb-red"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<Home className="h-5 w-5 mr-3" />
								Preferences
							</button>

							<button
								onClick={handleLogout}
								className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4"
							>
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</button>
						</nav>
					</div>

					{/* Main Content */}
					<div className="flex-1 bg-white rounded-xl shadow-md p-6">
						<div className="flex items-center justify-between mb-6">
							<h1 className="text-2xl font-bold text-gray-900">
								{activeTab === "personal" &&
									"Personal Information"}
								{activeTab === "security" &&
									"Security Settings"}
								{activeTab === "notifications" &&
									"Notification Preferences"}
								{activeTab === "preferences" &&
									"Account Preferences"}
							</h1>

							{activeTab === "personal" && !isEditing && (
								<button
									onClick={() => setIsEditing(true)}
									className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700"
								>
									Edit Profile
								</button>
							)}
						</div>

						{/* Personal Information Tab */}
						{activeTab === "personal" && (
							<div>
								{isEditing ? (
									<form
										onSubmit={form.handleSubmit(
											async (values) => {
												const result =
													await updateUserProfile(
														values,
													);
												if (!result.success)
													throw new Error(
														result.message,
													);
												setIsEditing(false);
											},
										)}
									>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													First Name
												</label>
												<input
													type="text"
													{...form.register(
														"firstName",
														{ required: true },
													)}
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Last Name
												</label>
												<input
													type="text"
													{...form.register(
														"lastName",
														{ required: true },
													)}
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Email
												</label>
												<input
													type="email"
													disabled={true}
													{...form.register("email", {
														required: true,
													})}
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Phone Number
												</label>
												<input
													type="tel"
													{...form.register("phone", {
														required: true,
													})}
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Address
												</label>
												<input
													type="text"
													{...form.register(
														"address",
														{
															required: true,
														},
													)}
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													City
												</label>
												<input
													type="text"
													{...form.register("city", {
														required: true,
													})}
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Country
												</label>
												<select
													id="country"
													{...form.register(
														"country",
														{ required: true },
													)}
													className={`block w-full shadow-sm rounded-md py-3 px-4 border ${
														form.formState.errors
															.country
															? "border-red-300 focus:ring-red-500 focus:border-red-500"
															: "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
													}`}
												>
													<option value="">
														Select a country
													</option>
													{countries.map(
														(country) => (
															<option
																key={
																	country.code
																}
																value={
																	country.code
																}
															>
																{country.name}
															</option>
														),
													)}
												</select>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													User Type
												</label>
												<select
													{...form.register(
														"userType",
														{
															required: true,
														},
													)}
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
												>
													<option value="seeker">
														Property Seeker
													</option>
													<option value="provider">
														Property Provider
													</option>
												</select>
											</div>
										</div>

										<div className="mt-8 flex space-x-4">
											<button
												disabled={
													!form.formState.isValid ||
													form.formState.isSubmitting
												}
												type="submit"
												className="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 flex items-center"
											>
												<Save className="h-4 w-4 mr-2" />
												Save Changes
											</button>

											<button
												onClick={() => {
													setIsEditing(false);
													form.reset();
												}}
												className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center"
											>
												<ArrowLeft className="h-4 w-4 mr-2" />
												Cancel
											</button>
										</div>
									</form>
								) : (
									<div className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<h3 className="text-sm font-medium text-gray-500">
													Name
												</h3>
												<p className="mt-1 text-lg font-medium text-gray-900">
													{user.firstName}{" "}
													{user.lastName}
												</p>
											</div>

											<div>
												<h3 className="text-sm font-medium text-gray-500">
													Email
												</h3>
												<p className="mt-1 text-lg font-medium text-gray-900 flex items-center">
													<Mail className="h-4 w-4 mr-2 text-gray-400" />
													{user.email}
												</p>
											</div>

											<div>
												<h3 className="text-sm font-medium text-gray-500">
													Phone
												</h3>
												<p className="mt-1 text-lg font-medium text-gray-900 flex items-center">
													<Phone className="h-4 w-4 mr-2 text-gray-400" />
													{user.phone}
												</p>
											</div>

											<div>
												<h3 className="text-sm font-medium text-gray-500">
													Address
												</h3>
												<p className="mt-1 text-lg font-medium text-gray-900 flex items-center">
													<MapPin className="h-4 w-4 mr-2 text-gray-400" />
													{user.address} {user.city},{" "}
													{user.country}
												</p>
											</div>

											<div>
												<h3 className="text-sm font-medium text-gray-500">
													User Type
												</h3>
												<p className="mt-1 text-lg font-medium text-gray-900 capitalize">
													{user.userType}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Security Tab */}
						{activeTab === "security" && (
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Change Password
									</h3>
									<form className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Current Password
											</label>
											<input
												type="password"
												className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												New Password
											</label>
											<input
												type="password"
												className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
												required
											/>
											<p className="mt-1 text-sm text-gray-500">
												Password must be at least 8
												characters and include a number
												and a special character.
											</p>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Confirm New Password
											</label>
											<input
												type="password"
												className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
												required
											/>
										</div>

										<button
											type="submit"
											className="px-4 py-2 bg-airbnb-red text-white rounded-lg text-sm font-medium hover:bg-airbnb-red/90"
										>
											Update Password
										</button>
									</form>
								</div>

								<div className="pt-6 border-t border-gray-200">
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Account Deletion
									</h3>
									<p className="text-gray-500 mb-4">
										Once you delete your account, there is
										no going back. Please be certain.
									</p>
									<button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
										Delete Account
									</button>
								</div>
							</div>
						)}

						{/* Notifications Tab */}
						{activeTab === "notifications" && (
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Notification Settings
									</h3>
									<form
										className="space-y-4"
										onSubmit={notificationsForm.handleSubmit(
											async (values) => {
												const result =
													await updateUserProfile({
														settings: {
															notifications:
																values,
														},
													});
												if (!result.success)
													throw new Error(
														result.message,
													);
											},
										)}
									>
										<div className="flex items-center justify-between py-3 border-b border-gray-200">
											<div>
												<h4 className="text-base font-medium text-gray-900">
													Email Notifications
												</h4>
												<p className="text-sm text-gray-500">
													Receive updates and alerts
													via email
												</p>
											</div>
											<div className="flex items-center">
												<input
													type="checkbox"
													id="email-notifications"
													{...notificationsForm.register(
														"email",
													)}
													className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
												/>
												<label
													htmlFor="email-notifications"
													className="ml-2 block text-sm text-gray-700"
												>
													{notificationsFormData.email
														? "Enabled"
														: "Disabled"}
												</label>
											</div>
										</div>

										<div className="flex items-center justify-between py-3 border-b border-gray-200">
											<div>
												<h4 className="text-base font-medium text-gray-900">
													SMS Notifications
												</h4>
												<p className="text-sm text-gray-500">
													Receive updates and alerts
													via text message
												</p>
											</div>
											<div className="flex items-center">
												<input
													type="checkbox"
													id="sms-notifications"
													{...notificationsForm.register(
														"sms",
													)}
													className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
												/>
												<label
													htmlFor="sms-notifications"
													className="ml-2 block text-sm text-gray-700"
												>
													{notificationsFormData.sms
														? "Enabled"
														: "Disabled"}
												</label>
											</div>
										</div>

										<div className="flex items-center justify-between py-3 border-b border-gray-200">
											<div>
												<h4 className="text-base font-medium text-gray-900">
													App Notifications
												</h4>
												<p className="text-sm text-gray-500">
													Receive in-app notifications
												</p>
											</div>
											<div className="flex items-center">
												<input
													type="checkbox"
													id="app-notifications"
													{...notificationsForm.register(
														"app",
													)}
													className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
												/>
												<label
													htmlFor="app-notifications"
													className="ml-2 block text-sm text-gray-700"
												>
													{notificationsFormData.app
														? "Enabled"
														: "Disabled"}
												</label>
											</div>
										</div>

										<button
											disabled={
												!notificationsForm.formState
													.isValid ||
												notificationsForm.formState
													.isSubmitting
											}
											type="submit"
											className="px-4 py-2 bg-airbnb-red text-white rounded-lg text-sm font-medium hover:bg-airbnb-red/90"
										>
											Save Notification Preferences
										</button>
									</form>
								</div>
							</div>
						)}

						{/* Preferences Tab */}
						{activeTab === "preferences" && (
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Account Preferences
									</h3>
									<form
										className="space-y-4"
										onSubmit={preferencesForm.handleSubmit(
											async (values) => {
												const result =
													await updateUserProfile({
														settings: {
															preferences: values,
														},
													});
												if (!result.success)
													throw new Error(
														result.message,
													);
											},
										)}
									>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Currency
											</label>
											<select
												{...preferencesForm.register(
													"currency",
												)}
												className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
											>
												<option value="usd">
													USD ($)
												</option>
												<option value="eur">
													EUR (€)
												</option>
												<option value="gbp">
													GBP (£)
												</option>
												<option value="try">
													TRY (₺)
												</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Language
											</label>
											<select
												{...preferencesForm.register(
													"language",
												)}
												className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
											>
												<option value="English">
													English
												</option>
												<option value="Turkish">
													Turkish
												</option>
												<option value="Russian">
													Russian
												</option>
												<option value="German">
													German
												</option>
											</select>
										</div>

										<div className="flex items-center">
											<input
												type="checkbox"
												id="newsletter"
												{...preferencesForm.register(
													"newsletter",
												)}
												className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
											/>
											<label
												htmlFor="newsletter"
												className="ml-2 block text-sm text-gray-700"
											>
												Subscribe to newsletter
											</label>
										</div>

										<button
											disabled={
												!preferencesForm.formState
													.isValid ||
												preferencesForm.formState
													.isSubmitting
											}
											type="submit"
											className="px-4 py-2 bg-airbnb-red text-white rounded-lg text-sm font-medium hover:bg-airbnb-red/90"
										>
											Save Preferences
										</button>
									</form>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;

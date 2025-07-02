import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	Outlet,
	useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth, User } from "./context/AuthContext";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import SearchResults from "./pages/SearchResults";
import ListProperty from "./pages/ListProperty";
import Login from "./pages/Login";
import PropertyDetails from "./pages/PropertyDetails";
import ProviderDashboard from "./pages/ProviderDashboard";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import EditProperty from "./pages/EditProperty";
import Search from "./pages/Search";

function Guard({
	fn,
}: {
	fn: (user: User | null, path: string) => string | undefined;
}) {
	const location = useLocation();
	const { user } = useAuth();
	const check = fn(user, location.pathname);
	if (typeof check === "string") return <Navigate to={check} />;
	return <Outlet />;
}

function App() {
	return (
		<Router>
			<AuthProvider>
				<Layout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							Component={() => (
								<Guard
									fn={(user) => (user ? "/" : undefined)}
								/>
							)}
						>
							<Route path="/register" element={<Register />} />
							<Route path="/login" element={<Login />} />
						</Route>
						<Route
							Component={() => (
								<Guard
									fn={(user, path) =>
										user
											? !user.completedOnboarding &&
												path !== "/onboarding"
												? "/onboarding"
												: undefined
											: "/login"
									}
								/>
							)}
						>
							<Route
								path="/onboarding"
								element={<Onboarding />}
							/>
							<Route
								path="/properties"
								element={<SearchResults />}
							/>
							<Route
								path="/properties/:id"
								element={<PropertyDetails />}
							/>
							<Route path="/search" element={<Search />} />
							<Route
								path="/dashboard"
								element={<ProviderDashboard />}
							/>
							<Route
								path="/list-property"
								element={<ListProperty />}
							/>
							<Route path="/profile" element={<UserProfile />} />
							<Route
								path="/edit-property/:id"
								element={<EditProperty />}
							/>
						</Route>

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Layout>
			</AuthProvider>
		</Router>
	);
}

export default App;

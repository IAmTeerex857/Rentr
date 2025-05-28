import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import PropertyDetails from "./pages/PropertyDetails";
import Search from "./pages/Search";
import ProviderDashboard from "./pages/ProviderDashboard";
import ListProperty from "./pages/ListProperty";
import UserProfile from "./pages/UserProfile";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Layout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/properties" element={<SearchResults />} />
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

						{/* Add more routes as they are developed */}

						{/* Fallback route - redirect to home if no match */}
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Layout>
			</Router>
		</AuthProvider>
	);
}

export default App;

import {
  BrowserRouter as Router,
  Routes as RouterRoutes,
  Route,
} from "react-router-dom";
import Layout from "./components/Layout";
import Agencies from "./pages/Agencies";
import Routes from "./pages/Routes";
import Trips from "./pages/Trips";
import Stops from "./pages/Stops";
import StopTimes from "./pages/StopTimes";
import Calendar from "./pages/Calendar";
import CalendarDates from "./pages/CalendarDates";
import Shapes from "./pages/Shapes";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <RouterRoutes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <RouterRoutes>
                    <Route
                      path="/"
                      element={<div>Dashboard (Coming Soon)</div>}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/agencies" element={<Agencies />} />
                    <Route path="/routes" element={<Routes />} />
                    <Route path="/trips" element={<Trips />} />
                    <Route path="/stops" element={<Stops />} />
                    <Route path="/stop-times" element={<StopTimes />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/calendar-dates" element={<CalendarDates />} />
                    <Route path="/shapes" element={<Shapes />} />
                  </RouterRoutes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </RouterRoutes>
      </Router>
    </AuthProvider>
  );
}

export default App;

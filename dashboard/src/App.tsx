import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AgencyProvider } from './context/AgencyContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Agencies from './pages/Agencies';
import RoutesPage from './pages/Routes';
import Trips from './pages/Trips';
import Stops from './pages/Stops';
import StopTimes from './pages/StopTimes';
// import Calendar from "./pages/Calendar";
// import CalendarDates from "./pages/CalendarDates";
// import Shapes from "./pages/Shapes";
import Profile from './pages/Profile';

function AppContent() {
  const { logout } = useAuth();

  return (
    <Router>
      <AgencyProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout handleLogout={logout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<div>Dashboard: Coming Soon</div>} />
            <Route path="agencies" element={<Agencies />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="trips" element={<Trips />} />
            <Route path="stops" element={<Stops />} />
            <Route path="stop-times" element={<StopTimes />} />
            {/* <Route path="calendar" element={<Calendar />} />
            <Route path="calendar-dates" element={<CalendarDates />} /> */}
            {/* <Route path="shapes" element={<Shapes />} /> */}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AgencyProvider>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

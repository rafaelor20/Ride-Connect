import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from './contexts/UserContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import EstimateRide from './pages/Estimate';
import ChooseDriver from './pages/ChooseDriver';
import ConfirmRide from './pages/Confirm';
import Historic from './pages/Historic';
import HistoricByDriver from './pages/HistoricByDriver';

import useToken from './hooks/useToken';

export default function App() {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/home"
              element={
                <ProtectedRouteGuard>
                  <Home />
                </ProtectedRouteGuard>
              }>
            </Route>
            <Route
              path="/estimate"
              element={
                <ProtectedRouteGuard>
                  <EstimateRide />
                </ProtectedRouteGuard>
              }>
            </Route>
            <Route path="/choose-driver"
              element={
                <ProtectedRouteGuard>
                  <ChooseDriver />
                </ProtectedRouteGuard>
              }>
            </Route>
            <Route
              path="/confirm"
              element={
                <ProtectedRouteGuard>
                  <ConfirmRide />
                </ProtectedRouteGuard>
              }>
            </Route>
            <Route path="/rides"
              element={
                <ProtectedRouteGuard>
                  <Historic />
                </ProtectedRouteGuard>
              }>
            </Route>
            <Route path="/rides-by-driver"
              element={
                <ProtectedRouteGuard>
                  <HistoricByDriver />
                </ProtectedRouteGuard>
              }>
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

function ProtectedRouteGuard({ children }) {
  const token = useToken();

  if (!token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

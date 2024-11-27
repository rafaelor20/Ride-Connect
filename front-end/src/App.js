import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<EstimateRide />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/home"
              element={
                <Home />
              }>
            </Route>
            <Route
              path="/estimate"
              element={
                <EstimateRide />
              }>
            </Route>
            <Route path="/choose-driver"
              element={
                <ChooseDriver />
              }>
            </Route>
            <Route
              path="/confirm"
              element={
                <ConfirmRide />
              }>
            </Route>
            <Route path="/rides"
              element={
                <Historic />
              }>
            </Route>
            <Route path="/rides-by-driver"
              element={
                <HistoricByDriver />
              }>
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
};

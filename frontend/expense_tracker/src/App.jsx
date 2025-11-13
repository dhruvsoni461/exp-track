import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Auth/Login";
// import SignUp from "./pages/Auth/SignUp";
import Auth from "./pages/Auth/Auth";
import DashboardLayout from "./pages/Dashboard/Layout";
import Home from "./pages/Dashboard/Home";
import { AuthContext } from "./context/AuthContext";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";


function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path="/auth" element={<Auth />} />
  <Route path="/login" element={<Auth />} />
  <Route path="/signup" element={<Auth />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Home />} />
          <Route path="income" element={<Income />} />
          <Route path="expense" element={<Expense />} />

          {/* we will add /income and /expense later */}
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

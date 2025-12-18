import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

/* -------------------- Pages -------------------- */
import LandingPage from "./Pages/Landing_Page/Landing_Page.jsx";
import Register from "./Pages/Register_page/Register_Page.jsx";
import LoginPage from "./Pages/Login_Page/Login_Page.jsx";
import HomePage from "./Pages/Home_Page/Home_Page.jsx";
import TestPage from "./Pages/Test_Interface/TestPage.jsx";
import ShoppingPage from "./Pages/Shopping_Page/Shopping_Page.jsx";
import UserDetailForm from "./Pages/UserDetail_Page/User_Detail.jsx";
import ProductDetailsPage from "./Pages/Home_Page/ProductDetailsPage.jsx";
import PaymentPage from "./Pages/Home_Page/PaymentPage.jsx";

/* -------------------- Admin Pages -------------------- */
import AdminLogin from "./Pages/Admin_Page/AdminLogin";
import PrivateadminRoute from "./Pages/Admin_Page/PrivateRoute";
import AdminDashboard from "./Pages/Admin_Page/AdminDashboard";
import AssignTest from "./Pages/Admin_Page/AssignTest";
import { UpdateQuestions } from "./Pages/Admin_Page/UpdateQuestions.jsx";
import CreateNewTest from "./Pages/Admin_Page/CreateNewTest.jsx";

/* -------------------- Auth -------------------- */
import { AuthContext } from "./context/AuthContext";

const baseUrl = import.meta.env.VITE_BASE_URL;

/* -------------------- Private User Route -------------------- */
const PrivateRoute = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  return accessToken ? children : <Navigate to="/login" replace />;
};

function App() {
  const { setAccessToken, setUser } = useContext(AuthContext);

  /* -------------------- Auto login via refresh token -------------------- */
  useEffect(() => {
    const refreshLogin = async () => {
      try {
        const res = await axios.post(
          `${baseUrl}/api/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch {
        // not logged in / refresh token expired
      }
    };

    refreshLogin();
  }, [setAccessToken, setUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* -------- Public Routes -------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* -------- User Protected Routes -------- */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tests/:id"
          element={
            <PrivateRoute>
              <TestPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/shop"
          element={
            <PrivateRoute>
              <ShoppingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/userdetails"
          element={
            <PrivateRoute>
              <UserDetailForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/details/bundle/:id"
          element={
            <PrivateRoute>
              <ProductDetailsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/payment/bundle/:id"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />

        {/* -------- Admin -------- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<PrivateadminRoute />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="assign-test" element={<AssignTest />} />
            <Route path="update-questions" element={<UpdateQuestions />} />
            <Route path="create-test" element={<CreateNewTest />} />
          </Route>
        </Route>

        {/* -------- Fallback -------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

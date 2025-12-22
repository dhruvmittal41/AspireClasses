import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";
import api from "./api/axios";
import { attachAuthInterceptor } from "./api/attachAuth";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Spinner from "./components/Spinner";
import { useDelayedLoading } from "./hooks/useDelayedLoading";

import LandingPage from "./Pages/Landing_Page/Landing_Page.jsx";
import Register from "./Pages/Register_page/Register_Page.jsx";
import LoginPage from "./Pages/Login_Page/Login_Page.jsx";
import HomePage from "./Pages/Home_Page/Home_Page.jsx";
import TestPage from "./Pages/Test_Interface/TestPage.jsx";
import ShoppingPage from "./Pages/Shopping_Page/Shopping_Page.jsx";
import UserDetailForm from "./Pages/UserDetail_Page/User_Detail.jsx";
import ProductDetailsPage from "./Pages/Home_Page/ProductDetailsPage.jsx";
import PaymentPage from "./Pages/Home_Page/PaymentPage.jsx";

import AdminLogin from "./Pages/Admin_Page/AdminLogin";
import PrivateadminRoute from "./Pages/Admin_Page/PrivateRoute";
import AdminDashboard from "./Pages/Admin_Page/AdminDashboard";
import AssignTest from "./Pages/Admin_Page/AssignTest";
import { UpdateQuestions } from "./Pages/Admin_Page/UpdateQuestions.jsx";
import CreateNewTest from "./Pages/Admin_Page/CreateNewTest.jsx";

import { AuthContext } from "./context/AuthContext";

const baseUrl = import.meta.env.VITE_BASE_URL;

const PrivateRoute = ({ children }) => {
  const { accessToken, authLoading } = useContext(AuthContext);
  const showLoader = useDelayedLoading(authLoading, 600);

  if (showLoader) {
    return <Spinner text="Checking authentication..." />;
  }

  return accessToken ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { accessToken, authLoading } = useContext(AuthContext);
  const showLoader = useDelayedLoading(authLoading, 600);

  if (showLoader) {
    return <Spinner text="Preparing your experience..." />;
  }

  return accessToken ? <Navigate to="/home" replace /> : children;
};

function App() {
  console.log("App mounted");
  const { setAccessToken, setUser, setAuthLoading, authLoading } =
    useContext(AuthContext);

  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    attachAuthInterceptor(() => accessToken);
  }, [accessToken]);

  useEffect(() => {
    console.log("🔄 refreshLogin effect started");

    const refreshLogin = async () => {
      console.log("➡️ calling /api/refresh");

      try {
        const res = await axios.post(
          `${baseUrl}/api/refresh`,
          {},
          { withCredentials: true }
        );

        console.log("✅ refresh success", res.data);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch (err) {
        console.log("⚠️ refresh failed", err?.response?.status);
      } finally {
        console.log("🟢 refresh finished");
        setAuthLoading(false);
      }
    };

    refreshLogin();
  }, []);
  if (authLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40vh" }}>Loading...</div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/register" element={<Register />} />

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

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<PrivateadminRoute />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="assign-test" element={<AssignTest />} />
            <Route path="update-questions" element={<UpdateQuestions />} />
            <Route path="create-test" element={<CreateNewTest />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

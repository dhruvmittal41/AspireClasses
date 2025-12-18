import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

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
  const { accessToken } = useContext(AuthContext);
  return accessToken ? children : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },

  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <Register /> },

  {
    path: "/home",
    element: (
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    ),
  },

  {
    path: "/tests/:id",
    element: (
      <PrivateRoute>
        <TestPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/shop",
    element: (
      <PrivateRoute>
        <ShoppingPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/userdetails",
    element: (
      <PrivateRoute>
        <UserDetailForm />
      </PrivateRoute>
    ),
  },

  {
    path: "/details/bundle/:id",
    element: (
      <PrivateRoute>
        <ProductDetailsPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/payment/bundle/:id",
    element: (
      <PrivateRoute>
        <PaymentPage />
      </PrivateRoute>
    ),
  },

  { path: "/admin/login", element: <AdminLogin /> },

  {
    element: <PrivateadminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
        children: [
          { path: "assign-test", element: <AssignTest /> },
          { path: "update-questions", element: <UpdateQuestions /> },
          { path: "create-test", element: <CreateNewTest /> },
        ],
      },
    ],
  },
]);

function App() {
  const { setAccessToken, setUser } = useContext(AuthContext);

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
      } catch {}
    };

    refreshLogin();
  }, [setAccessToken, setUser]);

  return <RouterProvider router={router} />;
}

export default App;

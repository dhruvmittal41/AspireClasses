import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./Pages/Landing_Page/Landing_Page.jsx";
import Register from "./Pages/Register_page/Register_Page.jsx";
import HomePage from "./Pages/Home_Page/Home_Page.jsx";
import TestPage from "./Pages/Test_Interface/TestPage.jsx";
import LoginPage from "./Pages/Login_Page/Login_Page.jsx";
import ShoppingPage from "./Pages/Shopping_Page/Shopping_Page.jsx";
import UserDetailForm from "./Pages/UserDetail_Page/User_Detail.jsx";
import AdminLogin from "./Pages/Admin_Page/AdminLogin";
import PrivateadminRoute from "./Pages/Admin_Page/PrivateRoute";
import AdminDashboard from "./Pages/Admin_Page/AdminDashboard";
import AssignTest from "./Pages/Admin_Page/AssignTest";
import { UpdateQuestions } from "./Pages/Admin_Page/UpdateQuestions.jsx";
import CreateNewTest from "./Pages/Admin_Page/CreateNewTest.jsx";
import ProductDetailsPage from "./Pages/Home_Page/ProductDetailsPage.jsx";
import PaymentPage from "./Pages/Home_Page/PaymentPage.jsx";
import { AuthContext } from "./context/AuthContext";
import { useEffect, useContext } from "react";

import "./index.css";

const PrivateRoute = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  return accessToken ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    element: <PrivateadminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,

        children: [
          {
            path: "assign-test",
            element: <AssignTest />,
          },
          {
            path: "update-questions",
            element: <UpdateQuestions />,
          },
          {
            path: "create-test",
            element: <CreateNewTest />,
          },
        ],
      },
    ],
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Home",
    element: <HomePage />,
  },
  {
    path: "/tests/:id",
    element: <TestPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/shop",
    element: <ShoppingPage />,
  },
  {
    path: "/UserDetails",
    element: <UserDetailForm />,
  },

  {
    path: "/details/bundle/:id",
    element: <ProductDetailsPage />,
  },

  {
    path: "/payment/bundle/:id",
    element: <PaymentPage />,
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
  }, []);

  return <RouterProvider router={router} />;
}

export default App;

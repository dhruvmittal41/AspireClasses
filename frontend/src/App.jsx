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
import PrivateRoute from "./Pages/Admin_Page/PrivateRoute";
import AdminDashboard from "./Pages/Admin_Page/AdminDashboard";
import AssignTest from "./Pages/Admin_Page/AssignTest";
import { UpdateQuestions } from "./Pages/Admin_Page/UpdateQuestions.jsx";
import CreateNewTest from "./Pages/Admin_Page/CreateNewTest.jsx";

// 👇 Import the new page components
import ProductDetailsPage from "./Pages/Home_Page/ProductDetailsPage.jsx";
import PaymentPage from "./Pages/Home_Page/PaymentPage.jsx";

import "./index.css";

// 2. DEFINE YOUR ROUTES AS AN ARRAY OF OBJECTS
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
    // This is your PrivateRoute layout. It protects all its children.
    element: <PrivateRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
        // These routes will render inside the AdminDashboard's <Outlet>
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
  // 👇 Route for the product details page
  {
    path: "/details/bundle/:id",
    element: <ProductDetailsPage />,
  },
  // 👇 Corrected route for the payment page (matches ProductDetailsPage navigation)
  {
    path: "/payment/bundle/:id",
    element: <PaymentPage />,
  },
]);

// 3. UPDATE THE APP COMPONENT TO USE THE ROUTER PROVIDER
function App() {
  return <RouterProvider router={router} />;
}

export default App;

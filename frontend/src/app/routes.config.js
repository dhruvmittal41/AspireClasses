import LandingPage from "../Pages/Landing_Page/Landing_Page";
import LoginPage from "../Pages/Login_Page/Login_Page";
import Register from "../Pages/Register_page/Register_Page";
import HomePage from "../Pages/Home_Page/home/Home_Page";
import TestPage from "../Pages/Test_Interface/TestPage";
import ProductDetailsPage from "../Pages/Home_Page/product-details/ProductDetailsPage";
import PaymentPage from "../Pages/Home_Page/PaymentPage/PaymentPage";

import AdminLogin from "../Pages/Admin_Page/AdminLogin";
import AdminDashboard from "../Pages/Admin_Page/AdminDashboard";
import AssignTest from "../Pages/Admin_Page/AssignTest";
import { UpdateQuestions } from "../Pages/Admin_Page/UpdateQuestions";
import CreateNewTest from "../Pages/Admin_Page/CreateNewTest";

export const publicRoutes = [
    { path: "/", element: LandingPage },
    { path: "/login", element: LoginPage },
    { path: "/register", element: Register },
    { path: "/admin/login", element: AdminLogin },
];

export const privateRoutes = [
    { path: "/home", element: HomePage },
    { path: "/tests/:id", element: TestPage },
    { path: "/details/bundle/:id", element: ProductDetailsPage },
    { path: "/payment/bundle/:id", element: PaymentPage },
];

export const adminRoutes = [
    {
        path: "/admin",
        element: AdminDashboard,
        children: [
            { path: "assign-test", element: AssignTest },
            { path: "update-questions", element: UpdateQuestions },
            { path: "create-test", element: CreateNewTest },
        ],
    },
];

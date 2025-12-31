import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../auth/PrivateRoute";
import PublicRoute from "../auth/PublicRoute";
import PrivateadminRoute from "../Pages/Admin_Page/PrivateRoute";
import { publicRoutes, privateRoutes, adminRoutes } from "./routes.config.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={<PublicRoute>{r.element}</PublicRoute>}
          />
        ))}

        {privateRoutes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={<PrivateRoute>{r.element}</PrivateRoute>}
          />
        ))}

        <Route element={<PrivateadminRoute />}>
          {adminRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element}>
              {r.children?.map((c) => (
                <Route key={c.path} path={c.path} element={c.element} />
              ))}
            </Route>
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

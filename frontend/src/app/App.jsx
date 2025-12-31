import { useEffect } from "react";
import Router from "./Router";
import { attachAuthInterceptor } from "../api/attachAuth";
import { useAuth } from "../auth/useAuth";
import { useRefreshLogin } from "../hooks/useRefreshLogin";

export default function App() {
  const { accessToken } = useAuth();

  useEffect(() => {
    attachAuthInterceptor(() => accessToken);
  }, [accessToken]);

  useRefreshLogin();

  return <Router />;
}

import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "./useAuth";
import { useDelayedLoading } from "../hooks/useDelayedLoading";

export default function PublicRoute({ children }) {
  const { accessToken, authLoading } = useAuth();
  const showLoader = useDelayedLoading(authLoading, 600);

  if (showLoader) return <Spinner text="Preparing your experience..." />;
  return accessToken ? <Navigate to="/home" replace /> : children;
}

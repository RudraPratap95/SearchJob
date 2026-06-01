import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthChecked } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      navigate("/");
    }
  }, [user, isAuthChecked, allowedRoles, navigate]);

  if (!isAuthChecked) {
    return null;
  }
  if (!user) {
    return null;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
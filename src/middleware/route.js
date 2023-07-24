import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to={"/"} replace={true} />;
  }
  return children;
};

export const Public = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return children;
  }
  return <Navigate to={"/"} replace={true} />;
};

export const Admin = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (user && user.isAdmin) {
    return children;
  }
  return <Navigate to={"/"} replace={true} />;
};

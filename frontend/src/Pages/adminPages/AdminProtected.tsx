import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ChildrenProps } from "../../utils/types";

const AdminProtected: React.FC<ChildrenProps> = ({ children }) => {
  const { adminInfo } = useSelector((state: any) => state.adminAuth);
  if (!adminInfo) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

export default AdminProtected;

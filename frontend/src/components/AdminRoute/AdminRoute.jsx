import { Navigate, useLocation } from 'react-router';
import { getUser } from '../../services/authService';

export default function AdminRoute({ children }) {
    const user = getUser();
    const location = useLocation();
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    if (user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  
    return children;
  }
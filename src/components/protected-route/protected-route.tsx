import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuth);
  const user = useSelector((state) => state.user.userData);
  const location = useLocation();
  const from = location.state?.from || '/';

  if (!onlyUnAuth && !isAuthChecked) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthChecked) {
    return <Navigate to={from} />;
  }

  return children;
};

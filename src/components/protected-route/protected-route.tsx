import { useSelector } from '../../services/store';
import { Navigate } from 'react-router';

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

  if (!onlyUnAuth && !isAuthChecked) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && isAuthChecked) {
    return <Navigate replace to='/' />;
  }

  return children;
};

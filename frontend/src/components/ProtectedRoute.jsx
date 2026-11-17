import { Navigate, Outlet, useLocation } from 'react-router'

const ProtectedRoute = () => {
  const location = useLocation()
  return localStorage.getItem('token')
    ? <Outlet />
    : <Navigate to='/login' replace state={{ from: location }} />
}

export default ProtectedRoute

import { Navigate, Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { estaAutenticado } from "../services/storeAuth";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    return estaAutenticado()
        ? children || <Outlet />
        : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = { children: PropTypes.node };

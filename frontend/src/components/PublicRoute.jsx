import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { estaAutenticado } from "../services/storeAuth";

const PublicRoute = ({ children }) => estaAutenticado()
    ? <Navigate to="/dashboard" replace />
    : children || <Outlet />;

export default PublicRoute;

PublicRoute.propTypes = { children: PropTypes.node };

import React from "react";
import { useContext } from "react";
import { Navigate , useLocation} from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({children}) =>{
    const { isLoggedin, loading } = useContext(AppContext);
    const location = useLocation()

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    } 
    if(!isLoggedin){
        return <Navigate to='/login' state={{ from: location }} replace/>
    }

    return children;
};

export default ProtectedRoute;
import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify"

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)
    const [loading, setLoading] = useState(true)

    
    const checkAuth = async ()=>{
        setLoading(true);
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true);
                setUserData(data.user || null);
            }else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(null);
        }finally {
            setLoading(false);   
        }
    };

    useEffect(()=>{
        if(backendUrl) checkAuth();
    }, [backendUrl]);
  
    

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            if(data.success){
                setUserData(data.userData || null);
            }else{
                toast.error(data.message || "Failed to fetch user data");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const value = {
        backendUrl,
        isLoggedin, 
        setIsLoggedin,
        userData, 
        setUserData,
        getUserData,
        checkAuth,
        loading,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
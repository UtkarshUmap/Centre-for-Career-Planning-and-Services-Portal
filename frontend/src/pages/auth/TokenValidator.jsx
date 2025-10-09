import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const TokenValidator = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem("ccps-token");

            if(!token){
                navigate("/login");
                return;
            }

            try{
                const {exp} = jwtDecode(token);
                // if the token is expired then it will navigate to login page
                if(Date.now() >= exp*1000){
                    localStorage.removeItem("ccps-token");
                    navigate("/login");
                }
            }
            catch(err){
                // Invalid token format
                localStorage.removeItem("ccps-token");
                navigate("/login");
            }
        }
        checkTokenValidity();
    },[])

}

export default TokenValidator

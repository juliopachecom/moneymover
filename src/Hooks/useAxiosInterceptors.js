import axios from "axios";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { clearLocalStorage } from "./useLocalStorage";

const useAxiosInterceptors = () => {
  const history = useHistory();

  const handleTokenExpiration = useCallback(() => {
    console.log("Token ha expirado, limpiando localStorage y redirigiendo...");
    clearLocalStorage();
    setTimeout(() => history.push("/login"), 500);
  }, [history]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Error de Axios:", error);
        if (error.response && error.response.status === 401) {
          handleTokenExpiration();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [handleTokenExpiration]);

  return null;
};

export { useAxiosInterceptors };

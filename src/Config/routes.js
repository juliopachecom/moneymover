import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login"; 
import { Register } from "../Pages/Register"; 
const routes = [
 {title: "Register", 
  path: "/register", 
  component: Register}, 
  {
    title: "Login",
    path: "/login",
    component: Login, 
  }, 
  {
    title: "",
    path: "/",
    component: Home,
  },
  
];

export default routes;

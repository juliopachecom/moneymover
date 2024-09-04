import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { Changes } from "../Pages/Changes";
import { RecoverPassword } from "../Pages/RecoverPassword";
import { RecoverUpdate } from "../Pages/RecoverUpdate";
import { Directory } from "../Pages/Directory";
import { SendMoney } from "../Pages/SendMoney";
import { Recharge } from "../Pages/Recharge"; 

const routes = [
  {
    title: "Send Money",
    path: "/SendMoney",
    component: SendMoney,
  },

  {
    title: "Directory",
    path: "/directory",
    component: Directory,
  },
  {
    title: "Recover Update",
    path: "/RecoverUpdate",
    component: RecoverUpdate,
  },
  {
    title: "Recover Password",
    path: "/RecoverPassword",
    component: RecoverPassword
  },
  {
    title: "Changes",
    path: "/Changes",
    component: Changes
  },
  {
    title: "Register",
    path: "/Register",
    component: Register
  },
  {
    title: "Login",
    path: "/Login",
    component: Login,
  },
  {
    title: "Recharge",
    path: "/Recharge",
    component: Recharge,
  },
  {
    title: "",
    path: "/",
    component: Home,
  },

];

export default routes;

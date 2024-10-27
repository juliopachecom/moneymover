import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { Changes } from "../Pages/Changes";
import { RecoverPassword } from "../Pages/RecoverPassword";
import { RecoverUpdate } from "../Pages/RecoverUpdate";
import { Directory } from "../Pages/Directory";
import { SendMoney } from "../Pages/SendMoney";
import { Recharge } from "../Pages/Recharge";
import { Profile } from "../Pages/Profile";
import { Movements } from "../Pages/Movements";
import { AccAdm } from "../Pages/AccAdm";
import { AdminDashboard } from "../Pages/AdminDashboard";
import { Users } from "../Pages/Users";
import { UsersR } from "../Pages/UsersR";
import { UsersE } from "../Pages/UsersE";
import { UsersV } from "../Pages/UsersV";
import { CurrencyPrice } from "../Pages/CurrencyPrice";
import { Banks } from "../Pages/Banks";
import { Relation } from "../Pages/Relation";
import { TermsAndConditions } from "../Pages/TermsandConditions"; 
import { Privacy } from "../Pages/Privacy";
import { HomeUsa } from "../Pages/homeusa"; 
import { Verify } from "../Pages/Verify";

const routes = [
{
  title: "HomeUsa",
  path: "/homeusa",
  component: HomeUsa,
},

{
  title: "Privacy",
  path: "/privacy",
  component: Privacy, 
}, 
{
  title: "Terms and Conditions",
  path: "/termsandconditions",
  component: TermsAndConditions,
},
 {
    title: "Relation",
    path: "/Relation",
    component: Relation
 } ,
  { 
    title: "Banks",
    path: "/Banks",
    component: Banks
  },
  {
    title: "CurrencyPrice",
    path: "/CurrencyPrice",
    component: CurrencyPrice
  },
  {
    title: "Users",
    path: "/Users",
    component: Users
  },
  {
    title: "UsersR",
    path: "/UsersR",
    component: UsersR
  },
  {
    title: "UsersE",
    path: "/UsersE",
    component: UsersE
  },
  {
    title: "UsersV",
    path: "/UsersV",
    component: UsersV
  },
  {
    title: "AdminDashboard",
    path: "/AdminDashboard",
    component: AdminDashboard
  },
  {
    title: "AccAdm",
    path: "/AccAdm",
    component: AccAdm
  },
  {
    title: "Movements",
    path: "/Movements",
    component: Movements
  },
  {
    title: "Profile",
    path: "/Profile",
    component: Profile
  },
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
    path: "/RecoverUpdate/:id/:email",
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
    title: "Verify",
    path: "/Verify",
    component: Verify,
  },
  {
    title: "",
    path: "/",
    component: Home,
  },

];

export default routes;

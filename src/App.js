import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { NavBar } from './Components/NavBar';
import { Footer } from './Components/Footer';
import routes from './Config/routes';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Route
          path="/"
          render={({ location }) => {
            const isLoginRoute = location.pathname === "/login" || location.pathname === "/register"  || location.pathname === "/changes" || location.pathname === "/Changes" || location.pathname === "/recoverpassword" || location.pathname === "/recoverupdate" || location.pathname === "/directory"  || location.pathname === "/sendmoney" || location.pathname === "/recharge" || location.pathname === "/profile" || location.pathname === "/Profile" || location.pathname === "/movements" || location.pathname === "/Movements" || location.pathname === "/accadm" || location.pathname === "/AccAdm"   || location.pathname === "/admindashboard" || location.pathname === "/AdminDashboard"; 
            return (
              <>
                {!isLoginRoute && <NavBar />}
                <Switch>
                  {routes.map((route) => (
                    <Route key={route.path} path={route.path} component={route.component} />
                  ))}
                </Switch>
                {!isLoginRoute && <Footer />}
              </>
            );
          }}
        />
      </Router>
    </React.Fragment>
  );
}

export default App;
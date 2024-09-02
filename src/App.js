import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavBar } from "./Components/NavBar";
import { Footer } from "./Components/Footer";
import routes from "./Config/routes";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Route
          path="/"
          render={({ location }) => {
            const isLoginRoute =
              location.pathname === "/Login" ||
              location.pathname === "/Dashboard" ||
              location.pathname === "/Register" ||
              location.pathname === "/Recover" ||
              location.pathname === "/RecoverUpdate" ||
              location.pathname === "/AdmEc";
            return (
              <>
                {!isLoginRoute && <NavBar />}
                <Switch>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      component={route.component}
                    />
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

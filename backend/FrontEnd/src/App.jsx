import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Nav from "./components/Nav";

import Home from "./views/Home";
import Buy from "./views/Buy";
import NotFound from "./views/NotFound";
import Balance from "./views/Balance";

const App = () => {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/buy">
          <Buy />
        </Route>{" "}
        <Route path="/balance">
          <Balance />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;

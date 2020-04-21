import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

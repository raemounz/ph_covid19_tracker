import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

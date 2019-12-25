import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './home';
import ProjectDetail from './project-detail'
const RootRouter: React.StatelessComponent<any> = function (props) {
  return (
    <Router>
      <Switch>
        <Route path="/projectdetail" component={ProjectDetail} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default RootRouter;

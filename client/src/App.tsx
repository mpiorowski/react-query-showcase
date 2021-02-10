import React from "react";
import { Counter } from "./pages/counter/Counter";
import "./App.css";
import { Layout, Menu } from "antd";
import { Link, Route, Switch } from "react-router-dom";
import { Users } from "./pages/users/Users";

function App() {
  return (
    <div className="App">
      <Layout.Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="/">
            <Link to="/">Counter</Link>
          </Menu.Item>
          <Menu.Item key="/users">
            <Link to="/users">Users</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <div className="App-content">
        <Switch>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/" exact={true}>
            <Counter />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;

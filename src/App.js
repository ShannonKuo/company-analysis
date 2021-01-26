import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header.js';
import Menu from './Menu.js';
import Home from './Home.js';
import DataTable from './DataTable.js';


class App extends Component {
  constructor() {
    super()
    this.selectedStock = "AAPL"
  }

  handleSelectStock = (stock) => {
    this.selectedStock = stock
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header></Header>
          <div className="flex-container">
            <Menu
              handleSelectStock={this.handleSelectStock}>
            </Menu>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/:id' component={DataTable} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;

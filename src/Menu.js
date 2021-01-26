import React, { Component } from "react";
import {
  Link,
  withRouter
} from "react-router-dom";
import "./Menu.css";

class Menu extends Component {
  constructor(props) {
    super(props)
    this.stocks = ["AAPL", "FB", "PINS", "BAC", "BABA", "KO", "GOOL", "TWTR", "ADBE", "AMZN", "DIS", "GPRO"]
  }

  handleSelectStock = (stock) => {
    this.props.handleSelectStock(stock)
  }

  handleSearch = (e) => {
    if (e.keyCode == 13) {
      this.props.history.push("/" + e.target.value);
    }
  }

  render() {
    this.menuEle = this.stocks.map((stock) =>
      <li key={stock}>
        <Link
          to={'/' + stock}
          onClick={(e) => this.handleSelectStock(stock, e)}
        > {stock}
        </Link>
      </li>
    )
    return (
      <div className="flex-item-left">
        <input type="text" id="mySearch" onKeyDown={this.handleSearch} placeholder="Search.." title="Type in a category" />
        <div className="menu">
          <ul id="myMenu">
            {this.menuEle}
          </ul>
          <hr />
        </div>
      </div>
    )
  }
}

export default withRouter(Menu);
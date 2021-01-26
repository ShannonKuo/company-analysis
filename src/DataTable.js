import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import './DataTable.css';

class DataTable extends Component {
  constructor(props) {
    super(props)
    this.rowName = [
      "",
      "Market Cap (k)",
      "Number of Shares (k)",
      "Windage Growth Rate",
      "Net Income(k)",
      "Return on Equity (ROE) (%)",
      "Return on Invested Capital (ROIC) (%)",
      "Depreciation & Amortization (k)",
      "Net Change Account Recievable (k)",
      "Net Change Account Payable (k)",
      "Income Tax (k)",
      "Maintenance Capital Expenditures (k)",
      "Owner Earnings(k)",
      "Ten Cap Estimated total price",
      "Ten Cap Estimated share price",
      "Cash Flow from Continuing Operating Activities (k)",
      "Purchase of Property and Equipment (PPE)",
      "Any Other Capital Expenditures for Maintenance and Growth (k)",
      "Free Cash Flow",
      "Payback Time Price",
      "Payback Time Estimated share price",
      "Minimum Acceptable Rate Return",
      "Earnings Per Share",
      "Ｍax of 10 year P/E",
      "Windage P/E",
      "Margin of Safety share price"
    ]
  }
  getData = (rowName) => {
    if (rowName === "Market Cap (k)") return "123";
    return "456"
  }
  render() {
    this.stock = this.props.match.params.id
    this.columnName = [this.stock, "2020-9-29", "2019-9-29"]
    this.columnNameEle = this.columnName.map((name) =>
      <th key={name}> {name} </th>
    )

    this.rowEles = this.rowName.map((name) =>
      <tr key={name}>
        <td> {name} </td>
        <td> {this.getData(name)} </td>
        <td> {this.getData(name)} </td>
      </tr>
    )
    return (
      <div className="flex-item-right">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              {this.columnNameEle}
            </tr>
          </thead>
          <tbody>
            {this.rowEles}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default DataTable;
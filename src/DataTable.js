import React, { Component } from "react";
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import './DataTable.css';
import Api from './utils/Api.js';

class DataTable extends Component {
  constructor(props) {
    super(props)
    this.rowNames = [
      "Date",
      "Market Cap (k)",
      "Stock Price",
      "Number of Shares (k)",
      "Windage Growth Rate",
      "Net Income (k)",
      "Return on Equity (ROE) (%)",
      "Return on Invested Capital (ROIC) (%)",
      "Depreciation & Amortization (k)",
      "Net Change Account Recievable (k)",
      "Net Change Account Payable (k)",
      "Income Tax (k)",
      "Maintenance Capital Expenditures (k)",
      "Owner Earnings(k)",
      "Ten Cap Estimated share price",
      "Cash Flow from Continuing Operating Activities (k)",
      "Purchase of Property and Equipment (PPE)",
      "Any Other Capital Expenditures for Maintenance and Growth (k)",
      "Free Cash Flow (k)",
      "Payback Time Price",
      "Payback Time Estimated share price",
      "Minimum Acceptable Rate Return",
      "Earnings Per Share",
      "Ｍax of 10 year P/E",
      "Windage P/E",
      "Margin of Safety share price"
    ]
    this.api = new Api()
    this.stock = ""

    let tmpTable = {}
    this.rowNames.forEach((rowName) => {
      tmpTable[rowName] = []
    })
    this.state = {
      incomeStatement: [],
      balanceSheetStatement: [],
      cashFlowStatement: [],
      keyMetrics: [],
      enterpriseValues: [],
      financialRatios: [],
      table: tmpTable,
    }
  }

  componentDidMount() {
    this.getFinancialStatement()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps)
      return
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getFinancialStatement()
    }
  }

  getFinancialStatement = () => {
    this.stock = this.props.match.params.id
    const promises = [
      this.api.getIncomeStatement(this.stock),
      this.api.getBalanceSheetStatement(this.stock),
      this.api.getCashFlowStatement(this.stock),
      this.api.getKeyMetrics(this.stock),
      this.api.getEnterpriseValues(this.stock),
      this.api.getFinancialRatios(this.stock),
    ]
    Promise.all(promises)
      .then((values) => {
        this.setState({
          incomeStatement: values[0].data,
          balanceSheetStatement: values[1].data,
          cashFlowStatement: values[2].data,
          keyMetrics: values[3].data,
          enterpriseValues: values[4].data,
          financialRatios: values[5].data
        }, this.setTableData)
      })
      .catch(err => {
        console.log(err)
      })
  }

  setTableState = (rowName, arr) => {
    let copyTable = this.state.table
    copyTable[rowName] = arr
    this.setState({
      table: copyTable
    })
  }

  setTableData = () => {
    let peRatios = this.state.financialRatios.map(ele => ele["priceEarningsRatio"])
    this.rowNames.forEach((rowName) => {
      if (rowName === "Date") {
        this.setTableState(rowName, this.state.incomeStatement.map((ele) => ele["date"]))
      }
      else if (rowName === "Market Cap (k)") {
        this.setTableState(rowName, this.state.enterpriseValues.map((ele) => ele["marketCapitalization"] / 1000))
      }
      else if (rowName === "Stock Price") {
        this.setTableState(rowName, this.state.enterpriseValues.map((ele) => ele["stockPrice"]))
      }
      else if (rowName === "Number of Shares (k)") {
        this.setTableState(rowName, this.state.enterpriseValues.map((ele) => ele["numberOfShares"] / 1000))
      }
      else if (rowName === "Net Income (k)") {
        this.setTableState(rowName, this.state.incomeStatement.map((ele) => ele["netIncome"] / 1000))
      }
      else if (rowName === "Return on Equity (ROE) (%)") {
        this.setTableState(rowName, this.state.keyMetrics.map((ele) => ele["roe"] * 100))
      }
      else if (rowName === "Return on Invested Capital (ROIC) (%)") {
        this.setTableState(rowName, this.state.keyMetrics.map((ele) => ele["roic"] * 100))
      }
      else if (rowName === "Depreciation & Amortization (k)") {
        this.setTableState(rowName, this.state.incomeStatement.map((ele) => ele["depreciationAndAmortization"] / 1000))
      }
      else if (rowName === "Net Change Account Recievable (k)") {
        this.setTableState(rowName, this.state.cashFlowStatement.map((ele) => ele["accountsReceivables"] / 1000))
      }
      else if (rowName === "Net Change Account Payable (k)") {
        this.setTableState(rowName, this.state.cashFlowStatement.map((ele) => ele["accountsPayables"] / 1000))
      }
      else if (rowName === "Income Tax (k)") {
        this.setTableState(rowName, this.state.incomeStatement.map((ele) => (ele["incomeBeforeTax"] - ele["netIncome"]) / 1000))
      }
      else if (rowName === "Maintenance Capital Expenditures (k)") {
        this.setTableState(rowName, this.state.cashFlowStatement.map((ele) => ele["capitalExpenditure"] / 1000))
      }
      else if (rowName === "Owner Earnings(k)") {
        this.setTableState(rowName, this.state.table["Net Income (k)"].map((ele, idx) =>
          ele
          + this.state.table["Depreciation & Amortization (k)"][idx]
          + this.state.table["Net Change Account Recievable (k)"][idx]
          + this.state.table["Net Change Account Payable (k)"][idx]
          + this.state.table["Income Tax (k)"][idx]
          + this.state.table["Maintenance Capital Expenditures (k)"][idx]
        ))
      }
      else if (rowName === "Ten Cap Estimated share price") {
        this.setTableState(rowName, this.state.table["Owner Earnings(k)"].map((ele, idx) =>
          ele * 10 / this.state.table["Number of Shares (k)"][idx]
        ))
      }
      else if (rowName === "Cash Flow from Continuing Operating Activities (k)") {
        this.setTableState(rowName, this.state.cashFlowStatement.map((ele) => ele["netCashProvidedByOperatingActivities"] / 1000))
      }
      else if (rowName === "Purchase of Property and Equipment (PPE)") {
        this.setTableState(rowName, this.state.cashFlowStatement.map((ele) => ele["investmentsInPropertyPlantAndEquipment"] / 1000))
      }
      else if (rowName === "Any Other Capital Expenditures for Maintenance and Growth (k)") {
        this.setTableState(rowName, this.state.cashFlowStatement.map((ele) => (ele["capitalExpenditure"] - ele["investmentsInPropertyPlantAndEquipment"]) / 1000))
      }
      else if (rowName === "Free Cash Flow (k)") {
        let freeCashFlow = this.state.cashFlowStatement.map(ele => ele["freeCashFlow"] / 1000)
        this.setTableState(rowName, freeCashFlow)
        // this.setTableState(rowName, this.state.table["Cash Flow from Continuing Operating Activities (k)"].map((ele, idx) =>
        //   ele
        //   + this.state.table["Purchase of Property and Equipment (PPE)"][idx]
        //   + this.state.table["Any Other Capital Expenditures for Maintenance and Growth (k)"][idx]
        // ))
      }
      else if (rowName === "Minimum Acceptable Rate Return") {
        this.setTableState(rowName, this.state.incomeStatement.map((ele) => 0.15))
      }
      else if (rowName === "Earnings Per Share") {
        this.setTableState(rowName, this.state.incomeStatement.map((ele) => ele["eps"]))
      }
      else if (rowName === "Ｍax of 10 year P/E") {
        this.setTableState(rowName, peRatios.map((ele, idx) => {
          let tmpArr = peRatios.slice(idx, idx + 10)
          console.log(tmpArr)
          return Math.max(...tmpArr)
        }))
      }
      else {
        this.setTableState(rowName, [])
      }
    })
  }

  format = (number) => {
    if (number == null) return 0
    var parts = number.toString().split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    if (parts.length > 1)
      parts[1] = parts[1].slice(0, 2)
    return parts.join(".")
  }

  render() {
    this.columnNameEle = (
      <tr>
        <th key={"name"}> {"name"} </th>
      </tr>
    )
    this.rowEles = this.rowNames.map((name) =>
      <tr key={name}>
        <td> {name} </td>
        {this.state.table[name].map((ele) =>
          <td> {this.format(ele)} </td>
        )}
      </tr>
    )

    return (
      <div className="flex-item-right">
        <Table striped bordered hover variant="dark">
          <thead>
            {this.columnNameEle}
          </thead>
          <tbody>
            {this.rowEles}
          </tbody>

        </Table>
      </div>
    )
  }
}

export default withRouter(DataTable);
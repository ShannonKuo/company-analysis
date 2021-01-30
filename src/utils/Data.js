import Api from './Api.js'

export default class Data {
  constructor() {
    this.api = new Api()

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
    this.incomeStatement = []
    this.balanceSheetStatement = []
    this.cashFlowStatement = []
    this.keyMetrics = []
    this.enterpriseValues = []
    this.financialRatios = []
    this.table = {}
    this.rowNames.forEach((rowName) => {
      this.table[rowName] = []
    })
  }

  getRowNames = () => {
    return this.rowNames
  }

  getInitTableData = () => this.table


  getTableData = (stock) => {
    const promises = [
      this.api.getIncomeStatement(stock),
      this.api.getBalanceSheetStatement(stock),
      this.api.getCashFlowStatement(stock),
      this.api.getKeyMetrics(stock),
      this.api.getEnterpriseValues(stock),
      this.api.getFinancialRatios(stock),
    ]
    return Promise.all(promises)
      .then((values) => {
        this.incomeStatement = values[0].data
        this.balanceSheetStatement = values[1].data
        this.cashFlowStatement = values[2].data
        this.keyMetrics = values[3].data
        this.enterpriseValues = values[4].data
        this.financialRatios = values[5].data
        this.constructTableData()
        return this.table
      })
      .catch(err => {
        console.log("Error", err)
        return this.table
      })

  }

  constructTableData = () => {
    let peRatios = this.financialRatios.map(ele => ele["priceEarningsRatio"])
    this.rowNames.forEach((rowName) => {
      if (rowName === "Date") {
        this.table[rowName] = this.state.incomeStatement.map((ele) => ele["date"])
      }
      else if (rowName === "Market Cap (k)") {
        this.table[rowName] = this.state.enterpriseValues.map((ele) => ele["marketCapitalization"] / 1000)
      }
      else if (rowName === "Stock Price") {
        this.table[rowName] = this.state.enterpriseValues.map((ele) => ele["stockPrice"])
      }
      else if (rowName === "Number of Shares (k)") {
        this.table[rowName] = this.state.enterpriseValues.map((ele) => ele["numberOfShares"] / 1000)
      }
      else if (rowName === "Net Income (k)") {
        this.table[rowName] = this.state.incomeStatement.map((ele) => ele["netIncome"] / 1000)
      }
      else if (rowName === "Return on Equity (ROE) (%)") {
        this.table[rowName] = this.state.keyMetrics.map((ele) => ele["roe"] * 100)
      }
      else if (rowName === "Return on Invested Capital (ROIC) (%)") {
        this.table[rowName] = this.state.keyMetrics.map((ele) => ele["roic"] * 100)
      }
      else if (rowName === "Depreciation & Amortization (k)") {
        this.table[rowName] = this.state.incomeStatement.map((ele) => ele["depreciationAndAmortization"] / 1000)
      }
      else if (rowName === "Net Change Account Recievable (k)") {
        this.table[rowName] = this.state.cashFlowStatement.map((ele) => ele["accountsReceivables"] / 1000)
      }
      else if (rowName === "Net Change Account Payable (k)") {
        this.table[rowName] = this.state.cashFlowStatement.map((ele) => ele["accountsPayables"] / 1000)
      }
      else if (rowName === "Income Tax (k)") {
        this.table[rowName] = this.state.incomeStatement.map((ele) => (ele["incomeBeforeTax"] - ele["netIncome"]) / 1000)
      }
      else if (rowName === "Maintenance Capital Expenditures (k)") {
        this.table[rowName] = this.state.cashFlowStatement.map((ele) => ele["capitalExpenditure"] / 1000)
      }
      else if (rowName === "Owner Earnings(k)") {
        this.table[rowName] = this.state.table["Net Income (k)"].map((ele, idx) =>
          ele
          + this.state.table["Depreciation & Amortization (k)"][idx]
          + this.state.table["Net Change Account Recievable (k)"][idx]
          + this.state.table["Net Change Account Payable (k)"][idx]
          + this.state.table["Income Tax (k)"][idx]
          + this.state.table["Maintenance Capital Expenditures (k)"][idx]
        )
      }
      else if (rowName === "Ten Cap Estimated share price") {
        this.table[rowName] = this.state.table["Owner Earnings(k)"].map((ele, idx) =>
          ele * 10 / this.state.table["Number of Shares (k)"][idx]
        )
      }
      else if (rowName === "Cash Flow from Continuing Operating Activities (k)") {
        this.table[rowName] = this.state.cashFlowStatement.map((ele) => ele["netCashProvidedByOperatingActivities"] / 1000)
      }
      else if (rowName === "Purchase of Property and Equipment (PPE)") {
        this.table[rowName] = this.state.cashFlowStatement.map((ele) => ele["investmentsInPropertyPlantAndEquipment"] / 1000)
      }
      else if (rowName === "Any Other Capital Expenditures for Maintenance and Growth (k)") {
        this.table[rowName] = this.state.cashFlowStatement.map((ele) => (ele["capitalExpenditure"] - ele["investmentsInPropertyPlantAndEquipment"]) / 1000)
      }
      else if (rowName === "Free Cash Flow (k)") {
        let freeCashFlow = this.state.cashFlowStatement.map(ele => ele["freeCashFlow"] / 1000)
        this.table[rowName] = freeCashFlow
        // this.setTableState(rowName, this.state.table["Cash Flow from Continuing Operating Activities (k)"].map((ele, idx) =>
        //   ele
        //   + this.state.table["Purchase of Property and Equipment (PPE)"][idx]
        //   + this.state.table["Any Other Capital Expenditures for Maintenance and Growth (k)"][idx]
        // ))
      }
      else if (rowName === "Minimum Acceptable Rate Return") {
        this.table[rowName] = this.state.incomeStatement.map((ele) => 0.15)
      }
      else if (rowName === "Earnings Per Share") {
        this.table[rowName] = this.state.incomeStatement.map((ele) => ele["eps"])
      }
      else if (rowName === "Ｍax of 10 year P/E") {
        this.table[rowName] = peRatios.map((ele, idx) => {
          let tmpArr = peRatios.slice(idx, idx + 10)
          console.log(tmpArr)
          return Math.max(...tmpArr)
        })
      }
      else {
        this.table[rowName] = []
      }
    })
  }
}
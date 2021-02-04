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
    this.financialGrowth = []
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
    console.log("###", stock)
    let inStorage = this.getFromLocalStorage(stock)
    console.log("in storage?", inStorage)
    console.log("length", this.incomeStatement.length)
    if (inStorage) {
      this.constructTableData()
      return Promise.resolve(this.table)
    }
    let promises = [
      this.api.getIncomeStatement(stock),
      this.api.getBalanceSheetStatement(stock),
      this.api.getCashFlowStatement(stock),
      this.api.getKeyMetrics(stock),
      this.api.getEnterpriseValues(stock),
      this.api.getFinancialRatios(stock),
      this.api.getFinancialGrowth(stock),
    ]
    return Promise.all(promises)
      .then((values) => {
        this.incomeStatement = values[0].data
        this.balanceSheetStatement = values[1].data
        this.cashFlowStatement = values[2].data
        this.keyMetrics = values[3].data
        this.enterpriseValues = values[4].data
        this.financialRatios = values[5].data
        this.financialGrowth = values[6].data
        this.constructTableData()
        this.saveToLocalStorage(stock)
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
        this.table[rowName] = this.incomeStatement.map((ele) => ele["date"])
      }
      else if (rowName === "Market Cap (k)") {
        this.table[rowName] = this.enterpriseValues.map((ele) => ele["marketCapitalization"] / 1000)
      }
      else if (rowName === "Stock Price") {
        this.table[rowName] = this.enterpriseValues.map((ele) => ele["stockPrice"])
      }
      else if (rowName === "Number of Shares (k)") {
        this.table[rowName] = this.enterpriseValues.map((ele) => ele["numberOfShares"] / 1000)
      }
      else if (rowName === "Windage Growth Rate") {
        this.table[rowName] = this.calculateWindageGrowthRate()
      }
      else if (rowName === "Net Income (k)") {
        this.table[rowName] = this.incomeStatement.map((ele) => ele["netIncome"] / 1000)
      }
      else if (rowName === "Return on Equity (ROE) (%)") {
        this.table[rowName] = this.keyMetrics.map((ele) => ele["roe"] * 100)
      }
      else if (rowName === "Return on Invested Capital (ROIC) (%)") {
        this.table[rowName] = this.keyMetrics.map((ele) => ele["roic"] * 100)
      }
      else if (rowName === "Depreciation & Amortization (k)") {
        this.table[rowName] = this.incomeStatement.map((ele) => ele["depreciationAndAmortization"] / 1000)
      }
      else if (rowName === "Net Change Account Recievable (k)") {
        this.table[rowName] = this.cashFlowStatement.map((ele) => ele["accountsReceivables"] / 1000)
      }
      else if (rowName === "Net Change Account Payable (k)") {
        this.table[rowName] = this.cashFlowStatement.map((ele) => ele["accountsPayables"] / 1000)
      }
      else if (rowName === "Income Tax (k)") {
        this.table[rowName] = this.incomeStatement.map((ele) => (ele["incomeBeforeTax"] - ele["netIncome"]) / 1000)
      }
      else if (rowName === "Maintenance Capital Expenditures (k)") {
        this.table[rowName] = this.cashFlowStatement.map((ele) => ele["capitalExpenditure"] / 1000)
      }
      else if (rowName === "Owner Earnings(k)") {
        this.table[rowName] = this.table["Net Income (k)"].map((ele, idx) =>
          ele
          + this.table["Depreciation & Amortization (k)"][idx]
          + this.table["Net Change Account Recievable (k)"][idx]
          + this.table["Net Change Account Payable (k)"][idx]
          + this.table["Income Tax (k)"][idx]
          + this.table["Maintenance Capital Expenditures (k)"][idx]
        )
      }
      else if (rowName === "Ten Cap Estimated share price") {
        this.table[rowName] = this.table["Owner Earnings(k)"].map((ele, idx) =>
          ele * 10 / this.table["Number of Shares (k)"][idx]
        )
      }
      else if (rowName === "Cash Flow from Continuing Operating Activities (k)") {
        this.table[rowName] = this.cashFlowStatement.map((ele) => ele["netCashProvidedByOperatingActivities"] / 1000)
      }
      else if (rowName === "Purchase of Property and Equipment (PPE)") {
        this.table[rowName] = this.cashFlowStatement.map((ele) => ele["investmentsInPropertyPlantAndEquipment"] / 1000)
      }
      else if (rowName === "Any Other Capital Expenditures for Maintenance and Growth (k)") {
        this.table[rowName] = this.cashFlowStatement.map((ele) => (ele["capitalExpenditure"] - ele["investmentsInPropertyPlantAndEquipment"]) / 1000)
      }
      else if (rowName === "Free Cash Flow (k)") {
        let freeCashFlow = this.cashFlowStatement.map(ele => ele["freeCashFlow"] / 1000)
        this.table[rowName] = freeCashFlow
        // this.table[rowName] = this.table["Cash Flow from Continuing Operating Activities (k)"].map((ele, idx) =>
        //   ele
        //   + this.table["Purchase of Property and Equipment (PPE)"][idx]
        //   + this.table["Any Other Capital Expenditures for Maintenance and Growth (k)"][idx]
        // ))
      }
      else if (rowName === "Payback Time Estimated share price") {
        this.table[rowName] = this.table["Free Cash Flow (k)"].map((cashFlow, idx) => {
          let growthRate = this.table["Windage Growth Rate"][idx]
          let shareNum = this.table["Number of Shares (k)"][idx]
          return cashFlow * (1 + growthRate) * (1 - (1 + growthRate) ** 8) / (1 - (1 + growthRate)) / shareNum
        })
      }
      else if (rowName === "Minimum Acceptable Rate Return") {
        this.table[rowName] = this.incomeStatement.map((ele) => 0.15)
      }
      else if (rowName === "Earnings Per Share") {
        this.table[rowName] = this.incomeStatement.map((ele) => ele["eps"])
      }
      else if (rowName === "Ｍax of 10 year P/E") {
        this.table[rowName] = peRatios.map((ele, idx) => {
          let tmpArr = peRatios.slice(idx, idx + 10)
          return Math.max(...tmpArr)
        })
      }
      else if (rowName === "Windage P/E") {
        this.table[rowName] = this.table["Windage Growth Rate"].map((rate, idx) =>
          Math.min(200 * rate, this.table["Ｍax of 10 year P/E"][idx])
        )
      }
      else if (rowName === "Margin of Safety share price") {
        this.table[rowName] = this.table["Earnings Per Share"].map((earning, idx) => {
          let growthRate = this.table["Windage Growth Rate"][idx]
          return earning * ((1 + growthRate) ** 10) * this.table["Windage P/E"][idx] / ((1 + this.table["Minimum Acceptable Rate Return"][idx]) ** 10) / 2
        })
      }
      else {
        this.table[rowName] = []
      }
    })
  }
  getFromLocalStorage = (stock) => {
    let date = new Date().toLocaleDateString("en-US");
    let key = stock + '_' + date
    let data = JSON.parse(localStorage.getItem(key) || "{}")
    let inStorage = true
    if (data["incomeStatement"]) {
      this.incomeStatement = data["incomeStatement"]
    }
    else inStorage = false
    if (data["balanceSheetStatement"]) {
      this.balanceSheetStatement = data["balanceSheetStatement"]
    }
    else inStorage = false
    if (data["cashFlowStatement"]) {
      this.cashFlowStatement = data["cashFlowStatement"]
    }
    else inStorage = false
    if (data["keyMetrics"]) {
      this.keyMetrics = data["keyMetrics"]
    }
    else inStorage = false
    if (data["enterpriseValues"]) {
      this.enterpriseValues = data["enterpriseValues"]
    }
    else inStorage = false
    if (data["financialRatios"]) {
      this.financialRatios = data["financialRatios"]
    }
    else inStorage = false
    if (data["financialGrowth"]) {
      this.financialGrowth = data["financialGrowth"]
    }
    else inStorage = false
    return inStorage
  }
  saveToLocalStorage = (stock) => {
    let data = {}
    let date = new Date().toLocaleDateString("en-US");
    let key = stock + '_' + date
    data = {
      incomeStatement: this.incomeStatement,
      balanceSheetStatement: this.balanceSheetStatement,
      cashFlowStatement: this.cashFlowStatement,
      keyMetrics: this.keyMetrics,
      enterpriseValues: this.enterpriseValues,
      financialRatios: this.financialRatios,
      financialGrowth: this.financialGrowth,
    }
    localStorage.setItem(key, JSON.stringify(data))
  }

  calculateWindageGrowthRate = () => {
    return this.incomeStatement.map((ele, idx) => {
      let allGrowth = []
      for (let i = idx; i < idx + 10; i++) {
        if (i >= this.financialGrowth.length) break
        allGrowth.push(this.financialGrowth[i]["netIncomeGrowth"])
        allGrowth.push(this.financialGrowth[i]["revenueGrowth"])
        allGrowth.push(this.financialGrowth[i]["operatingCashFlowGrowth"])
      }
      allGrowth = allGrowth.sort()
      allGrowth = allGrowth.slice(0.2 * allGrowth.length, 0.8 * allGrowth.length)
      const avg = allGrowth.reduce((a, b) => a + b, 0) / allGrowth.length
      return avg
    })

  }
}
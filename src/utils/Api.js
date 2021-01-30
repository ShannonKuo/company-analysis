import * as axios from "axios";

export default class Api {
  constructor() {
    this.api_key = "a038c63a48e01558059b2ee770913be2"
    this.client = null
    this.api_url = "https://financialmodelingprep.com/api/v3/"
    this.params = {
      params: {
        apikey: this.api_key,
        limit: 5,
      }
    }
  }

  init = () => {
    this.client = axios.create({
      baseURL: this.api_url,
      timeout: 31000,
    })
    return this.client
  }

  getStockProfile = (stock) => {
    return this.init().get("/profile/" + stock, this.params)
  }

  getIncomeStatement(stock) {
    return this.init().get("/income-statement/" + stock, this.params)
  }

  getBalanceSheetStatement(stock) {
    return this.init().get("/balance-sheet-statement/" + stock, this.params)
  }

  getCashFlowStatement(stock) {
    return this.init().get("/cash-flow-statement/" + stock, this.params)
  }

  getCashFlowStatementAsReported(stock) {
    return this.init().get("/cash-flow-statement-as-reported/" + stock, this.params)
  }

  getKeyMetrics(stock) {
    return this.init().get("/key-metrics/" + stock, this.params)
  }

  getEnterpriseValues(stock) {
    return this.init().get("/enterprise-values/" + stock, this.params)
  }

  getFinancialRatios(stock) {
    let tmpParams = this.params
    tmpParams.params.limit = this.params.params.limit
    return this.init().get("/ratios/" + stock, tmpParams)
  }
}
import React, { Component } from "react";
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import './DataTable.css';
import Data from './utils/Data.js'

class DataTable extends Component {
  constructor(props) {
    super(props)

    this.data = new Data()
    this.rowNames = this.data.getRowNames()
    this.stock = ""
    this.state = {
      table: this.data.getInitTableData(),
    }
  }

  componentDidMount() {
    this.stock = this.props.match.params.id
    this.data.getTableData(this.stock)
      .then(d => {
        this.setState({
          table: d
        })
      })
  }

  componentDidUpdate(prevProps) {
    if (!prevProps)
      return
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.stock = this.props.match.params.id
      this.data.getTableData(this.stock)
        .then(d => {
          this.setState({
            table: d
          })
        })
    }
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
        <th key={"name"}> {this.stock} </th>
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
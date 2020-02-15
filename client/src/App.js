import React, { Component } from "react";
import Web3 from "./services/web3";

import "./App.css";

class App extends Component {
  state = { accounts: [], web3: null, connectError: null };

  componentDidMount = async () => {
    try {
      const web3 = await Web3();

      this.setState({ web3 });
    } catch (error) {
      console.error(error);
    }
  };

  disconnectAccounts = () => {
    this.setState({ accounts: [] });
  };

  getAccounts = () => {
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getAccounts(async (error, accounts) => {
        if (error) {
          return reject(error);
        }

        return resolve(accounts);
      });
    });
  };

  openMetaMask = async () => {
    try {
      let accounts = await this.getAccounts();

      if (!accounts || accounts.length === 0) {
        await this.state.web3.connect();
        accounts = await this.getAccounts();
      }

      this.setState({
        connectError: null,
        accounts
      });
    } catch (e) {
      console.error(e);
      this.setState({
        connectError: {
          code: e.code,
          message: e.message
        }
      });
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading...</div>;
    }

    if (this.state.connectError) {
      return (
        <div className="App">
          Metamask did not connect - {this.state.connectError.message}
        </div>
      );
    }

    if (!this.state.accounts || this.state.accounts.length === 0) {
      return (
        <div className="App">
          <button onClick={this.openMetaMask}>Connect via Metamask</button>
        </div>
      );
    }

    return (
      <div className="App">
        {this.state.accounts.map(acct => {
          return <div key="acct">{acct}</div>;
        })}
         <button onClick={this.disconnectAccounts}>Disconnect Account</button>
      </div>
    );
  }
}

export default App;

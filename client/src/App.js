import React, { Component } from "react";
import Header from "./Header.js";
import Room from "./Room.js";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./App.css";

const host =
  process.env.NODE_ENV === "development"
    ? "localhost"
    : "megaport-tickets.herokuapp.com";

class App extends Component {
  ws = new W3CWebSocket(`wss://${host}`);

  render() {
    console.log("process.env: ", process.env);
    return (
      <div className="App">
        <Header />
        <Room ws={this.ws} />
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import Header from "./Header.js";
import Room from "./Room.js";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./App.css";

class App extends Component {
  ws = new W3CWebSocket("ws://localhost:5000");

  render() {
    return (
      <div className="App" style={{ height: "100vh" }}>
        <Header />
        <Room ws={this.ws} />
      </div>
    );
  }
}

export default App;

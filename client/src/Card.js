import React, { Component } from "react";

class Card extends Component {
  render() {
    const { id, handleMsg } = this.props;

    const sendMsg = () => {
      !this.props.hasChosen && id && handleMsg(id);
    };

    return (
      <li
        onClick={sendMsg}
        className="Card relative rounded-lg h-20 shadow-md flex justify-center items-center mb-16 p-4 w-24 mx-2"
        style={{
          border: "3px solid #FF0000",
          cursor: "pointer",
          backgroundColor:
            this.props.hasChosen === id ? "#FF0000" : "#FFF",
          transition: "0.3s ease",
        }}
      >
        <h1
          style={{
            color: this.props.hasChosen === id ? "#FFF" : "#FF0000",
            fontSize: "36px",
            fontWeight: "800",
          }}
        >
          {id}
        </h1>
      </li>
    );
  }
}

export default Card;

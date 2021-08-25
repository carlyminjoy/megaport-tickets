import React, { Component } from "react";

class Card extends Component {
  sendMsg = () => {
    !this.props.cardsRevealed &&
      this.props.id &&
      this.props.handleMsg(this.props.id);
  };

  render() {
    const { id, cardsRevealed } = this.props;
    const isChosen = this.props.hasChosen === id;

    return (
      <li
        onClick={this.sendMsg}
        className={`Card relative rounded-lg h-20 shadow-md flex justify-center items-center mb-16 p-4 w-24 mx-2 ${
          !cardsRevealed && !isChosen && "hover-effects"
        }`}
        style={{
          border: `3px solid rgba(255, 0, 0, 1)`,
          cursor: "pointer",
          backgroundColor: isChosen ? `rgb(255, 0, 0)` : "#FFF",
          transition: "0.3s ease",
          transform: isChosen ? "scale(1.1)" : "",
        }}
      >
        <h1
          style={{
            color: isChosen ? "#FFF" : "#FF0000",
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

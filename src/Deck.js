import React, { Component } from "react";
import Card from "./Deck.js";

class Deck extends Component {
  constructor(props) {
    super(props);
    this.sequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  }

  render() {
    const { handleMsg, hasChosen } = this.props;

    return (
      <ul className="flex flex-wrap justify-center">
        {this.sequence.map((num) => {
          return (
            <Card
              id={num}
              handleMsg={handleMsg}
              key={num}
              hasChosen={hasChosen}
            />
          );
        })}
      </ul>
    );
  }
}

export default Deck;

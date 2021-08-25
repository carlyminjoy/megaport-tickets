import React, { Component } from "react";
import Card from "./Card.js";

class Deck extends Component {
  constructor(props) {
    super(props);
    this.sequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  }

  render() {
    const { handleMsg, hasChosen, cardsRevealed } = this.props;

    return (
      <ul className="flex flex-wrap justify-center">
        {this.sequence.map((num) => {
          return (
            <Card
              id={num}
              handleMsg={handleMsg}
              key={num}
              hasChosen={hasChosen}
              cardsRevealed={cardsRevealed}
            />
          );
        })}
      </ul>
    );
  }
}

export default Deck;

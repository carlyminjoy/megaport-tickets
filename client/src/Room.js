import React, { Component } from "react";
import Deck from "./Deck.js";
import ChosenCard from "./ChosenCard.js";

class Room extends Component {
  constructor(props) {
    super(props);
    const user = this.getUserFromCookie();
    this.state = {
      yourCard: null,
      username: user,
      hasUsername: user !== "",
      hasChosen: null,
      allCards: [],
      revealCards: false,
      revealing: false,
      count: 3,
      users: [],
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserSubmit = this.handleUserSubmit.bind(this);

    props.ws.onmessage = (event) => {
      console.log("ws event: ", event);
      const cardData = JSON.parse(event.data).message;
      const newConnection =
        JSON.parse(event.data).connection === "ok";

      if (cardData?.type === "cardChosen") {
        this.setCard(cardData);
      } else if (cardData?.type === "newUser") {
        this.setState({
          users: [...this.state.users, cardData.username],
        });
      } else if (newConnection) {
        if (
          this.state.users[0] === this.state.username &&
          cardData.username !== this.state.username
        ) {
          props.ws.send(
            JSON.stringify({
              type: "shareState",
              to: cardData.username,
              state: {
                allCards: this.state.allCards,
                revealCards: this.state.revealCards,
                revealing: this.state.revealing,
                count: this.state.count,
                users: this.state.users,
              },
            })
          );
        }
      } else if (cardData?.type === "reveal") {
        this.countdown();
      } else if (cardData?.type === "newGame") {
        this.setState({ yourCard: null });
        this.setState({ hasChosen: null });
        this.setState({ revealCards: false });
        this.setState({ allCards: [] });
      } else if (
        cardData?.type === "shareState" &&
        cardData?.to === this.state.username
      ) {
        this.setState({ allCards: cardData.state.allCards });
        this.setState({ revealCards: cardData.state.revealCards });
        this.setState({ revealing: cardData.state.revealing });
        this.setState({ count: cardData.state.count });
        this.setState({ users: cardData.state.users });
      }
    };
  }

  getUserFromCookie() {
    let decodedCookie = decodeURIComponent(document.cookie);
    let properties = decodedCookie.split(";");
    const userCookie = properties.find((p) => p.includes("username"));
    return userCookie ? userCookie.split("=")[1] : "";
  }

  setCard = (card) => {
    this.setState({ yourCard: card });
    this.setState({ allCards: [...this.state.allCards, card] });
  };

  revealCards = () => {
    this.props.ws.send(
      JSON.stringify({
        type: "reveal",
      })
    );
  };

  newGame = () => {
    this.props.ws.send(
      JSON.stringify({
        type: "newGame",
      })
    );
  };

  handleUserSubmit() {
    console.log("1");
    this.setState({ hasUsername: true });
    console.log("2");

    this.addUser();
    document.cookie = `username=${this.state.username}`;
    console.log("3");
  }

  handleUserChange(event) {
    this.setState({ username: event.target.value });
  }

  addUser() {
    console.log("adding me as user");
    this.props.ws.send(
      JSON.stringify({
        type: "newUser",
        username: this.state.username,
      })
    );
  }

  countdown() {
    this.setState({ revealing: true });
    const timer = setInterval(() => {
      if (this.state.count === 1) {
        this.setState({ revealing: false });
        this.setState({ revealCards: true });
        this.setState({ count: 4 });
        clearInterval(timer);
      }
      this.setState({ count: this.state.count - 1 });
    }, 1000);
  }

  render() {
    const chooseCard = (id) => {
      this.props.ws.send(
        JSON.stringify({
          type: "cardChosen",
          id: id,
          username: this.state.username,
        })
      );
      this.setState({ hasChosen: id });
    };

    return (
      <div className="p-8">
        {!this.state.hasUsername && (
          <form
            className="w-full flex justify-center"
            onSubmit={this.handleUserSubmit}
          >
            <div className="flex items-center justify-center border-b border-gray-300 py-2 max-w-sm">
              <input
                className="bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                placeholder="Name"
                type="text"
                value={this.state.username}
                onChange={this.handleUserChange}
              />
              <button
                className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="submit"
              >
                Let me in
              </button>
            </div>
          </form>
        )}
        {this.state.hasUsername && (
          <div>
            <div
              className="flex h-80 justify-center items-center"
              style={{ flexDirection: "column" }}
            >
              <div className="flex justify-center items-center">
                {this.state.allCards.length === 0 && (
                  <h1 className="center">Someone make a move!</h1>
                )}
                {this.state.allCards.length > 0 &&
                  this.state.allCards.map((card) => {
                    return (
                      <ChosenCard
                        reveal={this.state.revealCards}
                        id={card.id}
                        username={card.username}
                        key={card.id}
                      />
                    );
                  })}
              </div>
              {!this.state.revealing &&
                this.state.allCards.length > 0 && (
                  <div className="h-16">
                    <button
                      onClick={
                        this.state.revealCards
                          ? this.newGame
                          : this.revealCards
                      }
                      className="shadow-md bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                      {this.state.revealCards
                        ? "Play again?"
                        : "Everybody's in!"}
                    </button>
                  </div>
                )}
              {this.state.revealing && (
                <div className="h-16">
                  <h1>{this.state.count}</h1>
                </div>
              )}
            </div>
            <Deck
              handleMsg={chooseCard}
              hasChosen={this.state.hasChosen}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Room;

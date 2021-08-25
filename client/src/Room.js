import React, { Component } from "react";
import Deck from "./Deck.js";
import ChosenCard from "./ChosenCard.js";

class Room extends Component {
  constructor(props) {
    super(props);
    const user = this.getUserFromCookie();

    this.state = {
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
    this.setupSocketEvents();
  }

  setupSocketEvents = () => {
    this.props.ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      const actions = {
        connected: this.addUser,
        reveal: this.countdown,
        newGame: this.setupNewGame,
        newUser: this.handleNewUser,
        cardChosen: this.setCard,
        shareState: this.shareState,
      };
      console.log("eventData: ", eventData);
      actions[eventData.type](eventData);
    };
  };

  shareState = (eventData) => {
    this.setState({ allCards: eventData.state.allCards });
    this.setState({ revealCards: eventData.state.revealCards });
    this.setState({ revealing: eventData.state.revealing });
    this.setState({ count: eventData.state.count });
    this.setState({ users: eventData.state.users });
  };

  setupNewGame = () => {
    this.setState({ hasChosen: null });
    this.setState({ revealCards: false });
    this.setState({ allCards: [] });
  };

  handleNewUser = (eventData) => {
    this.setState({
      users: [...this.state.users, eventData.username],
    });

    if (eventData.username !== this.state.username) {
      this.props.ws.send(
        JSON.stringify({
          type: "shareState",
          to: eventData.username,
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
  };

  getUserFromCookie = () => {
    let decodedCookie = decodeURIComponent(document.cookie);
    let properties = decodedCookie.split(";");
    const userCookie = properties.find((p) => p.includes("username"));
    return userCookie ? userCookie.split("=")[1] : "";
  };

  setCard = (card) => {
    let found = false;

    this.state.allCards.forEach((c, i) => {
      if (c.username === card.username) {
        let newCardsList = this.state.allCards;
        newCardsList[i] = card;
        this.setState({ allCards: newCardsList });
        found = true;
      }
    });

    if (!found) {
      this.setState({ allCards: [...this.state.allCards, card] });
    }
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

  handleUserSubmit = () => {
    this.setState({ hasUsername: true });
    this.addUser();
    document.cookie = `username=${this.state.username}`;
  };

  handleUserChange = (event) => {
    this.setState({ username: event.target.value });
  };

  addUser = () => {
    if (!this.state?.username) return;
    this.props.ws.send(
      JSON.stringify({
        type: "newUser",
        username: this.state.username,
      })
    );
  };

  countdown = () => {
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
  };

  chooseCard = (id) => {
    this.props.ws.send(
      JSON.stringify({
        type: "cardChosen",
        id: id,
        username: this.state.username,
      })
    );
    this.setState({ hasChosen: id });
  };

  render() {
    const userForm = (
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
            className="shadow-md bg-purple-500 border-purple-500 border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Let me in
          </button>
        </div>
      </form>
    );

    const playButton = (
      <div className="h-16">
        <button
          onClick={
            this.state.revealCards ? this.newGame : this.revealCards
          }
          className="shadow-md bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {this.state.revealCards ? "Go again" : "Everybody's in"}
        </button>
      </div>
    );

    return (
      <div
        className="p-4"
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {!this.state.hasUsername && userForm}

        {this.state.hasUsername && (
          <div>
            <div
              className="flex h-80 justify-center items-center"
              style={{ flexDirection: "column" }}
            >
              <div className="flex justify-center items-center">
                {this.state.allCards.length === 0 && (
                  <h1 className="center">Pick a card</h1>
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
                this.state.allCards.length > 0 &&
                playButton}

              {this.state.revealing && (
                <div className="h-16">
                  <h1
                    style={{
                      color: "#6500d1",
                      fontWeight: "700",
                      fontSize: "2rem",
                    }}
                  >
                    {this.state.count}
                  </h1>
                </div>
              )}
            </div>

            <Deck
              cardsRevealed={this.state.revealCards}
              handleMsg={this.chooseCard}
              hasChosen={this.state.hasChosen}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Room;

import React, { Component } from "react";

class ChosenCard extends Component {
  render() {
    const { id, username, reveal } = this.props;
    let classes =
      "relative rounded-lg h-36 shadow-md flex justify-center items-center mb-8 p-3 w-40 mx-2";
    classes += reveal ? "" : " bg-red";

    return (
      <div
        className={classes}
        style={{
          backgroundSize: "contain",
          backgroundPosition: "center",
          flexDirection: "column",
          border: "3px solid #FF0000",
        }}
      >
        <h1
          style={{
            color: reveal ? "#FF0000" : "#F8F9FA",
            fontSize: "60px",
            fontWeight: "800",
            lineHeight: "1",
            transition: "1s ease",
          }}
        >
          {reveal ? id : "?"}
        </h1>
        <h3
          style={{
            color: reveal ? "#FF0000" : "#F8F9FA",
            fontWeight: 700,
            transition: "1s ease",
          }}
        >
          {username}
        </h3>
      </div>
    );
  }
}

export default ChosenCard;

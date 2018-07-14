import React, { Component } from "react";
import celebrateIcon from "./confetti.svg";
import PlaceGrid from "./placeGrid";
import EventGrid from "./eventGrid";
import Typography from "@material-ui/core/Typography";

class SubmittedPage extends Component {
  render() {
    const { travelData } = this.props;
    return (
      <div>
        <Typography align="center" variant="title">{`Your trip to ${
          travelData.trip.destination
        } is confirmed!`}</Typography>
        <Typography>
          We have created a playlist for your upcoming travel.{" "}
        </Typography>
        <a href="https://open.spotify.com/user/thesoundsofspotify/playlist/7IR0ERiQt7fHQCc79iAafg">
          Click this link to access the playlist
        </a>
        <div>
          {`Do you like music? Check these places and events out while you are at ${
            travelData.trip.destination
          }`}
        </div>
        <div>
          Places:
          <PlaceGrid />
        </div>
        <div>
          Events:
          <EventGrid />
        </div>
      </div>
    );
  }
}

export default SubmittedPage;

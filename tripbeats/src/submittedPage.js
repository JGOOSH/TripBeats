import React, { Component } from "react";
import celebrateIcon from "./confetti.svg";
import PlaceGrid from "./placeGrid";
import EventGrid from "./eventGrid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    "margin-top": "2%"
  }
});

class SubmittedPage extends Component {
  render() {
    const { travelData, classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Typography align="center" variant="title">{`Your trip to ${
            travelData.trip.destination
          } is confirmed!`}</Typography>
          <img src={celebrateIcon} height={50} width={50} />
        </Grid>
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

export default withStyles(styles)(SubmittedPage);

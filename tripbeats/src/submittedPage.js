import React, { Component } from "react";
import celebrateIcon from "./confetti.svg";
import PlaceGrid from "./placeGrid";
import EventGrid from "./eventGrid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

require("typeface-roboto");

const styles = theme => ({
  root: {
    "margin-top": "2%",
    "margin-left": "2%"
  }
});

class SubmittedPage extends Component {
  render() {
    const { travelData, classes, result } = this.props;
    console.log(result);
    if (
      result === {} ||
      result.businesses === undefined ||
      result.events === undefined
    )
      return <div> Loading ... </div>;
    return (
      <div className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Typography align="center" variant="title">{`Your trip to ${
            travelData.trip.destination
          } is confirmed!`}</Typography>
          <img src={celebrateIcon} height={50} width={50} />
        </Grid>
        <Typography variant="subheading">
          we have created a playlist for your upcoming travel.{" "}
        </Typography>
        <a href={result.spotify}>Click this link to access the playlist</a>
        <div>
          <Typography variant="subheading">
            {`Do you like music? Check these places and events out while you are at ${
              travelData.trip.destination
            }`}
          </Typography>
        </div>
        <div>
          <Typography variant="headline">Places:</Typography>
          <PlaceGrid data={result.businesses} />
        </div>
        <div>
          <Typography variant="headline">Events:</Typography>
          <EventGrid data={result.events} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SubmittedPage);

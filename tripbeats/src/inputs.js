import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Submitted from "./submittedPage";
import InputSnackBar from "./InputSnackBar";

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken:
    "pk.eyJ1Ijoiamdvb2VvZyIsImEiOiJjamlidzY0ajEwMTd1M3BvYWtsMmdjMnI0In0.FEG5PGhv_NHOXr0WkDi2zg"
});

console.log(geocodingClient);

const styles = theme => ({
  container: {
    display: "flex",
    flexwrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    margin: theme.spacing.unit
  }
});

const fetchInputData = async data => {
  data.playlist = {
    token:
      "BQA7TiS6gp8f2yiklh5ZLxogbctRJhdXBQ9esTT9FQtKnuHO0rfXxC5gknEt_X5U3JpfYTEqIWFebMOJFvX-ZS3KHldSHF1XEWPd2qzFAax_AruAveTV3qCFyAhoR-XWNSPetx5ryD5Ono_QtAeEXAPvvmIGdL9f2awjXYN64O9ZdE_oOtl82UaLygOXfUrSE5Q8flL39bmJNdMXDTRKW3mITCPhm-5_LOhInP8bCEKNRdffOWUYHc9XQ3ySJsviff_-KCRn--qGcA"
  };
  const request = await fetch("http://localhost:5000/getthething", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  });
};

const scrapeUserInput = list => {
  let dest = document.getElementById("destination").value;
  let depart = document.getElementById("departure").value;
  let ret = document.getElementById("return").value;
  if (dest === "" || depart === "" || ret === "") return false;
  const trip = {
    destination: dest,
    departure: depart,
    return: ret
  };
  let people = [];
  var i;
  for (i = 0; i < list.length; i++) {
    let fname = document.getElementById(`first_name-${i}`).value;
    let lname = document.getElementById(`last_name-${i}`).value;
    let uEmail = document.getElementById(`email-${i}`).value;
    if (fname === "" || lname === "" || uEmail === "") return false;
    people.push({
      firstName: fname,
      lastName: lname,
      email: uEmail
    });
  }
  const data = { trip, people };
  geocodingClient
    .forwardGeocode({
      query: trip.destination,
      limit: 1
    })
    .send()
    .then(response => {
      const { features } = response.body;
      data.geo = {
        latitude: features[0].center[1],
        longitude: features[0].center[0]
      };
    });
  fetchInputData(data);
  return data;
};

const renderUserInputs = (classes, length) => {
  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      key={`user-${length}`}
    >
      <TextField
        id={`first_name-${length}`}
        label="First Name"
        className={classes.textField}
        margin="normal"
      />
      <TextField
        id={`last_name-${length}`}
        label="Last Name"
        className={classes.textField}
        margin="normal"
      />
      <TextField
        id={`email-${length}`}
        label="Email"
        className={classes.textField}
        margin="normal"
      />
    </form>
  );
};

class InputFields extends Component {
  state = {
    isSubmitted: false,
    userInputList: [],
    travelData: []
  };

  constructor(props) {
    super(props);
    const { classes } = this.props;
    const { userInputList } = this.state;
    userInputList.push(renderUserInputs(classes, userInputList.length));
  }

  render() {
    const { classes } = this.props;
    const { userInputList, isSubmitted, isWrong } = this.state;
    if (!isSubmitted)
      return (
        <div>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id="destination"
              label="Destination"
              className={classes.textField}
              margin="normal"
            />
            <TextField
              id="departure"
              label="Departure (MM-DD-YYYY)"
              className={classes.textField}
              margin="normal"
            />
            <TextField
              id="return"
              label="Return (MM-DD-YYYY)"
              className={classes.textField}
              margin="normal"
            />
          </form>
          {userInputList.map(list => list)}
          <div className={classes.container}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => {
                let list = userInputList;
                list.push(renderUserInputs(classes, list.length));
                this.setState({ userInputList: list });
              }}
            >
              Add Person
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => {
                let data = scrapeUserInput(userInputList);
                if (data !== false)
                  this.setState({ isSubmitted: true, travelData: data });
                else this.setState({ isWrong: true });
              }}
            >
              Submit
            </Button>
          </div>
          <InputSnackBar isWrong={this.state.isWrong} />
        </div>
      );
    else return <Submitted travelData={this.state.travelData} />;
  }
}

export default withStyles(styles)(InputFields);

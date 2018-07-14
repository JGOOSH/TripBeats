import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
  const request = await fetch("http://127.0.0.1:5000/getthething", {
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data)
  });

  console.log(request);
};

const scrapeUserInput = list => {
  const trip = {
    destination: document.getElementById("destination").value,
    departure: document.getElementById("departure").value,
    return: document.getElementById("return").value
  };
  let people = [];
  var i;
  for (i = 0; i < list.length; i++) {
    people.push({
      firstName: document.getElementById(`first_name-${i}`).value,
      lastName: document.getElementById(`last_name-${i}`).value,
      email: document.getElementById(`email-${i}`).value
    });
  }
  const data = { trip, people };
  console.log(data);
  fetchInputData(data);
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
    userInputList: []
  };

  constructor(props) {
    super(props);
    const { classes } = this.props;
    const { userInputList } = this.state;
    userInputList.push(renderUserInputs(classes, userInputList.length));
  }

  render() {
    const { classes } = this.props;
    const { userInputList } = this.state;
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
            Add user
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => {
              scrapeUserInput(userInputList);
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(InputFields);

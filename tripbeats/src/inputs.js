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

const fetchInputData = async ({ querystring }) => {
  const request = await fetch("/getthething", {
    method: "POST",
    headers: JSON.stringify(querystring)
  });
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
            id="date"
            label="Departure (MM-DD-YYYY)"
            className={classes.textField}
            margin="normal"
          />
          <TextField
            id="date"
            label="Return (MM-DD-YYYY)"
            className={classes.textField}
            margin="normal"
          />
        </form>
        {this.state.userInputList.map(list => list)}
        <div className={classes.container}>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => {
              let list = this.state.userInputList;
              list.push(renderUserInputs(classes, list.length));
              this.setState({ userInputList: list });
            }}
          >
            Add user
          </Button>
          <Button variant="contained" className={classes.button}>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(InputFields);

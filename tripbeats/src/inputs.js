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

class InputFields extends Component {
  state = {
    userCount: 1
  };

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
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="first_name"
            label="First Name"
            className={classes.textField}
            margin="normal"
          />
          <TextField
            id="last_name"
            label="Last Name"
            className={classes.textField}
            margin="normal"
          />
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            margin="normal"
          />
        </form>
        <div className={classes.container}>
          <Button variant="contained" className={classes.button}>
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

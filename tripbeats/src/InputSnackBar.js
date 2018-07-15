import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import SnackbarContent from "@material-ui/core/SnackbarContent";

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit
  }
});

function LongTextSnackbar(props) {
  const { classes, isWrong } = props;

  if (isWrong)
    return (
      <div>
        <SnackbarContent
          className={classes.snackbar}
          message="Invalid input. Make sure you filled up the form!"
        />
      </div>
    );
  else return null;
}

LongTextSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LongTextSnackbar);

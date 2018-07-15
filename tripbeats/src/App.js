import React, { Component } from "react";
import InputFields from "./inputs";
import AppBar from "./appbar";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AppBar />
        <InputFields />
      </div>
    );
  }
}

export default App;

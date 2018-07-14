import React, { Component } from "react";
import "./App.css";
import InputFields from "./inputs";
import AppBar from "./appbar";

class App extends Component {
  render() {
    return (
      <div>
        <AppBar />
        <InputFields />{" "}
      </div>
    );
  }
}

export default App;

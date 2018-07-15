import React, { Component } from "react";
import InputFields from "./inputs";
import AppBar from "./appbar";

const userAuthenticate = async () => {};

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    userAuthenticate();
  }

  render() {
    return (
      <div>
        <AppBar />
        <InputFields authentication={userAuthenticate} />
      </div>
    );
  }
}

export default App;

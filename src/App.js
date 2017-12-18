import React, { Component } from 'react';
import Component1 from './components/component-1';
import Component2 from './components/component-2';
import Component3 from './components/component-3';
import Component4 from './components/component-4';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
      return <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo"/>
              <h1 className="App-title">React X</h1>
          </header>
          <div className="App-intro">
              <Component1/>
              <Component2/>
              <Component3/>
              <Component4/>
          </div>
      </div>;
  }
}

export default App;

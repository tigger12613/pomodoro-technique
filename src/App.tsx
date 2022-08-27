import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Pomodoro } from './components/Pomodoro';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';


function App() {
  
  return (
    <div className="App">
        <Pomodoro />
    </div>
  );
}

export default App;

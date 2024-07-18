// Main entry component
import React from 'react';
import RandomTopic from './components/RandomTopic';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// Main App component rendering the RandomTopic component
const App = () => {
  return (
    <div className="App container mt-5">
      <RandomTopic />
    </div>
  );
};

export default App;

// Import necessary libraries and components
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RelatedFact from './RelatedFact'; // Component to display related facts
import { FaMoon, FaSun, FaPlus, FaMinus } from 'react-icons/fa'; // Icons for UI
import logo from '../assets/logo.png'; // Import logo image

// Main component to display random topics and facts
const RandomTopic = () => {
  // Define state variables
  const [initialTopics, setInitialTopics] = useState([]); // State to store initial random topics
  const [facts, setFacts] = useState([]); // State to store fetched facts
  const [clickedFacts, setClickedFacts] = useState([]); // State to store clicked facts
  const [isNightMode, setIsNightMode] = useState(false); // State for night mode toggle
  const [depth, setDepth] = useState(0); // State to track rabbit hole depth
  const [fontSize, setFontSize] = useState(16); // State for font size
  const factRefs = useRef([]); // Refs to handle scrolling to new facts

  // Function to fetch random topics from Wikipedia
  const fetchRandomTopics = async () => {
    try {
      const randomTopicsResponse = await axios.get(
        'https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=5&origin=*'
      );
      setInitialTopics(randomTopicsResponse.data.query.random);
    } catch (error) {
      console.error('Error fetching random topics:', error);
    }
  };

  // Function to fetch a specific fact based on title
  const fetchFact = async (title) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
      );
      if (response.data.extract.length > 50) {
        setFacts((prevFacts) => [...prevFacts, { ...response.data }]);
        setClickedFacts((prevClicked) => [...prevClicked, title]);
        setDepth((prevDepth) => prevDepth + 1);
      } else {
        fetchRandomTopics(); // Fetch new topics if the fact is too short
      }
    } catch (error) {
      console.error('Error fetching fact:', error);
    }
  };

  // Function to fetch a random fact
  const fetchRandomFact = async () => {
    try {
      const randomFactResponse = await axios.get(
        'https://en.wikipedia.org/api/rest_v1/page/random/summary'
      );
      if (randomFactResponse.data.extract.length > 50) {
        setFacts((prevFacts) => [...prevFacts, { ...randomFactResponse.data }]);
        setDepth((prevDepth) => prevDepth + 1);
      } else {
        fetchRandomFact(); // Fetch a new fact if the current one is too short
      }
    } catch (error) {
      console.error('Error fetching random fact:', error);
    }
  };

  // Fetch random topics when the component mounts
  useEffect(() => {
    fetchRandomTopics();
  }, []);

  // Scroll to the latest fact when the facts array updates
  useEffect(() => {
    if (factRefs.current.length > 0) {
      const lastFactRef = factRefs.current[factRefs.current.length - 1];
      if (lastFactRef) {
        lastFactRef.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [facts]);

  // Toggle night mode
  const toggleNightMode = () => {
    setIsNightMode((prevMode) => !prevMode);
    document.body.classList.toggle('night-mode');
    document.body.classList.toggle('day-mode');
  };

  // Increase font size with a cap at 24px
  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 24 ? prevSize + 2 : prevSize));
  };

  // Decrease font size with a lower limit of 12px
  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 12 ? prevSize - 2 : prevSize));
  };

  // Render the initial state with random topics buttons
  if (facts.length === 0) {
    return (
      <div className="container mt-5 d-flex flex-column align-items-center">
        <div className="title-container d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo-img" />
          <h1 className="ml-3">WikiHole</h1>
        </div>
        <h1>Choose a Topic to Start</h1>
        <div className="d-flex flex-wrap justify-content-center">
          {initialTopics.map((topic, index) => (
            <button
              key={index}
              className="btn btn-primary m-2"
              onClick={() => fetchFact(topic.title)}
            >
              {topic.title.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="top-right-buttons">
          <button className="btn btn-danger mt-3" onClick={fetchRandomFact}>
            New Random Fact
          </button>
          <button className="btn btn-dark mt-3" onClick={toggleNightMode}>
            {isNightMode ? <FaSun color="white" /> : <FaMoon color="white" />}
          </button>
          <div className="font-size-buttons">
            <button className="btn btn-secondary mx-1" onClick={increaseFontSize}>
              <FaPlus />
            </button>
            <button className="btn btn-secondary mx-1" onClick={decreaseFontSize}>
              <FaMinus />
            </button>
          </div>
        </div>
        <div className={`top-left-counter ${isNightMode ? 'night-mode' : 'day-mode'}`}>
          Rabbit Hole Depth: {depth} layers deep
        </div>
      </div>
    );
  }

  // Render facts when available
  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <div className="title-container d-flex align-items-center">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="ml-3">WikiHole</h1>
      </div>
      <div className="top-right-buttons">
        <button className="btn btn-danger mt-3" onClick={fetchRandomFact}>
          New Random Fact
        </button>
        <button className="btn btn-dark mt-3" onClick={toggleNightMode}>
          {isNightMode ? <FaSun color="white" /> : <FaMoon color="white" />}
        </button>
        <div className="font-size-buttons">
          <button className="btn btn-secondary mx-1" onClick={increaseFontSize}>
            <FaPlus />
          </button>
          <button className="btn btn-secondary mx-1" onClick={decreaseFontSize}>
            <FaMinus />
          </button>
        </div>
      </div>
      <div className={`top-left-counter ${isNightMode ? 'night-mode' : 'day-mode'}`}>
        Rabbit Hole Depth: {depth} layers deep
      </div>
      {facts.map((fact, index) => (
        <div
          key={index}
          ref={(el) => (factRefs.current[index] = el)}
          className="fact-section mt-5 w-75 text-center"
          style={{ fontSize: `${fontSize}px` }}
        >
          <h2>{fact.title}</h2>
          {fact.thumbnail && (
            <img
              src={fact.thumbnail.source}
              alt={fact.title}
              className="fact-image my-3"
            />
          )}
          <p>{fact.extract}</p>
          <RelatedFact title={fact.title} onFactClick={fetchFact} />
        </div>
      ))}
    </div>
  );
};

export default RandomTopic;

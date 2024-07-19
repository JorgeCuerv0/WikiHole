import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RelatedFact from './RelatedFact';
import { FaMoon, FaSun, FaPlus, FaMinus } from 'react-icons/fa';
import logo from '../assets/logo.png';

const RandomTopic = () => {
  const [initialTopics, setInitialTopics] = useState([]);
  const [facts, setFacts] = useState([]);
  const [clickedFacts, setClickedFacts] = useState([]);
  const [isNightMode, setIsNightMode] = useState(false);
  const [depth, setDepth] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const factRefs = useRef([]);

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
        fetchRandomTopics();
      }
    } catch (error) {
      console.error('Error fetching fact:', error);
    }
  };

  const fetchRandomFact = async () => {
    try {
      const randomFactResponse = await axios.get(
        'https://en.wikipedia.org/api/rest_v1/page/random/summary'
      );
      if (randomFactResponse.data.extract.length > 50) {
        setFacts((prevFacts) => [...prevFacts, { ...randomFactResponse.data }]);
        setDepth((prevDepth) => prevDepth + 1);
      } else {
        fetchRandomFact();
      }
    } catch (error) {
      console.error('Error fetching random fact:', error);
    }
  };

  useEffect(() => {
    fetchRandomTopics();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (factRefs.current.length > 0) {
      const lastFactRef = factRefs.current[factRefs.current.length - 1];
      if (lastFactRef) {
        lastFactRef.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [facts]);

  const toggleNightMode = () => {
    setIsNightMode((prevMode) => !prevMode);
    document.body.classList.toggle('night-mode');
    document.body.classList.toggle('day-mode');
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 24 ? prevSize + 2 : prevSize));
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 12 ? prevSize - 2 : prevSize));
  };

  const Header = () => (
    <header className={`header ${isMobile ? 'mobile-header' : 'desktop-header'}`}>
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo-img" />
        <span className="title">WikiHole</span>
      </div>
      <div className="header-center">
        <span className="depth">{isMobile ? `🐰 ${depth}` : `Rabbit Hole Depth: ${depth} layers deep`}</span>
      </div>
      <div className="header-right">
        <button className="btn btn-dark ml-2" onClick={toggleNightMode}>
          {isNightMode ? <FaSun color="white" /> : <FaMoon color="white" />}
        </button>
        <button className="btn btn-danger ml-2" onClick={fetchRandomFact}>
          New Random Fact
        </button>
        {!isMobile && (
          <>
            <button className="btn btn-secondary ml-2" onClick={increaseFontSize}>
              <FaPlus />
            </button>
            <button className="btn btn-secondary ml-2" onClick={decreaseFontSize}>
              <FaMinus />
            </button>
          </>
        )}
      </div>
    </header>
  );

  return (
    <div className={`App ${isNightMode ? 'night-mode' : 'day-mode'}`}>
      <Header />
      <div className="container mt-5 d-flex flex-column align-items-center">
        {facts.length === 0 ? (
          <>
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
          </>
        ) : (
          facts.map((fact, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default RandomTopic;

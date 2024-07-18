// RelatedFact component - Displays related facts
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RelatedFact = ({ title, onFactClick }) => {
  const [relatedFacts, setRelatedFacts] = useState([]);

  // Fetch related facts when the title changes
  useEffect(() => {
    const fetchRelatedFacts = async () => {
      try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/related/${title}`);
        setRelatedFacts(response.data.pages.slice(0, 5)); // Limit to 5 related facts
      } catch (error) {
        console.error('Error fetching related facts:', error);
      }
    };

    fetchRelatedFacts();
  }, [title]);

  // Render buttons for related facts
  return (
    <div className="d-flex flex-wrap justify-content-center mt-3">
      {relatedFacts.map((fact, index) => (
        <button 
          key={index} 
          className="btn btn-primary m-2"
          onClick={() => onFactClick(fact.title)}
        >
          {fact.title.replace(/_/g, ' ')}
        </button>
      ))}
    </div>
  );
};

export default RelatedFact;

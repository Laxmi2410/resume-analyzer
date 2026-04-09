import React from 'react';

function About() {
  return (
    <div className="article-layout">
      <h1>About Resume AI</h1>
      <p className="lead">
        We believe the hiring process should be objective, fast, and driven by data, not just intuition.
      </p>
      
      <div className="article-section">
        <h2>Our Mission</h2>
        <p>
          Recruiters spend countless hours parsing through resumes, manually checking boxes for required skills. 
          Our tool automates the heavy lifting using advanced Natural Language Processing to extract, categorize, 
          and grade candidate qualifications instantly.
        </p>
        
        <h2>Technology</h2>
        <p>
          Built upon modern industry standards, our stack utilizes React for a seamless single-page experience, 
          backed by a robust Python/Flask engine. We leverage spaCy for entity recognition and scikit-learn for 
          semantic similarity modeling.
        </p>
      </div>
    </div>
  );
}

export default About;

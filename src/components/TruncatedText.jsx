import React, { useState } from 'react';

const TruncatedText = ({ text = '', maxLength = 50 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = text || 'No data available';

  return (
    <span>
      {isExpanded ? displayText : `${displayText.slice(0, maxLength)}${displayText.length > maxLength ? '' : ''}`}
      {displayText.length > maxLength && (
        <button
          onClick={handleToggle}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: 'inherit',
            font: 'inherit',
            cursor: 'pointer',
          }}
          
        >
          {isExpanded ? '✓' : '...'}
        </button>
      )}
    </span>
  );
};

export default TruncatedText;

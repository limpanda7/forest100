import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ isVisible, message = "처리 중입니다..." }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 
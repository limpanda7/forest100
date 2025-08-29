import React, { useState } from 'react';
import './FloatingAppleButton.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

const FloatingAppleButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsClicked(true);
    
    try {
      // 새 탭에서 사과 주문 페이지 열기
      window.open('https://nameun-jari.web.app/apple-order', '_blank', 'noopener,noreferrer');
      
      // 클릭 피드백 지속
      setTimeout(() => {
        setIsClicked(false);
      }, 200);
      
    } catch (error) {
      console.error('사과 주문 페이지 열기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={`floating-apple-button ${isClicked ? 'clicked' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label="사과 주문 페이지로 이동"
      title="🍎 신선한 사과 주문하기"
    >
      {isLoading ? (
        <FontAwesomeIcon icon={faSpinner} size="2x" className="spinner" />
      ) : (
        <FontAwesomeIcon icon={faAppleAlt} size="2x" />
      )}
      <span className="button-text">
        {isLoading ? '연결 중...' : '사과 주문'}
      </span>
    </div>
  );
};

export default FloatingAppleButton;

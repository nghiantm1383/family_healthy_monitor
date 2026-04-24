import React from 'react';
import './SkeuoCard.css';

const SkeuoCard = ({ children, className = '', pressed = false }) => {
    return (
        <div className={`skeuo-card ${pressed ? 'pressed' : ''} ${className}`}>
            {children}
        </div>
    );
};

export default SkeuoCard;

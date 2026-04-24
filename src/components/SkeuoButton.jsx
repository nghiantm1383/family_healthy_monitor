import React, { useState } from 'react';
import './SkeuoButton.css';

const SkeuoButton = ({ label, onClick, className = '', icon }) => {
    const [isDepressed, setIsDepressed] = useState(false);

    const handlePointerDown = () => setIsDepressed(true);
    const handlePointerUp = () => setIsDepressed(false);

    return (
        <button
            className={`skeuo-button ${isDepressed ? 'depressed' : ''} ${className}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={onClick}
        >
            {icon && <span className="icon">{icon}</span>}
            {label && <span className="label">{label}</span>}
        </button>
    );
};

export default SkeuoButton;

import React from 'react';
import './SkeuoToggle.css';

const SkeuoToggle = ({ isToggled, onToggle, label }) => {
    return (
        <div className="skeuo-toggle-wrapper" onClick={onToggle}>
            {label && <span className="toggle-label">{label}</span>}
            <div className={`skeuo-toggle ${isToggled ? 'active' : ''}`}>
                <div className="toggle-switch"></div>
            </div>
        </div>
    );
};

export default SkeuoToggle;

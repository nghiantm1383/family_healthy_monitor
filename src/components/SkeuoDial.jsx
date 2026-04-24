import React from 'react';
import './SkeuoDial.css';

const SkeuoDial = ({ percentage = 0, label, value, unit, color = "var(--accent-color)" }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    // clamp percentage
    const safePercentage = Math.min(Math.max(percentage, 0), 100);
    const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

    return (
        <div className="skeuo-dial-container">
            <svg className="skeuo-dial-svg" width="160" height="160">
                {/* Inset Shadow visually via thick stroke on background */}
                <circle
                    className="dial-track"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeWidth="15"
                />
                {/* Glow Progress */}
                <circle
                    className="dial-progress"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeWidth="15"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        stroke: color,
                        filter: `drop-shadow(0 0 5px ${color})`
                    }}
                />
            </svg>
            <div className="dial-content">
                <div className="dial-value">{value}</div>
                <div className="dial-unit">{unit}</div>
            </div>
            {label && <div className="dial-label">{label}</div>}
        </div>
    );
};

export default SkeuoDial;

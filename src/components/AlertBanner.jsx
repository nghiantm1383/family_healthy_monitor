import React from 'react';
import './AlertBanner.css';

const AlertBanner = ({ alerts }) => {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div className="alert-banner-container">
            {alerts.map((alert) => (
                <div key={alert.id} className={`alert-banner ${alert.type.includes('Ngủ') ? 'alert-sleep' : 'alert-activity'}`}>
                    <div className="alert-icon">
                        <div className="icon-inner">⚠️</div>
                    </div>
                    <div className="alert-content">
                        <span className="alert-title">{alert.type} - {alert.user}</span>
                        <span className="alert-msg">{alert.message}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertBanner;

import React from 'react';
import { useHealthData } from './hooks/useHealthData';
import UnifiedDashboard from './components/UnifiedDashboard';
import SkeuoCard from './components/SkeuoCard';

function App() {
    const { familyData, alerts, loading, toggleMedication } = useHealthData();

    if (loading) {
        return (
            <div className="app-container" style={{ width: '400px', display: 'flex', justifyContent: 'center' }}>
                <SkeuoCard pressed={true} className="loading-card" style={{ width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
                    <h2 style={{ color: 'var(--accent-color)', fontWeight: 300, letterSpacing: '2px', textShadow: '0 0 10px rgba(0,255,204,0.3)' }}>Đang cập nhật dữ liệu...</h2>
                    <p style={{ color: '#888', marginTop: '1rem' }}>Mô phỏng kết nối hệ thống Health API</p>
                </SkeuoCard>
            </div>
        );
    }

    return (
        <div className="app-container" style={{ width: '100%', minWidth: '400px', maxWidth: '1000px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Biểu đồ theo dõi sức khoẻ</h1>

            <UnifiedDashboard
                familyData={familyData}
                alerts={alerts}
                toggleMedication={toggleMedication}
            />
        </div>
    );
}

export default App;

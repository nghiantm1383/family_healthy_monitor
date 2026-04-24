import { useState, useEffect } from 'react';

// MOCK DATA GENERATOR
const generateMockFamilyData = () => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    return [
        {
            id: 1,
            name: 'Bố (Dad)',
            role: 'parent',
            steps: Math.floor(Math.random() * 5000) + 1000,
            stepsTarget: 8000,
            sleepHours: parseFloat((Math.random() * 3 + 4).toFixed(1)),
            sleepTarget: 7.5,
            calories: Math.floor(Math.random() * 500) + 1500,
            caloriesTarget: 2200,
            heartRate: Math.floor(Math.random() * 30) + 70, // 70-100 bpm
            weeklyData: days.map(day => ({
                day,
                steps: Math.floor(Math.random() * 6000) + 2000,
                sleep: parseFloat((Math.random() * 3 + 5).toFixed(1)),
                heartRate: Math.floor(Math.random() * 20) + 70
            })),
            medications: [
                { id: 101, name: 'Vitamin C', taken: true },
                { id: 102, name: 'Thuốc Huyết áp', taken: false }
            ]
        },
        {
            id: 2,
            name: 'Mẹ (Mom)',
            role: 'parent',
            steps: Math.floor(Math.random() * 8000) + 2000,
            stepsTarget: 6000,
            sleepHours: parseFloat((Math.random() * 3 + 5).toFixed(1)),
            sleepTarget: 7.0,
            calories: Math.floor(Math.random() * 500) + 1200,
            caloriesTarget: 1800,
            heartRate: Math.floor(Math.random() * 20) + 65,
            weeklyData: days.map(day => ({
                day,
                steps: Math.floor(Math.random() * 7000) + 3000,
                sleep: parseFloat((Math.random() * 2 + 6).toFixed(1)),
                heartRate: Math.floor(Math.random() * 15) + 65
            })),
            medications: [
                { id: 103, name: 'Omega 3', taken: true }
            ]
        },
        {
            id: 3,
            name: 'Bé Bi (Child)',
            role: 'child',
            steps: Math.floor(Math.random() * 10000) + 5000,
            stepsTarget: 6000,
            sleepHours: parseFloat((Math.random() * 2 + 7).toFixed(1)),
            sleepTarget: 9.0,
            calories: Math.floor(Math.random() * 1000) + 2000,
            caloriesTarget: 2500,
            heartRate: Math.floor(Math.random() * 20) + 80,
            weeklyData: days.map(day => ({
                day,
                steps: Math.floor(Math.random() * 8000) + 5000,
                sleep: parseFloat((Math.random() * 2 + 7).toFixed(1)),
                heartRate: Math.floor(Math.random() * 15) + 75
            })),
            medications: []
        }
    ];
};

export const useHealthData = () => {
    const [familyData, setFamilyData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulating connection to OS Health API
    useEffect(() => {
        // Network delay mock
        const timer = setTimeout(() => {
            const data = generateMockFamilyData();
            setFamilyData(data);
            setLoading(false);

            // AI SIMULATOR: Analyze incoming data
            const newAlerts = [];
            data.forEach(user => {
                if (user.sleepHours < 5) {
                    newAlerts.push({ id: `a1-${user.id}`, user: user.name, type: 'Cảnh báo Ngủ', message: `${user.name} thường xuyên ngủ dưới 5 tiếng.` });
                }
                if (user.steps < 3000) {
                    newAlerts.push({ id: `a2-${user.id}`, user: user.name, type: 'Cảnh báo Vận động', message: `${user.name} thiếu vận động. Khuyên đi dạo 15 phút!` });
                }
                // AI Heart Rate alert
                if (user.heartRate > 95 && user.role === 'parent') {
                    newAlerts.push({ id: `a3-${user.id}`, user: user.name, type: 'Báo động Nhịp tim', message: `Phát hiện nhịp tim ${user.name} bất thường lúc nghỉ ngơi (${user.heartRate} bpm).` });
                }
            });
            setAlerts(newAlerts);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const toggleMedication = (userId, medId) => {
        setFamilyData(prev => prev.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    medications: user.medications.map(med =>
                        med.id === medId ? { ...med, taken: !med.taken } : med
                    )
                };
            }
            return user;
        }));
    };

    return { familyData, alerts, loading, toggleMedication };
};

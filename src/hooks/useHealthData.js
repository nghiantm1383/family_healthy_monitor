import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, query } from 'firebase/firestore';
import { db } from '../config/firebase';

// DỮ LIỆU SEED (Chỉ dùng lần đầu tiên Firebase bị rỗng để tạo bảng)
const DUMMY_SEED_DATA = [
    {
        id: 1,
        name: 'Bố (Dad)',
        role: 'parent',
        steps: 4230,
        stepsTarget: 8000,
        sleepHours: 5.5,
        sleepTarget: 7.5,
        calories: 1800,
        caloriesTarget: 2200,
        heartRate: 75,
        weeklyData: [
            { day: 'T2', steps: 3500, sleep: 6.0, heartRate: 72 },
            { day: 'T3', steps: 4000, sleep: 5.5, heartRate: 74 },
            { day: 'T4', steps: 4200, sleep: 7.0, heartRate: 71 },
            { day: 'T5', steps: 6000, sleep: 6.5, heartRate: 70 },
            { day: 'T6', steps: 5200, sleep: 5.0, heartRate: 75 },
            { day: 'T7', steps: 8000, sleep: 8.0, heartRate: 68 },
            { day: 'CN', steps: 7500, sleep: 7.5, heartRate: 65 },
        ],
        medications: [
            { id: 101, name: 'Vitamin C', taken: true },
            { id: 102, name: 'Thuốc Huyết áp', taken: false }
        ]
    },
    {
        id: 2,
        name: 'Mẹ (Mom)',
        role: 'parent',
        steps: 6500,
        stepsTarget: 6000,
        sleepHours: 7.2,
        sleepTarget: 7.0,
        calories: 1200,
        caloriesTarget: 1800,
        heartRate: 68,
        weeklyData: [
            { day: 'T2', steps: 5000, sleep: 7.0, heartRate: 65 },
            { day: 'T3', steps: 6000, sleep: 6.5, heartRate: 68 },
            { day: 'T4', steps: 5500, sleep: 7.5, heartRate: 66 },
            { day: 'T5', steps: 7000, sleep: 7.0, heartRate: 64 },
            { day: 'T6', steps: 6500, sleep: 6.0, heartRate: 69 },
            { day: 'T7', steps: 8000, sleep: 8.0, heartRate: 62 },
            { day: 'CN', steps: 7500, sleep: 7.5, heartRate: 63 },
        ],
        medications: [
            { id: 103, name: 'Canxi', taken: false }
        ]
    },
    {
        id: 3,
        name: 'Bé Bi (Child)',
        role: 'child',
        steps: 10200,
        stepsTarget: 6000,
        sleepHours: 9.0,
        sleepTarget: 9.0,
        calories: 2100,
        caloriesTarget: 2500,
        heartRate: 85,
        weeklyData: [
            { day: 'T2', steps: 8000, sleep: 8.5, heartRate: 82 },
            { day: 'T3', steps: 9000, sleep: 9.0, heartRate: 85 },
            { day: 'T4', steps: 8500, sleep: 8.0, heartRate: 84 },
            { day: 'T5', steps: 11000, sleep: 9.5, heartRate: 80 },
            { day: 'T6', steps: 10500, sleep: 8.5, heartRate: 86 },
            { day: 'T7', steps: 12000, sleep: 10.0, heartRate: 78 },
            { day: 'CN', steps: 11500, sleep: 9.5, heartRate: 79 },
        ],
        medications: []
    }
];

export const useHealthData = () => {
    const [familyData, setFamilyData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cắm ống nghe vào Bảng 'health_metrics' trên Firebase
        const q = query(collection(db, 'health_metrics'));

        // onSnapshot tự động cập nhật Dashboard ngay khi có ai thay đổi số liệu trên Cloud
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            // TÍNH NĂNG ĐẶC BIỆT: Nếu csdl rỗng (Lần đầu xài), nạp số liệu làm vốn cho Đám mây
            if (querySnapshot.empty) {
                console.log("Phát hiện Firebase trống, đang nạp dữ liệu gốc lên Cloud...");
                DUMMY_SEED_DATA.forEach(async (member) => {
                    await setDoc(doc(db, 'health_metrics', member.id.toString()), member);
                });
                return; // Lần sau chạy hàm này dữ liệu sẽ có mặt
            }

            // Có dữ liệu thì lấy về
            const data = querySnapshot.docs.map(doc => doc.data());

            // Xếp đúng tên người 1, 2, 3
            data.sort((a, b) => a.id - b.id);

            setFamilyData(data);
            setLoading(false);

            // BỘ NÃO AI CẢNH BÁO: Tường trình sức khỏe
            const newAlerts = [];
            data.forEach(user => {
                if (user.sleepHours < 5) {
                    newAlerts.push({ id: `a1-${user.id}`, user: user.name, type: 'Cảnh báo Ngủ', message: `${user.name} thường xuyên ngủ dưới 5 tiếng.` });
                }
                if (user.steps < 3000) {
                    newAlerts.push({ id: `a2-${user.id}`, user: user.name, type: 'Cảnh báo Vận động', message: `${user.name} thiếu vận động. Khuyên đi dạo 15 phút!` });
                }
                if (user.heartRate > 95 && user.role === 'parent') {
                    newAlerts.push({ id: `a3-${user.id}`, user: user.name, type: 'Báo động Nhịp tim', message: `Phát hiện nhịp tim ${user.name} bất thường lúc nghỉ ngơi (${user.heartRate} bpm).` });
                }
            });
            setAlerts(newAlerts);
        }, (error) => {
            console.error("Lỗi kết nối Firebase SDK:", error);
            setLoading(false);
        });

        // Hủy hóng chuyện khi tắt Web
        return () => unsubscribe();
    }, []);

    // Gửi lệnh lên Firebase để Toggle thuốc
    const toggleMedication = async (userId, medId) => {
        const user = familyData.find(u => u.id === userId);
        if (!user) return;

        const updatedMeds = user.medications.map(med =>
            med.id === medId ? { ...med, taken: !med.taken } : med
        );

        // Update lên kho Cloud
        await setDoc(doc(db, 'health_metrics', userId.toString()), {
            ...user,
            medications: updatedMeds
        });
    };

    return { familyData, alerts, loading, toggleMedication };
};

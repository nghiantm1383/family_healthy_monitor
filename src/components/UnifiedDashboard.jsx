import React, { useState } from 'react';
import SkeuoCard from './SkeuoCard';
import SkeuoDial from './SkeuoDial';
import SkeuoToggle from './SkeuoToggle';
import AlertBanner from './AlertBanner';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import './UnifiedDashboard.css';

// Thuật toán tính số thứ tự Tuần trong năm hiện tại
const getCurrentWeekNumber = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const UnifiedDashboard = ({ familyData, alerts, toggleMedication }) => {
    const [selectedMemberId, setSelectedMemberId] = useState(familyData && familyData.length > 0 ? familyData[0].id : 1);

    const totalSteps = familyData.reduce((acc, curr) => acc + curr.steps, 0);
    const totalStepsTarget = familyData.reduce((acc, curr) => acc + curr.stepsTarget, 0);
    const avgSleep = (familyData.reduce((acc, curr) => acc + curr.sleepHours, 0) / (familyData.length || 1)).toFixed(1);
    const overalProgress = (totalStepsTarget > 0) ? (totalSteps / totalStepsTarget) * 100 : 0;

    const allMedications = [];
    familyData.forEach(member => {
        if (member.medications) {
            member.medications.forEach(med => {
                allMedications.push({ ...med, memberId: member.id, memberName: member.name });
            });
        }
    });

    const activeMember = familyData.find(m => m.id === selectedMemberId);
    const weekNumber = getCurrentWeekNumber();

    return (
        <div className="unified-dashboard">

            {/* 1/ TỔNG QUAN */}
            <section className="section-overview">
                <h2 className="section-title">Tổng quan</h2>
                <SkeuoCard className="overview-card">
                    <div className="overview-stats">
                        <div className="stat-box">
                            <span className="stat-value">{totalSteps.toLocaleString()}</span>
                            <span className="stat-label">Tổng Bước Chân</span>
                        </div>
                        <div className="stat-box central-dial">
                            <SkeuoDial
                                percentage={overalProgress}
                                value={Math.round(overalProgress)}
                                unit="%"
                            />
                        </div>
                        <div className="stat-box">
                            <span className="stat-value">{avgSleep}h</span>
                            <span className="stat-label">TB Giấc Ngủ</span>
                        </div>
                    </div>
                </SkeuoCard>
            </section>

            {/* 2/ THỐNG KÊ TUẦN W... */}
            <section className="section-charts">
                <h2 className="section-title">Thống kê tuần W{weekNumber}</h2>
                <SkeuoCard className="charts-card">
                    <div className="charts-filter">
                        <label>Lọc thành viên: </label>
                        <select
                            value={selectedMemberId}
                            onChange={(e) => setSelectedMemberId(Number(e.target.value))}
                            className="skeuo-select"
                        >
                            {familyData.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    {activeMember && activeMember.weeklyData && (
                        <div className="charts-grid">
                            <div className="chart-box">
                                <h3 className="chart-title">Nhịp tim (BPM)</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={activeMember.weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="day" stroke="#888" fontSize={12} />
                                        <YAxis stroke="#888" domain={['dataMin - 5', 'dataMax + 5']} fontSize={12} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-pressed)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Line type="monotone" dataKey="heartRate" name="Nhịp tim" stroke="#feb2b2" strokeWidth={3} dot={{ r: 5, fill: '#feb2b2' }} activeDot={{ r: 7 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-box">
                                <h3 className="chart-title">Vận động (Bước)</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={activeMember.weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="day" stroke="#888" fontSize={12} />
                                        <YAxis stroke="#888" fontSize={12} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-pressed)', border: 'none', borderRadius: '8px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                        <Bar dataKey="steps" name="Bước chân" fill="#9ae6b4" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-box">
                                <h3 className="chart-title">Giấc ngủ (Giờ)</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={activeMember.weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="day" stroke="#888" fontSize={12} />
                                        <YAxis stroke="#888" domain={[0, 12]} fontSize={12} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-pressed)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Line type="monotone" dataKey="sleep" name="Giấc ngủ" stroke="#d6bcfa" strokeWidth={3} dot={{ r: 5, fill: '#d6bcfa' }} activeDot={{ r: 7 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </SkeuoCard>
            </section>

            {/* 3/ CHI TIẾT */}
            <section className="section-details">
                <h2 className="section-title">Chi tiết</h2>
                <SkeuoCard className="horizontal-table-card">
                    <div className="table-header">
                        <div className="th-cell">Thành viên</div>
                        <div className="th-cell">Vận động (Bước)</div>
                        <div className="th-cell">Giấc ngủ (Giờ)</div>
                        <div className="th-cell">Tiêu hao (Kcal)</div>
                        <div className="th-cell">Nhịp tim (BPM)</div>
                    </div>
                    <div className="table-body">
                        {familyData.map(member => (
                            <div key={member.id} className="table-row">
                                <div className="td-cell member-name">
                                    {member.name}
                                </div>
                                <div className="td-cell">
                                    <div className="bar-container tooltip-host">
                                        <div className="bar-bg">
                                            <div className="bar-fill steps-bar" style={{ width: `${Math.min((member.steps / member.stepsTarget) * 100, 100)}%` }}></div>
                                        </div>
                                        <span className="bar-value">{member.steps}</span>
                                    </div>
                                </div>
                                <div className="td-cell">
                                    <div className="bar-container tooltip-host">
                                        <div className="bar-bg">
                                            <div className="bar-fill sleep-bar" style={{ width: `${Math.min((member.sleepHours / member.sleepTarget) * 100, 100)}%` }}></div>
                                        </div>
                                        <span className="bar-value">{member.sleepHours}h</span>
                                    </div>
                                </div>
                                <div className="td-cell">
                                    <div className="bar-container tooltip-host">
                                        <div className="bar-bg">
                                            <div className="bar-fill calories-bar" style={{ width: `${Math.min((member.calories / member.caloriesTarget) * 100, 100)}%` }}></div>
                                        </div>
                                        <span className="bar-value">{member.calories}</span>
                                    </div>
                                </div>
                                <div className="td-cell heart-cell">
                                    <span className="heart-icon">❤️</span>
                                    <span className="heart-value">{member.heartRate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </SkeuoCard>
            </section>

            {/* 4/ CẢNH BÁO */}
            <section className="section-alerts">
                <h2 className="section-title">Cảnh báo</h2>
                <div className="alerts-container">
                    <AlertBanner alerts={alerts} />
                </div>
            </section>

            {/* 5/ NHẮC NHỞ UỐNG THUỐC */}
            <section className="section-medications">
                <h2 className="section-title">Nhắc nhở uống thuốc</h2>
                <SkeuoCard className="meds-card">
                    {allMedications.length > 0 ? (
                        <div className="meds-list-unified">
                            {allMedications.map(med => (
                                <div key={`${med.memberId}-${med.id}`} className="med-row">
                                    <div className="med-info">
                                        <span className="med-owner">{med.memberName}</span>
                                        <span className="med-name">{med.name}</span>
                                    </div>
                                    <SkeuoToggle
                                        label={med.taken ? "Đã uống" : "Chưa uống"}
                                        isToggled={med.taken}
                                        onToggle={() => toggleMedication(med.memberId, med.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#888', textAlign: 'center', margin: '1rem 0' }}>Hôm nay không có lịch uống thuốc.</p>
                    )}
                </SkeuoCard>
            </section>

        </div>
    );
};

export default UnifiedDashboard;

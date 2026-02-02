import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { months } from '../data/constants';

const AnnualFinancialReport = ({ records, currentYear, payments, sections }) => {
    const navigate = useNavigate();

    // Calculate Annual Stats
    const yearRecords = records.filter(r => {
        const d = new Date(r.date);
        return d.getFullYear() === currentYear;
    });

    const totalManualExpenses = yearRecords
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalManualIncome = yearRecords
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + Number(r.amount), 0);

    // Calculate Subscription Income (collected) for the whole year
    // Calculate Subscription Income (collected) for the whole year
    let totalSubscriptionIncome = 0;

    if (sections && payments) {
        // Iterate through all 12 months
        for (let monthId = 0; monthId < 12; monthId++) {
            sections.forEach(section => {
                if (section.players) {
                    section.players.forEach(player => {
                        const paymentKey = `${currentYear}_${monthId}_${player.id}`;
                        // Check if paid for this month
                        const pmt = payments[paymentKey];
                        if (pmt === true || (pmt && pmt.isPaid)) {
                            const actualAmount = (typeof pmt === 'object' && pmt.amount !== undefined) ? Number(pmt.amount) : Number(player.price || 0);
                            totalSubscriptionIncome += actualAmount;
                        }
                    });
                }
            });
        }
    }

    const totalIncome = totalManualIncome + totalSubscriptionIncome;
    const profit = totalIncome - totalManualExpenses;

    return (
        <div className="app-container">
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <button
                    onClick={() => navigate('/financial-analysis')}
                    style={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={20} color="#333" />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 className="section-title" style={{ margin: 0, fontSize: '1.2rem' }}>
                        Οικονομικός Απολογισμός {currentYear}
                    </h1>
                </div>
            </div>

            {/* Total Profit Hero Card */}
            <div
                className="card-glass"
                style={{
                    padding: '32px',
                    borderRadius: '24px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '8px' }}>Καθαρό Κέρδος</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: profit >= 0 ? '#4ADE80' : '#F87171' }}>
                    {profit > 0 ? '+' : ''}{Number(profit).toLocaleString('el-GR')}€
                </div>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    opacity: 0.05,
                    transform: 'rotate(15deg)'
                }}>
                    <DollarSign size={150} />
                </div>
            </div>

            {/* Stats Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div className="card-glass" style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: '#DCFCE7', padding: '10px', borderRadius: '50%', marginBottom: '8px' }}>
                        <TrendingUp size={24} color="#166534" />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Σύνολο Εσόδων</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#166534' }}>
                        {Number(totalIncome).toLocaleString('el-GR')}€
                    </div>
                </div>

                <div className="card-glass" style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: '#FEE2E2', padding: '10px', borderRadius: '50%', marginBottom: '8px' }}>
                        <TrendingDown size={24} color="#991B1B" />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Σύνολο Εξόδων</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#991B1B' }}>
                        {Number(totalManualExpenses).toLocaleString('el-GR')}€
                    </div>
                </div>
            </div>

            {/* Breakdown Details */}
            <div className="card-glass" style={{ padding: '24px', borderRadius: '20px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Ανάλυση Εσόδων</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748B' }}>Συνδρομές</span>
                    <span style={{ fontWeight: 'bold' }}>{Number(totalSubscriptionIncome).toLocaleString('el-GR')}€</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Άλλα (Χορηγίες κ.λπ.)</span>
                    <span style={{ fontWeight: 'bold' }}>{Number(totalManualIncome).toLocaleString('el-GR')}€</span>
                </div>
            </div>

            {/* Expenses Breakdown */}
            <div className="card-glass" style={{ padding: '24px', borderRadius: '20px', marginTop: '20px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Ανάλυση Εξόδων</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Έξοδα</span>
                    <span style={{ fontWeight: 'bold', color: '#DC2626' }}>{Number(totalManualExpenses).toLocaleString('el-GR')}€</span>
                </div>
            </div>

        </div>
    );
};

export default AnnualFinancialReport;

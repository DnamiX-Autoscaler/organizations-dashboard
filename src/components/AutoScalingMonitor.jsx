import React, { useEffect, useState } from 'react';
import { getScalingEventsStream, getResilienceMetricsStream } from '../api/config/autoscaling/api';

const AutoScalingMonitor = () => {
    const [scalingEvents, setScalingEvents] = useState([]);
    const [resilienceMetrics, setResilienceMetrics] = useState([]);

    useEffect(() => {
        // Connect to Scaling Events Stream
        const eventsStream = getScalingEventsStream((data) => {
            setScalingEvents(prev => [data, ...prev].slice(0, 20));
        });

        // Connect to Resilience Metrics Stream
        const metricsStream = getResilienceMetricsStream((data) => {
            setResilienceMetrics(prev => [data, ...prev].slice(0, 20));
        });

        return () => {
            eventsStream.close();
            metricsStream.close();
        };
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>🚀 Auto-Scaling Live Monitor</h1>

            <div style={styles.dashboard}>
                {/* Scaling Events Section */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>📈 Scaling Events</h2>
                    <div style={styles.list}>
                        {scalingEvents.map((event) => (
                            <div key={event._id} style={{ ...styles.card, ...styles.eventCard }}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.deploymentName}>{event.deployment}</span>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: event.status === 'SUCCESS_VALIDATED' ? '#10b981' : '#f59e0b'
                                    }}>
                                        {event.status}
                                    </span>
                                </div>
                                <div style={styles.cardBody}>
                                    <p>Action: <strong>{event.scale_action}</strong></p>
                                    <p>Replicas: {event.previous_replicas} ➔ {event.required_replicas}</p>
                                    <small style={styles.timestamp}>{new Date(event.timestamp).toLocaleString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resilience Metrics Section */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>🛡️ Resilience Metrics</h2>
                    <div style={styles.list}>
                        {resilienceMetrics.map((metric) => (
                            <div key={metric._id} style={{ ...styles.card, ...styles.metricCard }}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.deploymentName}>{metric.deployment}</span>
                                    <span style={{
                                        ...styles.score,
                                        color: metric.validation.score >= 0.7 ? '#10b981' : '#ef4444'
                                    }}>
                                        Score: {(metric.validation.score * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.metricsGrid}>
                                        {metric.validation.metricsEvaluation.map((m, idx) => (
                                            <div key={idx} style={styles.metricItem}>
                                                <span style={styles.metricLabel}>{m.metric}:</span>
                                                <span style={{
                                                    ...styles.metricValue,
                                                    color: m.tier === 'HEALTHY' ? '#10b981' : (m.tier === 'WARNING' ? '#f59e0b' : '#ef4444')
                                                }}>
                                                    {m.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <small style={styles.timestamp}>{new Date(metric.timestamp).toLocaleString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
        color: '#f3f4f6',
        backgroundColor: '#111827',
        borderRadius: '16px',
        minHeight: '80vh'
    },
    header: {
        fontSize: '2rem',
        marginBottom: '24px',
        textAlign: 'center',
        background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    dashboard: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px'
    },
    section: {
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        marginBottom: '16px',
        borderBottom: '1px solid #374151',
        paddingBottom: '8px'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '600px',
        overflowY: 'auto',
        paddingRight: '8px'
    },
    card: {
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#374151',
        transition: 'transform 0.2s',
        borderLeft: '4px solid transparent'
    },
    eventCard: {
        borderLeftColor: '#3b82f6'
    },
    metricCard: {
        borderLeftColor: '#10b981'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    deploymentName: {
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    badge: {
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    score: {
        fontWeight: 'bold',
        fontSize: '1.1rem'
    },
    cardBody: {
        fontSize: '0.9rem',
        color: '#d1d5db'
    },
    metricsGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px'
    },
    metricItem: {
        display: 'flex', justifyContent: 'space-between', padding: '4px', backgroundColor: '#1f2937', borderRadius: '4px'
    },
    metricLabel: { fontSize: '0.75rem', color: '#9ca3af' },
    metricValue: { fontWeight: 'bold' },
    timestamp: {
        display: 'block',
        marginTop: '12px',
        fontSize: '0.75rem',
        color: '#6b7280',
        textAlign: 'right'
    }
};

export default AutoScalingMonitor;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AccessDenied = () => {
    const navigate = useNavigate();
    const { role, user } = useAuth();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '40px 20px',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%'
            }}>
                {/* Icon */}
                <div style={{
                    fontSize: '64px',
                    marginBottom: '20px'
                }}>
                    🚫
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '12px'
                }}>
                    Access Denied
                </h1>

                {/* Message */}
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    marginBottom: '8px',
                    lineHeight: '1.6'
                }}>
                    You don't have permission to access this page.
                </p>

                {user && (
                    <p style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        marginBottom: '32px'
                    }}>
                        Logged in as <strong>{user.email}</strong>
                        {role && <> • Role: <strong>{role.display_name}</strong></>}
                    </p>
                )}

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    >
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        Go to Dashboard
                    </button>
                </div>

                {/* Help Text */}
                <div style={{
                    marginTop: '40px',
                    padding: '16px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fbbf24'
                }}>
                    <p style={{
                        fontSize: '14px',
                        color: '#92400e',
                        margin: 0,
                        lineHeight: '1.5'
                    }}>
                        <strong>Need access?</strong> Contact your administrator to request the necessary permissions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;

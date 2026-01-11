import React from 'react';
import { useAuth } from '../hooks/useAuth';
import RoleGuard from '../components/auth/RoleGuard';
import PermissionGuard from '../components/auth/PermissionGuard';

const GuardDemo = () => {
    const { user, role, permissions } = useAuth();

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>🛡️ Route Protection Demo</h1>

            {/* User Info */}
            <div style={{
                padding: '20px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                marginBottom: '30px'
            }}>
                <h2 style={{ marginTop: 0 }}>Your Current Access</h2>
                <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
                <p><strong>Role:</strong> {role?.display_name || 'No role assigned'} ({role?.name})</p>
                <p><strong>Permissions:</strong> {permissions?.length || 0} total</p>
                {permissions && permissions.length > 0 && (
                    <details>
                        <summary style={{ cursor: 'pointer', marginTop: '10px' }}>View all permissions</summary>
                        <ul style={{ marginTop: '10px' }}>
                            {permissions.map(perm => (
                                <li key={perm}>{perm}</li>
                            ))}
                        </ul>
                    </details>
                )}
            </div>

            {/* RoleGuard Tests */}
            <section style={{ marginBottom: '40px' }}>
                <h2>RoleGuard Tests</h2>
                <p style={{ color: '#6b7280' }}>These elements show/hide based on your role</p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                    <RoleGuard allowedRoles={['admin']}>
                        <div style={{
                            padding: '15px 20px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '6px',
                            border: '2px solid #dc2626'
                        }}>
                            ✅ Admin Only Section
                        </div>
                    </RoleGuard>

                    <RoleGuard allowedRoles={['manager']}>
                        <div style={{
                            padding: '15px 20px',
                            backgroundColor: '#dbeafe',
                            borderRadius: '6px',
                            border: '2px solid #2563eb'
                        }}>
                            ✅ Manager Only Section
                        </div>
                    </RoleGuard>

                    <RoleGuard allowedRoles={['staff']}>
                        <div style={{
                            padding: '15px 20px',
                            backgroundColor: '#d1fae5',
                            borderRadius: '6px',
                            border: '2px solid #059669'
                        }}>
                            ✅ Staff Only Section
                        </div>
                    </RoleGuard>

                    <RoleGuard allowedRoles={['admin', 'manager']}>
                        <div style={{
                            padding: '15px 20px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '6px',
                            border: '2px solid #f59e0b'
                        }}>
                            ✅ Admin OR Manager
                        </div>
                    </RoleGuard>
                </div>

                <RoleGuard
                    allowedRoles={['superuser']}
                    fallback={
                        <div style={{
                            marginTop: '10px',
                            padding: '15px 20px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '6px',
                            color: '#6b7280'
                        }}>
                            ❌ Superuser section (fallback shown - you're not a superuser)
                        </div>
                    }
                >
                    <div style={{
                        marginTop: '10px',
                        padding: '15px 20px',
                        backgroundColor: '#fae8ff',
                        borderRadius: '6px',
                        border: '2px solid #a855f7'
                    }}>
                        ✅ Superuser Only
                    </div>
                </RoleGuard>
            </section>

            {/* PermissionGuard Tests */}
            <section style={{ marginBottom: '40px' }}>
                <h2>PermissionGuard Tests</h2>
                <p style={{ color: '#6b7280' }}>These buttons show based on your permissions</p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                    <PermissionGuard requiredPermissions={['can_view_products']}>
                        <button style={{
                            padding: '10px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            👁️ View Products
                        </button>
                    </PermissionGuard>

                    <PermissionGuard requiredPermissions={['can_create_products']}>
                        <button style={{
                            padding: '10px 16px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            ➕ Create Product
                        </button>
                    </PermissionGuard>

                    <PermissionGuard requiredPermissions={['can_edit_products']}>
                        <button style={{
                            padding: '10px 16px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            ✏️ Edit Products
                        </button>
                    </PermissionGuard>

                    <PermissionGuard requiredPermissions={['can_delete_products']}>
                        <button style={{
                            padding: '10px 16px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            🗑️ Delete Products
                        </button>
                    </PermissionGuard>

                    <PermissionGuard requiredPermissions={['can_manage_roles']}>
                        <button style={{
                            padding: '10px 16px',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            👥 Manage Roles
                        </button>
                    </PermissionGuard>

                    <PermissionGuard
                        requiredPermissions={['can_edit_orders', 'can_delete_orders']}
                        requireAll={true}
                    >
                        <button style={{
                            padding: '10px 16px',
                            backgroundColor: '#06b6d4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            🔄 Edit AND Delete Orders
                        </button>
                    </PermissionGuard>

                    <PermissionGuard
                        requiredPermissions={['can_view_orders', 'can_edit_orders']}
                        requireAll={false}
                        fallback={
                            <button disabled style={{
                                padding: '10px 16px',
                                backgroundColor: '#d1d5db',
                                color: '#6b7280',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'not-allowed'
                            }}>
                                ❌ No Order Access
                            </button>
                        }
                    >
                        <button style={{
                            padding: '10px 16px',
                            backgroundColor: '#ec4899',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            📦 View OR Edit Orders
                        </button>
                    </PermissionGuard>
                </div>
            </section>

            {/* Instructions */}
            <section style={{
                padding: '20px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #3b82f6'
            }}>
                <h3 style={{ marginTop: 0 }}>📖 How to Test</h3>
                <ol style={{ margin: '10px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>You should only see sections/buttons for which you have access</li>
                    <li>Try logging in with different roles (admin, manager, staff)</li>
                    <li>Compare what you see with each role</li>
                    <li>Check the browser console for debug info</li>
                </ol>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#4b5563' }}>
                    <strong>Expected behavior:</strong>
                    <br />• Admin: See all sections and all buttons
                    <br />• Manager: See most buttons (except "Manage Roles")
                    <br />• Staff: See only view-related buttons
                </p>
            </section>
        </div>
    );
};

export default GuardDemo;

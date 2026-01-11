import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import * as roleService from '../services/roleService';

const ServiceTester = () => {
    const { user } = useAuth();
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [testProfile, setTestProfile] = useState({
        full_name: '',
        phone: ''
    });

    const runAllTests = async () => {
        setLoading(true);
        const testResults = {};

        try {
            // Test 1: Fetch all roles
            console.log('Test 1: Fetching all roles...');
            const rolesResult = await roleService.fetchRoles();
            testResults.roles = rolesResult;
            console.log('  ✅ Roles:', rolesResult.data);

            // Test 2: Fetch all permissions
            console.log('Test 2: Fetching all permissions...');
            const permsResult = await roleService.fetchPermissions();
            testResults.permissions = permsResult;
            console.log('  ✅ Permissions:', permsResult.data?.length, 'found');

            // Test 3: Get current user profile
            if (user?.id) {
                console.log('Test 3: Fetching user profile...');
                const profileResult = await authService.getUserProfile(user.id);
                testResults.profile = profileResult;
                console.log('  ✅ Profile:', profileResult.data);

                // Test 4: Get user's role
                console.log('Test 4: Fetching user role...');
                const roleResult = await authService.fetchUserRole(user.id);
                testResults.userRole = roleResult;
                console.log('  ✅ User Role:', roleResult.data?.roles);

                // Test 5: Get role permissions (if user has a role)
                if (roleResult.data?.roles?.id) {
                    console.log('Test 5: Fetching role permissions...', roleResult.data.roles.id);
                    const rolePermsResult = await roleService.getRolePermissions(roleResult.data.roles.id);
                    testResults.rolePermissions = rolePermsResult;
                    console.log('  ✅ Role Permissions:', rolePermsResult.data?.length, 'found');
                }
            }

            console.log('✅ All tests completed!');
        } catch (error) {
            console.error('❌ Test error:', error);
            testResults.error = error.message;
        }

        setResults(testResults);
        setLoading(false);
    };

    const testUpdateProfile = async () => {
        if (!user?.id) {
            alert('Please log in first');
            return;
        }

        if (!testProfile.full_name && !testProfile.phone) {
            alert('Please enter at least one field to update');
            return;
        }

        setLoading(true);
        const updates = {};
        if (testProfile.full_name) updates.full_name = testProfile.full_name;
        if (testProfile.phone) updates.phone = testProfile.phone;

        const { data, error } = await authService.updateUserProfile(user.id, updates);

        if (error) {
            alert('Update failed: ' + error.message);
        } else {
            alert('Profile updated successfully!');
            console.log('Updated profile:', data);
            // Refresh results
            await runAllTests();
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>🧪 Service Layer Tester</h1>
            <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Test all authService and roleService functions to verify Phase 3 implementation.
            </p>

            {/* Test Buttons */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '30px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={runAllTests}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}
                >
                    {loading ? 'Running Tests...' : 'Run All Tests'}
                </button>
            </div>

            {/* Update Profile Test */}
            <div style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '30px'
            }}>
                <h3 style={{ marginTop: 0 }}>Test Update Profile</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={testProfile.full_name}
                        onChange={(e) => setTestProfile({ ...testProfile, full_name: e.target.value })}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            flex: '1',
                            minWidth: '200px'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Phone (+1-555-1234)"
                        value={testProfile.phone}
                        onChange={(e) => setTestProfile({ ...testProfile, phone: e.target.value })}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            flex: '1',
                            minWidth: '200px'
                        }}
                    />
                    <button
                        onClick={testUpdateProfile}
                        disabled={loading}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: loading ? '#9ca3af' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            {/* Results Display */}
            {Object.keys(results).length > 0 && (
                <div>
                    <h2>Test Results</h2>

                    {/* Roles */}
                    {results.roles && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>📋 All Roles ({results.roles.data?.length || 0})</h3>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', overflow: 'auto' }}>
                                <pre style={{ margin: 0, fontSize: '13px' }}>
                                    {JSON.stringify(results.roles.data, null, 2)}
                                </pre>
                            </div>
                            {results.roles.data?.length === 3 ? (
                                <p style={{ color: '#10b981', margin: '10px 0 0 0' }}>
                                    ✅ Expected 3 roles found
                                </p>
                            ) : (
                                <p style={{ color: '#ef4444', margin: '10px 0 0 0' }}>
                                    ❌ Expected 3 roles, found {results.roles.data?.length}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Permissions */}
                    {results.permissions && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>🔐 All Permissions ({results.permissions.data?.length || 0})</h3>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', overflow: 'auto', maxHeight: '300px' }}>
                                <pre style={{ margin: 0, fontSize: '13px' }}>
                                    {JSON.stringify(results.permissions.data, null, 2)}
                                </pre>
                            </div>
                            {results.permissions.data?.length >= 14 ? (
                                <p style={{ color: '#10b981', margin: '10px 0 0 0' }}>
                                    ✅ Expected at least 14 permissions found
                                </p>
                            ) : (
                                <p style={{ color: '#ef4444', margin: '10px 0 0 0' }}>
                                    ⚠️ Expected at least 14 permissions, found {results.permissions.data?.length}
                                </p>
                            )}
                        </div>
                    )}

                    {/* User Profile */}
                    {results.profile && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>👤 User Profile</h3>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', overflow: 'auto' }}>
                                <pre style={{ margin: 0, fontSize: '13px' }}>
                                    {JSON.stringify(results.profile.data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* User Role */}
                    {results.userRole && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>🎭 User Role</h3>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', overflow: 'auto' }}>
                                <pre style={{ margin: 0, fontSize: '13px' }}>
                                    {JSON.stringify(results.userRole.data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Role Permissions */}
                    {results.rolePermissions && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>✅ Role Permissions ({results.rolePermissions.data?.length || 0})</h3>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', overflow: 'auto', maxHeight: '300px' }}>
                                <pre style={{ margin: 0, fontSize: '13px' }}>
                                    {JSON.stringify(results.rolePermissions.data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #3b82f6'
            }}>
                <h3 style={{ marginTop: 0 }}>📖 How to Use</h3>
                <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>Click "Run All Tests" to test all service functions</li>
                    <li>Check browser console for detailed logs</li>
                    <li>Results will display below with validation</li>
                    <li>Test "Update Profile" by entering a name/phone and clicking update</li>
                    <li>Verify the data matches your database in Supabase</li>
                </ol>

                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '6px' }}>
                    <strong>Expected Results:</strong>
                    <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
                        <li>3 roles (admin, manager, staff)</li>
                        <li>14+ permissions across categories</li>
                        <li>Your user profile with full_name, phone, avatar_url</li>
                        <li>Your assigned role (if any)</li>
                        <li>Permissions for your role</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ServiceTester;

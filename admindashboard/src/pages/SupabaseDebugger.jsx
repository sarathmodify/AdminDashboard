/**
 * Supabase Connection Debugger
 * Test component to verify Supabase connection and data access
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SupabaseDebugger() {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        const testResults = {};

        // Test 1: Check if Supabase client is configured
        testResults.clientConfigured = !!supabase;
        console.log('✅ Test 1: Supabase client exists:', testResults.clientConfigured);

        // Test 2: Check current session
        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            testResults.session = {
                exists: !!sessionData?.session,
                userId: sessionData?.session?.user?.id || null,
                email: sessionData?.session?.user?.email || null,
                error: sessionError?.message || null
            };
            console.log('✅ Test 2: Session:', testResults.session);
        } catch (error) {
            testResults.session = { error: error.message };
            console.error('❌ Test 2 Failed:', error);
        }

        // Test 3: Test connection with a simple query (check if tables exist)
        try {
            const { data, error, count } = await supabase
                .from('roles')
                .select('*', { count: 'exact' });

            testResults.rolesTable = {
                accessible: !error,
                count: count,
                data: data,
                error: error?.message || null
            };
            console.log('✅ Test 3: Roles table:', testResults.rolesTable);
        } catch (error) {
            testResults.rolesTable = { error: error.message };
            console.error('❌ Test 3 Failed:', error);
        }

        // Test 4: Check user_profiles table
        if (testResults.session?.userId) {
            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', testResults.session.userId)
                    .single();

                testResults.userProfile = {
                    exists: !!data,
                    data: data,
                    error: error?.message || null,
                    errorCode: error?.code || null
                };
                console.log('✅ Test 4: User profile:', testResults.userProfile);
            } catch (error) {
                testResults.userProfile = { error: error.message };
                console.error('❌ Test 4 Failed:', error);
            }
        }

        // Test 5: Check user_roles
        if (testResults.session?.userId) {
            try {
                const { data, error } = await supabase
                    .from('user_roles')
                    .select('*, roles(*)')
                    .eq('user_id', testResults.session.userId);

                testResults.userRoles = {
                    count: data?.length || 0,
                    data: data,
                    error: error?.message || null
                };
                console.log('✅ Test 5: User roles:', testResults.userRoles);
            } catch (error) {
                testResults.userRoles = { error: error.message };
                console.error('❌ Test 5 Failed:', error);
            }
        }

        // Test 6: Check permissions table
        try {
            const { data, error, count } = await supabase
                .from('permissions')
                .select('*', { count: 'exact' });

            testResults.permissionsTable = {
                accessible: !error,
                count: count,
                error: error?.message || null
            };
            console.log('✅ Test 6: Permissions table:', testResults.permissionsTable);
        } catch (error) {
            testResults.permissionsTable = { error: error.message };
            console.error('❌ Test 6 Failed:', error);
        }

        // Test 7: Check environment variables (without exposing them)
        testResults.envVars = {
            hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
            hasSupabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
            urlStartsWith: process.env.REACT_APP_SUPABASE_URL?.substring(0, 20) + '...',
            keyStartsWith: process.env.REACT_APP_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
        };
        console.log('✅ Test 7: Environment variables:', testResults.envVars);

        setResults(testResults);
        setLoading(false);
    };

    useEffect(() => {
        runTests();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-6">🔍 Supabase Connection Debugger</h1>

                <button
                    onClick={runTests}
                    disabled={loading}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Running Tests...' : 'Run Tests Again'}
                </button>

                {/* Test Results */}
                <div className="space-y-4">
                    {/* Test 1: Client */}
                    <TestResult
                        title="1. Supabase Client Configured"
                        passed={results.clientConfigured}
                        details={results.clientConfigured ? 'Client exists' : 'Client not initialized'}
                    />

                    {/* Test 2: Session */}
                    <TestResult
                        title="2. User Session"
                        passed={results.session?.exists && !results.session?.error}
                        details={
                            <div>
                                <p><strong>User ID:</strong> {results.session?.userId || 'Not logged in'}</p>
                                <p><strong>Email:</strong> {results.session?.email || 'N/A'}</p>
                                {results.session?.error && (
                                    <p className="text-red-600"><strong>Error:</strong> {results.session.error}</p>
                                )}
                            </div>
                        }
                    />

                    {/* Test 3: Roles Table */}
                    <TestResult
                        title="3. Roles Table Access"
                        passed={results.rolesTable?.accessible}
                        details={
                            <div>
                                <p><strong>Count:</strong> {results.rolesTable?.count || 0} roles</p>
                                {results.rolesTable?.data && (
                                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                                        {JSON.stringify(results.rolesTable.data, null, 2)}
                                    </pre>
                                )}
                                {results.rolesTable?.error && (
                                    <p className="text-red-600"><strong>Error:</strong> {results.rolesTable.error}</p>
                                )}
                            </div>
                        }
                    />

                    {/* Test 4: User Profile */}
                    <TestResult
                        title="4. User Profile"
                        passed={results.userProfile?.exists}
                        details={
                            <div>
                                {results.userProfile?.data && (
                                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                                        {JSON.stringify(results.userProfile.data, null, 2)}
                                    </pre>
                                )}
                                {results.userProfile?.error && (
                                    <div className="text-red-600">
                                        <p><strong>Error:</strong> {results.userProfile.error}</p>
                                        <p><strong>Code:</strong> {results.userProfile.errorCode}</p>
                                        {results.userProfile.errorCode === 'PGRST116' && (
                                            <p className="mt-2 text-orange-600">
                                                ⚠️ Profile doesn't exist. Run SQL to create it.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        }
                    />

                    {/* Test 5: User Roles */}
                    <TestResult
                        title="5. User Roles"
                        passed={results.userRoles?.count > 0}
                        details={
                            <div>
                                <p><strong>Roles Assigned:</strong> {results.userRoles?.count || 0}</p>
                                {results.userRoles?.data && (
                                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                                        {JSON.stringify(results.userRoles.data, null, 2)}
                                    </pre>
                                )}
                                {results.userRoles?.error && (
                                    <p className="text-red-600"><strong>Error:</strong> {results.userRoles.error}</p>
                                )}
                                {results.userRoles?.count === 0 && (
                                    <p className="text-orange-600 mt-2">
                                        ⚠️ No role assigned. Run SQL to assign admin role.
                                    </p>
                                )}
                            </div>
                        }
                    />

                    {/* Test 6: Permissions Table */}
                    <TestResult
                        title="6. Permissions Table Access"
                        passed={results.permissionsTable?.accessible}
                        details={
                            <div>
                                <p><strong>Count:</strong> {results.permissionsTable?.count || 0} permissions</p>
                                {results.permissionsTable?.error && (
                                    <p className="text-red-600"><strong>Error:</strong> {results.permissionsTable.error}</p>
                                )}
                            </div>
                        }
                    />

                    {/* Test 7: Environment Variables */}
                    <TestResult
                        title="7. Environment Variables"
                        passed={results.envVars?.hasSupabaseUrl && results.envVars?.hasSupabaseKey}
                        details={
                            <div>
                                <p><strong>REACT_APP_SUPABASE_URL:</strong> {results.envVars?.hasSupabaseUrl ? '✅ Set' : '❌ Missing'}</p>
                                <p><strong>REACT_APP_SUPABASE_ANON_KEY:</strong> {results.envVars?.hasSupabaseKey ? '✅ Set' : '❌ Missing'}</p>
                                {results.envVars?.hasSupabaseUrl && (
                                    <p className="text-xs text-gray-600 mt-2">URL starts with: {results.envVars.urlStartsWith}</p>
                                )}
                                {(!results.envVars?.hasSupabaseUrl || !results.envVars?.hasSupabaseKey) && (
                                    <p className="text-red-600 mt-2">⚠️ Check your .env file!</p>
                                )}
                            </div>
                        }
                    />
                </div>

                {/* Summary */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Summary</h2>
                    <div className="text-sm space-y-1">
                        <p>✅ Passed: {Object.values(results).filter(r => r === true || r?.exists || r?.accessible || r?.count > 0).length}</p>
                        <p>❌ Failed: {Object.values(results).filter(r => r === false || r?.error).length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TestResult({ title, passed, details }) {
    return (
        <div className={`p-4 rounded-lg border-2 ${passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{passed ? '✅' : '❌'}</span>
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="ml-10 text-sm">
                {typeof details === 'string' ? <p>{details}</p> : details}
            </div>
        </div>
    );
}

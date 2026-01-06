import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const RLSDebugger = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const testQuery = async (tableName, description) => {
        const startTime = Date.now();
        try {
            const { data, error, status, count } = await Promise.race([
                supabase.from(tableName).select('*', { count: 'exact' }).limit(1),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('TIMEOUT')), 5000)
                )
            ]);

            const duration = Date.now() - startTime;

            return {
                table: tableName,
                description,
                status: error ? '❌ ERROR' : '✅ SUCCESS',
                duration: `${duration}ms`,
                error: error?.message || 'None',
                rowCount: count,
                data: data ? `${data.length} rows` : 'None',
                details: { data, error, status }
            };
        } catch (err) {
            const duration = Date.now() - startTime;
            return {
                table: tableName,
                description,
                status: '⏱️ TIMEOUT',
                duration: `${duration}ms`,
                error: err.message,
                rowCount: 'N/A',
                data: 'BLOCKED',
                details: { error: err }
            };
        }
    };

    const runDiagnostics = async () => {
        setLoading(true);
        setResults([]);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        const tests = [
            { table: 'products', desc: 'Products table (working)' },
            { table: 'user_profiles', desc: 'User profiles table (problematic)' },
            { table: 'roles', desc: 'Roles table' },
            { table: 'permissions', desc: 'Permissions table' },
            { table: 'user_roles', desc: 'User roles table' },
        ];

        const testResults = [];

        for (const test of tests) {
            console.log(`Testing ${test.table}...`);
            const result = await testQuery(test.table, test.desc);
            testResults.push(result);
            setResults([...testResults]);
        }

        // Specific test for user's own profile
        if (userId) {
            console.log('Testing user own profile...');
            const startTime = Date.now();
            try {
                const { data, error } = await Promise.race([
                    supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('TIMEOUT')), 5000)
                    )
                ]);

                const duration = Date.now() - startTime;
                testResults.push({
                    table: 'user_profiles',
                    description: `Your specific profile (id: ${userId.substring(0, 8)}...)`,
                    status: error ? '❌ ERROR' : data ? '✅ FOUND' : '⚠️ NOT FOUND',
                    duration: `${duration}ms`,
                    error: error?.message || 'None',
                    data: data ? 'Profile exists' : 'No profile',
                    details: { data, error }
                });
            } catch (err) {
                const duration = Date.now() - startTime;
                testResults.push({
                    table: 'user_profiles',
                    description: `Your specific profile (id: ${userId.substring(0, 8)}...)`,
                    status: '⏱️ TIMEOUT / RLS BLOCKED',
                    duration: `${duration}ms`,
                    error: 'Query blocked by RLS policy',
                    data: 'BLOCKED',
                    details: { error: err }
                });
            }
        }

        setResults(testResults);
        setLoading(false);
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
            <h1>🔍 RLS Policy Debugger</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                This tool tests if Row Level Security (RLS) policies are blocking your queries.
                A TIMEOUT means the query is blocked by RLS.
            </p>

            <button
                onClick={runDiagnostics}
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: loading ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '30px'
                }}
            >
                {loading ? 'Running Tests...' : 'Run RLS Diagnostics'}
            </button>

            {results.length > 0 && (
                <div>
                    <h2>Test Results</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Table</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Duration</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Data</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{result.table}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{result.description}</td>
                                    <td style={{ padding: '12px' }}>{result.status}</td>
                                    <td style={{ padding: '12px', color: parseInt(result.duration) > 1000 ? 'red' : 'green' }}>
                                        {result.duration}
                                    </td>
                                    <td style={{ padding: '12px' }}>{result.data}</td>
                                    <td style={{ padding: '12px', color: '#e74c3c', fontSize: '13px' }}>
                                        {result.error}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{
                        marginTop: '40px',
                        padding: '20px',
                        backgroundColor: '#fff3cd',
                        borderRadius: '8px',
                        border: '1px solid #ffc107'
                    }}>
                        <h3>🛠️ How to Fix RLS Issues</h3>
                        <p>If you see TIMEOUT or BLOCKED status, follow these steps:</p>

                        <ol style={{ lineHeight: '1.8' }}>
                            <li>Go to your <strong>Supabase Dashboard</strong></li>
                            <li>Navigate to <strong>SQL Editor</strong></li>
                            <li>Run this SQL to fix user_profiles access:</li>
                        </ol>

                        <pre style={{
                            backgroundColor: '#282c34',
                            color: '#abb2bf',
                            padding: '20px',
                            borderRadius: '6px',
                            overflow: 'auto',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }}>
                            {`-- Fix RLS for user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);`}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RLSDebugger;

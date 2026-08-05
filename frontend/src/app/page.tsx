'use client'

import { useState } from 'react'
import LoginPage from './login/page'
import RegisterPage from './register/page'
import DashboardPage from './dashboard/page'

export default function Home() {
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login')
  const [token, setToken] = useState<string | null>(null)

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken)
    setView('dashboard')
  }

  const handleLogout = () => {
    setToken(null)
    setView('login')
  }

  if (view === 'dashboard' && token) {
    return <DashboardPage token={token} onLogout={handleLogout} />
  }

  return (
    <div>
      {/* 탭 스위처 */}
      <div style={{ 
        display: 'flex',
        background: 'var(--surface)',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <button
          onClick={() => setView('login')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: view === 'login' ? 'var(--primary)' : 'transparent',
            color: view === 'login' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          로그인
        </button>
        <button
          onClick={() => setView('register')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: view === 'register' ? 'var(--primary)' : 'transparent',
            color: view === 'register' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          회원가입
        </button>
      </div>

      {/* 폼 영역 */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {view === 'login' && <LoginPage onSuccess={handleLoginSuccess} />}
        {view === 'register' && <RegisterPage onRegister={() => setView('login')} />}
      </div>
    </div>
  )
}

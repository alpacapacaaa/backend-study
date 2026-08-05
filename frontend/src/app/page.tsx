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
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setView('login')}
          style={{
            marginRight: '1rem',
            padding: '0.5rem 1rem',
            background: view === 'login' ? '#0070f3' : '#e0e0e0',
            color: view === 'login' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          로그인
        </button>
        <button
          onClick={() => setView('register')}
          style={{
            padding: '0.5rem 1rem',
            background: view === 'register' ? '#0070f3' : '#e0e0e0',
            color: view === 'register' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          회원가입
        </button>
      </div>

      {view === 'login' && <LoginPage onSuccess={handleLoginSuccess} />}
      {view === 'register' && <RegisterPage onRegister={() => setView('login')} />}
    </div>
  )
}

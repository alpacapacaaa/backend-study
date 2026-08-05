'use client'

import { useState, useEffect } from 'react'
import LoginPage from './login/page'
import RegisterPage from './register/page'
import DashboardPage from './dashboard/page'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [view, setView] = useState<'splash' | 'startup' | 'login' | 'register' | 'dashboard'>('splash')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setView('startup')
    }, 1100)
    return () => clearTimeout(timer)
  }, [])

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken)
    setView('dashboard')
  }

  const handleLogout = () => {
    setToken(null)
    setView('startup')
  }

  if (view === 'dashboard' && token) {
    return <DashboardPage token={token} onLogout={handleLogout} />
  }

  if (view === 'splash') {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--primary)',
          animation: 'pulse 1.3s ease-in-out infinite',
        }} />
        <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--ink-400)' }}>
          AUTH SERVICE
        </span>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <LoginPage
        onSuccess={handleLoginSuccess}
        onBack={() => setView('startup')}
        onNavigateToRegister={() => setView('register')}
      />
    )
  }

  if (view === 'register') {
    return (
      <RegisterPage
        onRegister={() => setView('login')}
        onBack={() => setView('startup')}
        onNavigateToLogin={() => setView('login')}
      />
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      background: 'var(--bg)',
      padding: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Header variant="full" maxWidth="480px" onLoginClick={() => setView('login')} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: 'var(--ink-400)',
          }}>
            AUTH SERVICE
          </span>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.25,
            color: 'var(--ink-900)',
            marginTop: '14px',
            marginBottom: '14px',
          }}>
            안전하고 빠른<br />로그인 경험
          </h1>

          <p style={{
            fontSize: '15px',
            color: 'var(--ink-500)',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}>
            몇 초 안에 가입하고 바로 시작하세요.<br />
            비밀번호는 안전하게 암호화되어 저장됩니다.
          </p>

          <PrimaryButton onClick={() => setView('login')}>
            시작하기
          </PrimaryButton>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Footer maxWidth="480px" />
      </div>
    </div>
  )
}

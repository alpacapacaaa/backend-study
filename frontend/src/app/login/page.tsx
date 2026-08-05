'use client'

import { useState } from 'react'
import { login } from '@/lib/api'

interface LoginPageProps {
  onSuccess: (token: string) => void
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login({ email, password })
      onSuccess(res.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ 
          width: '48px',
          height: '48px',
          background: 'var(--primary)',
          borderRadius: '12px',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          로그인
        </h2>
        <p style={{ 
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
        }}>
          계정에 접속하세요
        </p>
      </div>

      {error && (
        <div style={{ 
          padding: '0.875rem 1rem',
          background: '#fef2f2',
          color: 'var(--error)',
          marginBottom: '1.25rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          border: '1px solid #fecaca',
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ 
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
        }}>
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="example@email.com"
          style={{ 
            width: '100%',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '0.9375rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
        }}>
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호 입력"
          style={{ 
            width: '100%',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '0.9375rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.9375rem',
          background: loading ? 'var(--text-tertiary)' : 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--primary-hover)')}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--primary)')}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

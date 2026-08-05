'use client'

import { useState } from 'react'
import { register } from '@/lib/api'

interface RegisterPageProps {
  onRegister: () => void
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register({ email, password, name })
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      onRegister()
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
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
          background: 'var(--success)',
          borderRadius: '12px',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          회원가입
        </h2>
        <p style={{ 
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
        }}>
          새로운 계정을 만들어보세요
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

      <div style={{ marginBottom: '1.25rem' }}>
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
          minLength={8}
          placeholder="8자 이상 입력"
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
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="홍길동"
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
        {loading ? '가입 중...' : '회원가입'}
      </button>
    </form>
  )
}

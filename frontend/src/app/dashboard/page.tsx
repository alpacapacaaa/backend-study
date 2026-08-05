'use client'

import { useState } from 'react'
import { Footer } from '@/components/Footer'

interface DashboardPageProps {
  token: string
  onLogout: () => void
}

export default function DashboardPage({ token, onLogout }: DashboardPageProps) {
  const [copied, setCopied] = useState(false)

  if (!token) return null

  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px 60px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="animate-fade-in" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '4px' }}>
              대시보드
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
              인증이 완료되었습니다
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              background: 'var(--surface)',
              color: 'var(--ink-700)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ink-300)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            로그아웃
          </button>
        </div>

        <div className="animate-slide-up" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'var(--primary)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '14px',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '2px' }}>
                로그인 성공!
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                JWT 토큰이 발급되었습니다
              </p>
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Access Token
            </h3>
            <button
              onClick={copyToken}
              style={{
                padding: '5px 11px',
                background: copied ? 'var(--success)' : 'var(--primary-soft)',
                color: copied ? 'white' : 'var(--primary)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {copied ? '✓ 복사됨' : '복사'}
            </button>
          </div>
          <pre style={{
            padding: '12px 14px',
            background: 'var(--surface-subtle)',
            borderRadius: '10px',
            overflow: 'auto',
            fontSize: '11px',
            lineHeight: 1.6,
            wordBreak: 'break-all',
            color: 'var(--ink-700)',
            maxHeight: '140px',
            border: '1px solid var(--border)',
          }}>
            {token}
          </pre>
        </div>

        <div className="animate-slide-up" style={{
          background: 'var(--primary-soft)',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #DBEAFE',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: '30px',
              height: '30px',
              background: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '10px' }}>
                API 호출 방법
              </p>
              <code style={{
                display: 'block',
                padding: '11px 13px',
                background: 'var(--surface)',
                borderRadius: '8px',
                fontSize: '11px',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
                fontFamily: 'monospace',
                overflowWrap: 'anywhere',
              }}>
                Authorization: Bearer {token.substring(0, 20)}...
              </code>
            </div>
          </div>
        </div>

        <Footer maxWidth="440px" />
      </div>
    </div>
  )
}

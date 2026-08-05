'use client'

interface DashboardPageProps {
  token: string
  onLogout: () => void
}

export default function DashboardPage({ token, onLogout }: DashboardPageProps) {
  return (
    <div>
      {/* 헤더 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
      }}>
        <div>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.25rem',
          }}>
            대시보드
          </h2>
          <p style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}>
            로그인 완료
          </p>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--surface)',
            color: 'var(--error)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2'
            e.currentTarget.style.borderColor = 'var(--error)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 성공 카드 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        color: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '0.125rem',
            }}>
              인증 성공
            </h3>
            <p style={{ 
              fontSize: '0.8125rem',
              opacity: 0.9,
            }}>
              JWT 토큰이 발급되었습니다
            </p>
          </div>
        </div>
      </div>

      {/* 토큰 정보 */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '1rem',
      }}>
        <h4 style={{ 
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem',
        }}>
          액세스 토큰
        </h4>
        <pre style={{
          padding: '1rem',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.75rem',
          lineHeight: 1.5,
          wordBreak: 'break-all',
          color: 'var(--text-primary)',
        }}>
          {token}
        </pre>
      </div>

      {/* 사용법 안내 */}
      <div style={{
        background: '#f0f9ff',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid #bae6fd',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem',
            flexShrink: 0,
            marginTop: '0.125rem',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <div>
            <p style={{ 
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              API 호출 방법
            </p>
            <p style={{ 
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}>
              이 토큰을 헤더에 포함하여 인증이 필요한 API를 호출하세요.
            </p>
            <code style={{
              display: 'block',
              padding: '0.625rem 0.75rem',
              background: 'var(--surface)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: 'var(--primary)',
              border: '1px solid var(--border)',
            }}>
              Authorization: Bearer {token.substring(0, 20)}...
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

interface DashboardPageProps {
  token: string
  onLogout: () => void
}

export default function DashboardPage({ token, onLogout }: DashboardPageProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>대시보드</h2>
        <button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#f44',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          로그아웃
        </button>
      </div>

      <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>로그인 성공!</h3>
        <p>JWT 토큰이 발급되었습니다.</p>
        
        <div style={{ marginTop: '1.5rem' }}>
          <h4>토큰:</h4>
          <pre style={{ 
            padding: '1rem', 
            background: '#fff', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.875rem',
            wordBreak: 'break-all',
          }}>
            {token}
          </pre>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '4px' }}>
          <p style={{ margin: 0 }}>
            <strong>다음 단계:</strong> 이 토큰을 사용하여 인증이 필요한 API를 호출할 수 있습니다.
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
            예: <code>Authorization: Bearer {token.substring(0, 20)}...</code>
          </p>
        </div>
      </div>
    </div>
  )
}

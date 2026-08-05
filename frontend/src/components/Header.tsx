interface HeaderProps {
  variant?: 'full' | 'compact'
  maxWidth?: string
  onLoginClick?: () => void
}

export function Header({ variant = 'compact', maxWidth = '400px', onLoginClick }: HeaderProps) {
  return (
    <header style={{
      width: '100%',
      maxWidth,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '6px',
          background: 'var(--primary)',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--ink-900)' }}>
          AUTH
        </span>
      </div>

      {variant === 'full' && (
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <span className="nav-link" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-500)' }}>
            서비스 소개
          </span>
          <span className="nav-link" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-500)' }}>
            고객센터
          </span>
          {onLoginClick && (
            <span
              onClick={onLoginClick}
              className="nav-link"
              style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}
            >
              로그인
            </span>
          )}
        </nav>
      )}
    </header>
  )
}

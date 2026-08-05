interface FooterProps {
  maxWidth?: string
}

export function Footer({ maxWidth = '400px' }: FooterProps) {
  return (
    <footer style={{
      width: '100%',
      maxWidth,
      marginTop: '40px',
      paddingTop: '20px',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span className="nav-link" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-500)' }}>
          이용약관
        </span>
        <span className="nav-link" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-500)' }}>
          개인정보처리방침
        </span>
        <span className="nav-link" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-500)' }}>
          고객센터
        </span>
      </div>
      <p style={{ fontSize: '11px', color: 'var(--ink-400)' }}>
        © 2026 Auth Service Inc. All rights reserved.
      </p>
    </footer>
  )
}

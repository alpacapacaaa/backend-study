import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '인증 서비스',
  description: '안전한 회원가입 및 로그인',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div style={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <header style={{ 
            padding: '1rem 1.5rem',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}>
            <div style={{ 
              maxWidth: '480px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <h1 style={{ 
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                인증 서비스
              </h1>
            </div>
          </header>
          <main style={{ 
            flex: 1,
            padding: '1.5rem',
            maxWidth: '480px',
            margin: '0 auto',
            width: '100%',
          }}>
            {children}
          </main>
          <footer style={{
            padding: '1rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)',
          }}>
            © 2026 Auth Service. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2주차 - 인증',
  description: '회원가입 및 로그인',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <header style={{ padding: '1rem', background: '#f0f0f0' }}>
          <h1 style={{ margin: 0 }}>2주차 - 인증</h1>
        </header>
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}

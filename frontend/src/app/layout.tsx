import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: {
    default: '인증 서비스 | 안전한 로그인 & 회원가입',
    template: '%s | 인증 서비스',
  },
  description: '몇 초 만에 가입하고 안전하게 로그인하세요. JWT 기반 인증으로 안전하게 보호됩니다.',
  keywords: ['인증', '로그인', '회원가입', 'JWT', '보안'],
  applicationName: '인증 서비스',
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
  openGraph: {
    title: '인증 서비스',
    description: '몇 초 만에 가입하고 안전하게 로그인하세요.',
    locale: 'ko_KR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={geist.variable}>
      <body style={{ fontFamily: 'var(--font-geist), -apple-system, BlinkMacSystemFont, sans-serif', minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </body>
    </html>
  )
}

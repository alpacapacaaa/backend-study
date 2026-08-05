'use client'

import { useState } from 'react'
import { login } from '@/lib/api'
import { FormField } from '@/components/FormField'
import { CheckBox } from '@/components/CheckBox'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SwitchLink } from '@/components/SwitchLink'
import { BackButton } from '@/components/BackButton'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '@/components/icons'

interface LoginPageProps {
  onSuccess: (token: string) => void
  onBack: () => void
  onNavigateToRegister: () => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FieldErrors {
  email?: string
  password?: string
}

export default function LoginPage({ onSuccess, onBack, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!email.trim()) next.email = '이메일을 입력해주세요.'
    else if (!EMAIL_REGEX.test(email)) next.email = `'${email}'에 '@'가 없어요. 올바른 이메일 형식으로 입력해주세요.`
    if (!password) next.password = '비밀번호를 입력해주세요.'
    return next
  }

  const handleBlur = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: validate()[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validation = validate()
    setFieldErrors(validation)
    if (Object.keys(validation).length > 0) return

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
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'var(--bg)',
      padding: '32px 24px 56px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', marginBottom: '28px' }}>
        <Header variant="compact" />
      </div>

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '32px' }}>
          <BackButton onClick={onBack} />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '4px' }}>
          로그인
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-500)', marginBottom: '32px' }}>
          다시 만나서 반가워요
        </p>

        {error && (
          <div className="animate-fade-in" style={{
            padding: '12px 14px',
            background: 'var(--error-soft)',
            color: 'var(--error)',
            marginBottom: '20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField
              label="이메일"
              icon={<MailIcon />}
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
              }}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              autoComplete="email"
              required
              error={fieldErrors.email}
            />
            <FormField
              label="비밀번호"
              icon={<LockIcon />}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(v) => {
                setPassword(v)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
              }}
              onBlur={() => handleBlur('password')}
              placeholder="비밀번호 입력"
              autoComplete="current-password"
              required
              error={fieldErrors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  style={{ background: 'none', border: 'none', padding: 0, display: 'flex', color: 'var(--ink-400)', flexShrink: 0 }}
                >
                  {showPassword ? <EyeOffIcon width={16} height={16} /> : <EyeIcon width={16} height={16} />}
                </button>
              }
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 28px' }}>
            <CheckBox checked={rememberMe} onChange={setRememberMe} label="로그인 상태 유지" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>
              비밀번호를 잊으셨나요?
            </span>
          </div>

          <PrimaryButton type="submit" loading={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </PrimaryButton>
        </form>

        <div style={{ marginTop: '20px' }}>
          <SwitchLink prompt="계정이 없으신가요?" actionLabel="회원가입" onClick={onNavigateToRegister} />
        </div>

        <Footer />
      </div>
    </div>
  )
}

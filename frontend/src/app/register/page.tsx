'use client'

import { useEffect, useState } from 'react'
import { register } from '@/lib/api'
import { FormField } from '@/components/FormField'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SwitchLink } from '@/components/SwitchLink'
import { BackButton } from '@/components/BackButton'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DodgeCheckbox } from '@/components/DodgeCheckbox'
import { PasswordStrength } from '@/components/PasswordStrength'
import { MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from '@/components/icons'

interface RegisterPageProps {
  onRegister: () => void
  onBack: () => void
  onNavigateToLogin: () => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FieldErrors {
  email?: string
  name?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterPage({ onRegister, onBack, onNavigateToLogin }: RegisterPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  // 체크박스 자체가 마우스를 피해 도망다닙니다 (DodgeCheckbox 참고).
  // 체크되기 전에 가입하기를 누르면 안내 문구만 보여주고 제출은 막습니다.
  const [dodgeHint, setDodgeHint] = useState('')

  useEffect(() => {
    if (termsAgreed) setDodgeHint('')
  }, [termsAgreed])

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!email.trim()) next.email = '이메일을 입력해주세요.'
    else if (!EMAIL_REGEX.test(email)) next.email = `'${email}'에 '@'가 없어요. 올바른 이메일 형식으로 입력해주세요.`
    if (!name.trim()) next.name = '이름을 입력해주세요.'
    if (!password) next.password = '비밀번호를 입력해주세요.'
    else if (password.length < 8) next.password = '비밀번호는 8자 이상이어야 해요.'
    if (!confirmPassword) next.confirmPassword = '비밀번호를 다시 입력해주세요.'
    else if (password !== confirmPassword) next.confirmPassword = '비밀번호가 일치하지 않아요.'
    return next
  }

  const handleBlur = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: validate()[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAgreed) {
      setDodgeHint('위 체크박스에 동의해야 가입할 수 있어요')
      return
    }

    setError('')

    const validation = validate()
    setFieldErrors(validation)
    if (Object.keys(validation).length > 0) return

    setLoading(true)
    try {
      await register({ email, password, name })
      onRegister()
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
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
          회원가입
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-500)', marginBottom: '32px' }}>
          몇 가지 정보만 입력하면 바로 시작할 수 있어요
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
              label="이름"
              icon={<UserIcon />}
              type="text"
              value={name}
              onChange={(v) => {
                setName(v)
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
              }}
              onBlur={() => handleBlur('name')}
              placeholder="홍길동"
              autoComplete="name"
              required
              error={fieldErrors.name}
            />
            <div>
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
                placeholder="8자 이상 입력"
                autoComplete="new-password"
                required
                minLength={8}
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
              {!fieldErrors.password && <PasswordStrength password={password} />}
            </div>
            <FormField
              label="비밀번호 확인"
              icon={<LockIcon />}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v)
                if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }))
              }}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="비밀번호를 다시 입력"
              autoComplete="new-password"
              required
              minLength={8}
              error={fieldErrors.confirmPassword}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  style={{ background: 'none', border: 'none', padding: 0, display: 'flex', color: 'var(--ink-400)', flexShrink: 0 }}
                >
                  {showConfirmPassword ? <EyeOffIcon width={16} height={16} /> : <EyeIcon width={16} height={16} />}
                </button>
              }
            />
          </div>

          <div style={{ margin: '24px 0 28px' }}>
            <DodgeCheckbox
              checked={termsAgreed}
              onChange={setTermsAgreed}
              label="(필수) 모든 시크릿키와 개인정보를 카톡으로 보내는 것에 동의합니다"
            />
          </div>

          <PrimaryButton type="submit" loading={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </PrimaryButton>
          {dodgeHint && (
            <p className="animate-fade-in" style={{ marginTop: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--warning)' }}>
              {dodgeHint}
            </p>
          )}
        </form>

        <div style={{ marginTop: '20px' }}>
          <SwitchLink prompt="이미 계정이 있으신가요?" actionLabel="로그인" onClick={onNavigateToLogin} />
        </div>

        <Footer />
      </div>
    </div>
  )
}

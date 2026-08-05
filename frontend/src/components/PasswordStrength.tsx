interface PasswordStrengthProps {
  password: string
}

function getScore(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  return score
}

const LEVELS = [
  { label: '너무 약함', color: 'var(--error)' },
  { label: '약함', color: 'var(--error)' },
  { label: '보통', color: 'var(--warning)' },
  { label: '좋음', color: 'var(--primary)' },
  { label: '강함', color: 'var(--success)' },
]

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null
  const score = getScore(password)
  const level = LEVELS[score]

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '2px',
              background: i < score ? level.color : 'var(--border)',
              transition: 'background 0.2s ease',
            }}
          />
        ))}
      </div>
      <p style={{ marginTop: '5px', fontSize: '11px', fontWeight: 600, color: level.color }}>
        비밀번호 강도: {level.label}
      </p>
    </div>
  )
}

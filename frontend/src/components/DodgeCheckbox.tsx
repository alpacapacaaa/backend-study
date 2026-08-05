'use client'

import { useState } from 'react'

const ZONE_WIDTH = 108
const ZONE_HEIGHT = 32
const BOX_SIZE = 16

const TEASE_MESSAGES = [
  '',
  '어이쿠, 손이 미끄러졌나 봐요 🙈',
  '오늘은 안 잡힐 것 같은데요?',
  '진짜 끈질기시네요... 그래도 안 잡혀요 🏃',
  '포기하지 않는 그 마음, 응원할게요',
  '힌트: 키보드 Tab으로 이동한 뒤 Space를 눌러보세요 ⌨️',
]

function randomPos() {
  return {
    x: Math.round(Math.random() * (ZONE_WIDTH - BOX_SIZE)),
    y: Math.round(Math.random() * (ZONE_HEIGHT - BOX_SIZE)),
  }
}

interface DodgeCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

// 체크되기 전까지는 마우스로 잡을 수 없는 체크박스. 마우스가 다가오면(hover/click)
// 도망가고, 키보드(Tab으로 포커스 후 Space/Enter)로만 진짜로 체크할 수 있습니다.
export function DodgeCheckbox({ checked, onChange, label }: DodgeCheckboxProps) {
  const [pos, setPos] = useState({ x: 0, y: (ZONE_HEIGHT - BOX_SIZE) / 2 })
  const [attempts, setAttempts] = useState(0)

  const dodge = () => {
    if (checked) return
    setPos(randomPos())
    setAttempts((n) => Math.min(n + 1, TEASE_MESSAGES.length - 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onChange(!checked)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: ZONE_WIDTH, height: ZONE_HEIGHT, flexShrink: 0 }}>
        <span
          role="checkbox"
          aria-checked={checked}
          aria-label={label}
          tabIndex={0}
          onMouseEnter={dodge}
          onClick={dodge}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: BOX_SIZE,
            height: BOX_SIZE,
            borderRadius: '4px',
            border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
            background: checked ? 'var(--primary)' : 'var(--surface)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s, border-color 0.15s',
          }}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5L6.2 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
      <div>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)' }}>
          {label}
        </span>
        {attempts > 0 && (
          <p className="animate-fade-in" style={{ fontSize: '11px', color: 'var(--ink-400)', marginTop: '3px' }}>
            {TEASE_MESSAGES[attempts]}
          </p>
        )}
      </div>
    </div>
  )
}

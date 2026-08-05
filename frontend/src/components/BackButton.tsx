'use client'

import { ArrowLeftIcon } from './icons'

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="뒤로가기"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ink-300)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <ArrowLeftIcon width={16} height={16} color="var(--ink-600)" />
    </button>
  )
}

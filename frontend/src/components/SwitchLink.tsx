interface SwitchLinkProps {
  prompt: string
  actionLabel: string
  onClick: () => void
}

export function SwitchLink({ prompt, actionLabel, onClick }: SwitchLinkProps) {
  return (
    <p style={{ textAlign: 'center', fontSize: '13px' }}>
      <span style={{ color: 'var(--ink-500)' }}>{prompt} </span>
      <span
        onClick={onClick}
        style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
      >
        {actionLabel}
      </span>
    </p>
  )
}

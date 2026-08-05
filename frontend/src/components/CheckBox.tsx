interface CheckBoxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function CheckBox({ checked, onChange, label }: CheckBoxProps) {
  return (
    <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
      <span style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
        background: checked ? 'var(--primary)' : 'var(--surface)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.2 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-700)' }}>
        {label}
      </span>
    </label>
  )
}

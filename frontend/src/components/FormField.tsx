import { AlertIcon } from './icons'

interface FormFieldProps {
  label: string
  icon?: React.ReactNode
  type?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder: string
  required?: boolean
  minLength?: number
  autoComplete?: string
  rightSlot?: React.ReactNode
  error?: string
}

export function FormField({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  minLength,
  autoComplete,
  rightSlot,
  error,
}: FormFieldProps) {
  return (
    <div style={{ width: '100%' }}>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--ink-700)',
        marginBottom: '6px',
      }}>
        {label}
      </label>
      <div
        className={`field-box${error ? ' error' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          padding: '11px 14px',
          background: 'var(--surface)',
        }}
      >
        {icon && (
          <span style={{ width: '16px', height: '16px', flexShrink: 0, display: 'flex', color: error ? 'var(--error)' : 'var(--ink-400)' }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            color: 'var(--ink-900)',
          }}
        />
        {rightSlot}
      </div>
      {error && (
        <p
          className="animate-fade-in"
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '6px',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--error)',
          }}
        >
          <AlertIcon width={12} height={12} style={{ flexShrink: 0 }} />
          {error}
        </p>
      )}
    </div>
  )
}

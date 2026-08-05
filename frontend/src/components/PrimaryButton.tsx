'use client'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export function PrimaryButton({ loading, disabled, children, style, className, ...rest }: PrimaryButtonProps) {
  return (
    <button
      {...rest}
      disabled={loading || disabled}
      className={`btn-primary${className ? ` ${className}` : ''}`}
      style={{
        width: '100%',
        padding: '14px 10px',
        borderRadius: '10px',
        border: 'none',
        background: 'var(--primary)',
        color: '#FFFFFF',
        fontSize: '15px',
        fontWeight: 700,
        opacity: loading || disabled ? 0.4 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
    >
      {loading && (
        <span style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.4)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      )}
      {children}
    </button>
  )
}

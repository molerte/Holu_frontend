export const Button = ({
    children, onClick, variant = 'primary',
    size = 'md', disabled = false, type = 'button', fullWidth = false,
}) => (
    <button
        type={type}
        className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn-full-width' : ''}`}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);
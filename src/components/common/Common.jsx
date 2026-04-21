import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Common.css';

export const Modal = ({ isOpen, onClose, title, badge, children }) => {

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = String(scrollY);
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      delete document.body.dataset.scrollY;
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="modal-blur" aria-hidden="true" />

      <div
        className="modal-overlay"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="modal"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title-row">
              <h2 className="modal-title">{title}</h2>
              {badge && <span className="modal-badge">{badge}</span>}
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
};

export const Button = ({
  children, onClick, variant = 'primary',
  size = 'md', disabled = false, type = 'button', fullWidth = false,
}) => (
  <button
    type={type}
    className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const Dropdown = ({ value, onChange, options, placeholder, disabled }) => (
  <select
    className="dropdown"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value ?? opt} value={opt.value ?? opt}>
        {opt.label ?? opt}
      </option>
    ))}
  </select>
);

export const Tag = ({ label, onRemove }) => (
  <span className="tag">
    #{label}
    {onRemove && (
      <button className="tag-remove" onClick={() => onRemove(label)}>✕</button>
    )}
  </span>
);

export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <div className="error-message">{message}</div>;
};


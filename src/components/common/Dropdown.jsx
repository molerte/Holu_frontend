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
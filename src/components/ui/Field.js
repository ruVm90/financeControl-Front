import { useState } from "react"
import { C } from "../../theme/tokens"

export default function Field({
  label,
  type = "text",
  as = "input",
  value,
  onChange,
  placeholder,
  required,
  min,
  step,
  minLength,
  autoComplete,
  disabled,
  rows,
  options,
}) {
  const [focused, setFocused] = useState(false)
  const sharedStyle = {
    width: "100%",
    background: C.bgInput,
    border: `1px solid ${focused ? C.accent : C.border}`,
    borderRadius: 10,
    padding: "12px 16px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
    boxShadow: focused ? `0 0 0 3px ${C.accentDim}` : "none",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "text",
    resize: as === "textarea" ? "vertical" : "none",
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {as === "select" ? (
        <select
          value={value}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...sharedStyle, cursor: disabled ? "not-allowed" : "pointer" }}
        >
          {(options || []).map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows || 4}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
          minLength={minLength}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      )}
    </div>
  )
}

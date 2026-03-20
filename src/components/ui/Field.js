import { useState } from "react"
import { C } from "../../theme/tokens"

export default function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  min,
  minLength,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false)

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
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        min={min}
        minLength={minLength}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
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
        }}
      />
    </div>
  )
}

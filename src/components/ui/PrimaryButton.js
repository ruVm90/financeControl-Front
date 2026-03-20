import { C } from "../../theme/tokens"

export default function PrimaryButton({ children, onClick, loading, type = "button", style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        background: loading ? "#4A4580" : C.accent,
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "13px",
        fontSize: 14,
        fontWeight: 700,
        cursor: loading ? "wait" : "pointer",
        fontFamily: "inherit",
        transition: "background 0.15s, transform 0.1s",
        letterSpacing: "0.02em",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.background = C.accentHover
      }}
      onMouseLeave={(e) => {
        if (!loading) e.currentTarget.style.background = C.accent
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.98)"
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      {loading ? "Cargando…" : children}
    </button>
  )
}

import { useState } from "react"
import { Icons } from "../icons"
import { C } from "../../theme/tokens"

export default function NavItem({ icon, label, active, onClick, badge }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        background: active ? `${C.accent}18` : hovered ? `${C.border}80` : "transparent",
        color: active ? C.accent : hovered ? C.text : C.textMuted,
        fontFamily: "inherit",
        marginBottom: 2,
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, flex: 1 }}>{label}</span>
      {badge != null && (
        <span
          style={{
            background: C.accentDim,
            color: C.accent,
            borderRadius: 20,
            padding: "1px 7px",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
      )}
      {active && <span style={{ lineHeight: 0, opacity: 0.5 }}>{Icons.chevron}</span>}
    </button>
  )
}

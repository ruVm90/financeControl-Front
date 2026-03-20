import { api } from "../../lib/api"
import { C } from "../../theme/tokens"
import Logo from "../ui/Logo"

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.gold}12 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${C.border}33 1px, transparent 1px), linear-gradient(90deg, ${C.border}33 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.3,
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "10px 18px",
              }}
            >
              <Logo size={32} />
              <span style={{ fontSize: 18, fontWeight: 800, color: C.text, letterSpacing: "-0.5px" }}>
                FinanceControl
              </span>
            </div>
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: C.text,
              margin: "0 0 8px",
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>{subtitle}</p>
        </div>

        <div
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 32,
            boxShadow: "0 24px 64px #00000040",
          }}
        >
          {children}
        </div>

        <p
          style={{
            textAlign: "center",
            color: C.textDim,
            fontSize: 12,
            marginTop: 24,
          }}
        >
          Conectando con <code style={{ color: C.textMuted, fontSize: 11 }}>{api.API_BASE}</code>
        </p>
      </div>
    </div>
  )
}

import { useState } from "react"
import { api } from "../../lib/api"
import { useAuth } from "../../context/auth"
import { C } from "../../theme/tokens"
import { Icons } from "../icons"
import Logo from "../ui/Logo"
import NavItem from "./NavItem"

export default function Sidebar({ page, setPage, user, onLogout, expensesCount, categoriesCount }) {
  const [loggingOut, setLoggingOut] = useState(false)
  const { token } = useAuth()

  async function handleLogout() {
    setLoggingOut(true)

    try {
      await api.logout(token)
    } catch (_) {
      // El cierre local de sesión debe ocurrir aunque falle la petición al backend.
    }

    onLogout()
  }

  const initials = user?.name
    ? user.name.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase()
    : "FC"

  return (
    <aside
      style={{
        width: 230,
        background: C.bgCard,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "20px 16px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Logo size={34} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.3px" }}>
            FinanceControl
          </p>
          <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>Panel personal</p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: C.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            padding: "0 10px",
            margin: "0 0 8px",
          }}
        >
          Menú
        </p>
        <NavItem
          icon={Icons.grid}
          label="Dashboard"
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        />
        <NavItem
          icon={Icons.expenses}
          label="Gastos"
          active={page === "expenses"}
          onClick={() => setPage("expenses")}
          badge={expensesCount}
        />
        <NavItem
          icon={Icons.categories}
          label="Categorías"
          active={page === "categories"}
          onClick={() => setPage("categories")}
          badge={categoriesCount}
        />
      </nav>

      <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: `${C.border}50`,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.accent}, #A78BFF)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || "Usuario"}
            </p>
            <p
              style={{
                fontSize: 10,
                color: C.textMuted,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "9px 12px",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            background: "transparent",
            color: C.textMuted,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "inherit",
            fontWeight: 600,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2D1B1B"
            e.currentTarget.style.color = "#FCA5A5"
            e.currentTarget.style.borderColor = "#7F1D1D"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = C.textMuted
            e.currentTarget.style.borderColor = C.border
          }}
        >
          {Icons.logout}
          {loggingOut ? "Cerrando…" : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  )
}

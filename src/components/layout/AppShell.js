import { useState } from "react"
import { C } from "../../theme/tokens"
import Sidebar from "./Sidebar"

function ComingSoon({ pageName }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        color: C.textMuted,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          fontSize: 28,
        }}
      >
        🚧
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>{pageName}</p>
      <p style={{ fontSize: 13, margin: 0 }}>Esta sección llegará en la siguiente parte</p>
    </div>
  )
}

export default function AppShell({ user, onLogout }) {
  const [page, setPage] = useState("dashboard")

  const expensesCount = null
  const categoriesCount = null

  function renderPage() {
    switch (page) {
      case "dashboard":
        return <ComingSoon pageName="Dashboard" />
      case "expenses":
        return <ComingSoon pageName="Gastos" />
      case "categories":
        return <ComingSoon pageName="Categorías" />
      default:
        return <ComingSoon pageName="Dashboard" />
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: C.text,
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        select option { background: ${C.bgCard}; color: ${C.text}; }
        body { margin: 0; background: ${C.bg}; }
      `}</style>

      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={onLogout}
        expensesCount={expensesCount}
        categoriesCount={categoriesCount}
      />

      <main style={{ flex: 1, padding: "44px 48px", overflowY: "auto" }}>{renderPage()}</main>
    </div>
  )
}

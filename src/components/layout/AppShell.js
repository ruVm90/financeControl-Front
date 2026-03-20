import { useEffect, useState } from "react"
import { useAuth } from "../../context/auth"
import { api } from "../../lib/api"
import { C } from "../../theme/tokens"
import CategoriesPage from "../CategoriesPage"
import Dashboard from "../Dashboard"
import ExpensesPage from "../ExpensesPage"
import Sidebar from "./Sidebar"

export default function AppShell({ user, onLogout }) {
  const { token } = useAuth()
  const [page, setPage] = useState("dashboard")
  const [categories, setCategories] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0)

  async function reloadCategories() {
    setLoadingCategories(true)
    try {
      const data = await api.getCategories(token)
      setCategories(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [])
    } finally {
      setLoadingCategories(false)
    }
  }

  async function reloadExpenses() {
    setLoadingExpenses(true)
    try {
      const data = await api.getExpenses(token)
      setExpenses(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [])
    } finally {
      setLoadingExpenses(false)
    }
  }

  async function reloadAllData() {
    await Promise.all([reloadCategories(), reloadExpenses()])
  }

  function refreshDashboard() {
    setDashboardRefreshKey((current) => current + 1)
  }

  async function handleDataMutation() {
    await reloadAllData()
    refreshDashboard()
  }

  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function loadInitialData() {
      setLoadingCategories(true)
      setLoadingExpenses(true)

      try {
        const [categoriesData, expensesData] = await Promise.all([
          api.getCategories(token),
          api.getExpenses(token),
        ])

        if (cancelled) return

        setCategories(Array.isArray(categoriesData?.data) ? categoriesData.data : Array.isArray(categoriesData) ? categoriesData : [])
        setExpenses(Array.isArray(expensesData?.data) ? expensesData.data : Array.isArray(expensesData) ? expensesData : [])
      } finally {
        if (!cancelled) {
          setLoadingCategories(false)
          setLoadingExpenses(false)
        }
      }
    }

    loadInitialData()

    return () => {
      cancelled = true
    }
  }, [token])

  const expensesCount = expenses.length
  const categoriesCount = categories.length

  function renderPage() {
    switch (page) {
      case "dashboard":
        return <Dashboard refreshKey={dashboardRefreshKey} />
      case "expenses":
        return (
          <ExpensesPage
            expenses={expenses}
            categories={categories}
            loading={loadingExpenses || loadingCategories}
            onSaved={handleDataMutation}
            onDeleted={handleDataMutation}
            onGoToCategories={() => setPage("categories")}
          />
        )
      case "categories":
        return (
          <CategoriesPage
            categories={categories}
            loading={loadingCategories}
            onSaved={handleDataMutation}
            onDeleted={handleDataMutation}
          />
        )
      default:
        return <Dashboard refreshKey={dashboardRefreshKey} />
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

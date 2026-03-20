import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAuth } from "../context/auth"
import { api } from "../lib/api"
import { C } from "../theme/tokens"
import ErrorBanner from "./ui/ErrorBanner"

// ─────────────────────────────────────────────
// TARJETA DE ESTADÍSTICA
// ─────────────────────────────────────────────
function StatCard({ label, value, unit = "€", change, isPositive = false }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 16,
      flex: 1,
      minWidth: 200,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: C.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: 12,
      }}>
        {label}
      </div>
      
      <div style={{
        fontSize: 24,
        fontWeight: 700,
        color: C.accent,
        fontFamily: "monospace",
        marginBottom: 8,
        letterSpacing: "-1px",
      }}>
        {unit}{value}
      </div>
      
      {change !== undefined && (
        <div style={{
          fontSize: 11,
          color: isPositive ? C.danger : C.success,
          fontWeight: 600,
        }}>
          {isPositive ? "+" : ""}{change}%
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL DASHBOARD
// ─────────────────────────────────────────────
export default function Dashboard() {
  const { token } = useAuth()

  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [byCategory, setByCategory] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return undefined

    let cancelled = false

    async function fetchAllData() {
      setLoading(true)
      setError("")

      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()

      try {
        const [summaryData, trendsData, categoryData, forecastData] = await Promise.all([
          api.getSummary(token),
          api.getTrends(token, 6),
          api.getByCategory(token, month, year),
          api.getForecast(token),
        ])

        if (cancelled) return

        setSummary(summaryData.current_month)
        setTrends(trendsData.data)
        setByCategory(categoryData.data)
        setForecast(forecastData)
      } catch (err) {
        if (cancelled) return
        setError(err.data?.message || "No se pudieron cargar los datos del dashboard")
      }

      if (!cancelled) {
        setLoading(false)
      }
    }

    fetchAllData()

    return () => {
      cancelled = true
    }
  }, [token])

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: C.textMuted }}>
        <p style={{ fontSize: 14 }}>Cargando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: 420 }}>
        <ErrorBanner message={error} />
      </div>
    )
  }

  if (!summary) {
    return <div style={{ color: C.textMuted }}>Sin datos disponibles</div>
  }

  return (
    <div style={{ color: C.text }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
          Resumen de tus finanzas personales
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}>
        <StatCard
          label="Total mes"
          value={summary.total_spent?.toFixed(2)}
          change={summary.vs_last_month?.percentage_diff}
          isPositive={summary.vs_last_month?.percentage_diff > 0}
        />
        
        <StatCard
          label="Nº gastos"
          value={summary.total_expenses}
          unit=""
          change={null}
        />
        
        <StatCard
          label="Media/día"
          value={summary.avg_per_day?.toFixed(2)}
          change={null}
        />
        
        {forecast && (
          <StatCard
            label="Proyección"
            value={forecast.projected_total?.toFixed(2)}
            change={forecast.vs_last_month}
            isPositive={forecast.vs_last_month > 0}
          />
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}>
        {trends && (
          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 16,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}>
              Evolución 6 meses
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends}>
                <CartesianGrid stroke={C.border} strokeDasharray="5 5" />
                <XAxis 
                  dataKey="month" 
                  stroke={C.textMuted}
                  style={{ fontSize: 11 }}
                />
                <YAxis 
                  stroke={C.textMuted}
                  style={{ fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    color: C.text,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={C.gold}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {byCategory && (
          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 16,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}>
              Gastos por categoría
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {byCategory.slice(0, 5).map((cat, idx) => (
                <div key={idx}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                    fontSize: 12,
                  }}>
                    <span style={{ color: C.text }}>{cat.category_name}</span>
                    <span style={{ color: C.textMuted }}>
                      €{cat.total?.toFixed(2)} ({cat.percentage_of_total?.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{
                    height: 6,
                    background: C.bgInput,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      background: [C.gold, C.success, C.accent, "#3B82F6", "#8B5CF6"][idx % 5],
                      width: `${cat.percentage_of_total}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


import { useState, useCallback, createContext, useContext } from "react"

// ─────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────
const API_BASE = "http://localhost:8000/api"

// ─────────────────────────────────────────────
// API CLIENT
// Centraliza todas las peticiones al backend.
// Lanza errores con {status, data} para manejarlos en los componentes.
// ─────────────────────────────────────────────
export const api = {
  async request(url, options = {}, token = null) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${url}`, { ...options, headers })
    const data = await res.json()
    if (!res.ok) throw { status: res.status, data }
    return data
  },

  // Auth
  register: (body) =>
    api.request("/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    api.request("/login", { method: "POST", body: JSON.stringify(body) }),
  logout: (token) =>
    api.request("/logout", { method: "POST" }, token),

  // Gastos
  getExpenses: (token) => api.request("/expenses", {}, token),
  createExpense: (body, token) =>
    api.request("/expenses", { method: "POST", body: JSON.stringify(body) }, token),
  updateExpense: (id, body, token) =>
    api.request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),
  deleteExpense: (id, token) =>
    api.request(`/expenses/${id}`, { method: "DELETE" }, token),

  // Categorías
  getCategories: (token) => api.request("/categories", {}, token),
  createCategory: (body, token) =>
    api.request("/categories", { method: "POST", body: JSON.stringify(body) }, token),
  deleteCategory: (id, token) =>
    api.request(`/categories/${id}`, { method: "DELETE" }, token),

  // Estadísticas
  getSummary: (token) => api.request("/statistics/summary", {}, token),
  getByCategory: (token, month, year) =>
    api.request(`/statistics/by-category?month=${month}&year=${year}`, {}, token),
  getTrends: (token, months = 6) =>
    api.request(`/statistics/trends?months=${months}`, {}, token),
  getForecast: (token) => api.request("/statistics/forecast", {}, token),
}

// ─────────────────────────────────────────────
// CONTEXTO DE AUTENTICACIÓN
// Comparte el token y usuario en toda la app.
// ─────────────────────────────────────────────
const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// Paleta y estilos centralizados.
// Cambia aquí para afectar toda la app.
// ─────────────────────────────────────────────
const C = {
  bg:        "#09090F",
  bgCard:    "#111118",
  bgInput:   "#0D0D14",
  border:    "#1E1E2E",
  borderHover: "#2A2A3E",
  accent:    "#6C63FF",
  accentDim: "#6C63FF22",
  accentHover: "#7B74FF",
  gold:      "#F5A623",
  goldDim:   "#F5A62322",
  text:      "#E8E8F0",
  textMuted: "#6B6B80",
  textDim:   "#3A3A50",
  success:   "#10B981",
  danger:    "#EF4444",
  warning:   "#F5A623",
}

// ─────────────────────────────────────────────
// COMPONENTES REUTILIZABLES
// ─────────────────────────────────────────────

/** Input con label y manejo de foco/blur visual */
function Field({ label, type = "text", value, onChange, placeholder, required, min, minLength, autoComplete }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        color: C.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: 8,
      }}>
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
        onChange={e => onChange(e.target.value)}
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

/** Botón primario con estado de carga */
function PrimaryButton({ children, onClick, loading, type = "button", style = {} }) {
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
      onMouseEnter={e => { if (!loading) e.currentTarget.style.background = C.accentHover }}
      onMouseLeave={e => { if (!loading) e.currentTarget.style.background = C.accent }}
      onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)" }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)" }}
    >
      {loading ? "Cargando…" : children}
    </button>
  )
}

/** Banner de error */
function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{
      background: "#2D1B1B",
      border: `1px solid #7F1D1D`,
      borderRadius: 8,
      padding: "10px 14px",
      color: "#FCA5A5",
      fontSize: 13,
      marginBottom: 16,
    }}>
      {message}
    </div>
  )
}

// ─────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────
function Logo({ size = 36 }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: `linear-gradient(135deg, ${C.accent}, #A78BFF)`,
      borderRadius: size * 0.28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────
// PANTALLA DE LOGIN
// ─────────────────────────────────────────────
function LoginScreen({ onAuth, onGoRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await api.login({ email, password })
      onAuth(res.token, res.user)
    } catch (err) {
      setError(err.data?.message || "Credenciales incorrectas")
    }
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Accede a tu panel financiero"
    >
      <form onSubmit={handleSubmit}>
        <ErrorBanner message={error} />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="tu@email.com"
          required
          autoComplete="email"
        />
        <Field
          label="Contraseña"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        <PrimaryButton type="submit" loading={loading}>
          Iniciar sesión
        </PrimaryButton>
      </form>

      <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13, marginTop: 24 }}>
        ¿No tienes cuenta?{" "}
        <button
          onClick={onGoRegister}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
            padding: 0,
          }}
        >
          Regístrate gratis
        </button>
      </p>
    </AuthLayout>
  )
}

// ─────────────────────────────────────────────
// PANTALLA DE REGISTRO
// ─────────────────────────────────────────────
function RegisterScreen({ onAuth, onGoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      setError("Las contraseñas no coinciden")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await api.register(form)
      onAuth(res.token, res.user)
    } catch (err) {
      const errs = err.data?.errors
      setError(errs ? Object.values(errs).flat().join(", ") : err.data?.message || "Error al registrarse")
    }
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Empieza a controlar tus finanzas hoy"
    >
      <form onSubmit={handleSubmit}>
        <ErrorBanner message={error} />
        <Field label="Nombre" value={form.name} onChange={set("name")} placeholder="Tu nombre" required autoComplete="name" />
        <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" required autoComplete="email" />
        <Field label="Contraseña" type="password" value={form.password} onChange={set("password")} placeholder="Mínimo 8 caracteres" required minLength={8} autoComplete="new-password" />
        <Field label="Confirmar contraseña" type="password" value={form.password_confirmation} onChange={set("password_confirmation")} placeholder="Repite la contraseña" required autoComplete="new-password" />
        <PrimaryButton type="submit" loading={loading}>
          Crear cuenta
        </PrimaryButton>
      </form>

      <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13, marginTop: 24 }}>
        ¿Ya tienes cuenta?{" "}
        <button
          onClick={onGoLogin}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
            padding: 0,
          }}
        >
          Inicia sesión
        </button>
      </p>
    </AuthLayout>
  )
}

// ─────────────────────────────────────────────
// LAYOUT DE AUTENTICACIÓN
// Envuelve Login y Register con el diseño compartido
// ─────────────────────────────────────────────
function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
        {/* Orbe superior izquierda */}
        <div style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)`,
        }} />
        {/* Orbe inferior derecha */}
        <div style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold}12 0%, transparent 70%)`,
        }} />
        {/* Grid sutil */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border}33 1px, transparent 1px), linear-gradient(90deg, ${C.border}33 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.3,
        }} />
      </div>

      {/* Tarjeta principal */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "10px 18px",
            }}>
              <Logo size={32} />
              <span style={{ fontSize: 18, fontWeight: 800, color: C.text, letterSpacing: "-0.5px" }}>
                FinanceControl
              </span>
            </div>
          </div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: C.text,
            margin: "0 0 8px",
            letterSpacing: "-0.5px",
          }}>
            {title}
          </h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* Formulario */}
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 32,
          boxShadow: `0 24px 64px #00000040`,
        }}>
          {children}
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          color: C.textDim,
          fontSize: 12,
          marginTop: 24,
        }}>
          Conectando con{" "}
          <code style={{ color: C.textMuted, fontSize: 11 }}>{API_BASE}</code>
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// ICONOS SVG (inline, sin dependencias)
// ─────────────────────────────────────────────
const Icons = {
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  expenses: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  categories: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  logout: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  chevron: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
}

// ─────────────────────────────────────────────
// ELEMENTO DE NAVEGACIÓN
// ─────────────────────────────────────────────
function NavItem({ icon, label, active, onClick, badge }) {
  const [hovered, setHovered] = useState(false)
  const isActive = active
  const isHighlighted = isActive || hovered

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
        background: isActive
          ? `${C.accent}18`
          : hovered
          ? `${C.border}80`
          : "transparent",
        color: isActive ? C.accent : hovered ? C.text : C.textMuted,
        fontFamily: "inherit",
        marginBottom: 2,
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, flex: 1 }}>
        {label}
      </span>
      {badge != null && (
        <span style={{
          background: C.accentDim,
          color: C.accent,
          borderRadius: 20,
          padding: "1px 7px",
          fontSize: 11,
          fontWeight: 700,
        }}>
          {badge}
        </span>
      )}
      {isActive && (
        <span style={{ lineHeight: 0, opacity: 0.5 }}>{Icons.chevron}</span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout, expensesCount, categoriesCount }) {
  const [loggingOut, setLoggingOut] = useState(false)
  const { token } = useAuth()

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await api.logout(token)
    } catch (_) {}
    onLogout()
  }

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "FC"

  return (
    <aside style={{
      width: 230,
      background: C.bgCard,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 16px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <Logo size={34} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.3px" }}>
            FinanceControl
          </p>
          <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>
            Panel personal
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>
        <p style={{
          fontSize: 9,
          fontWeight: 700,
          color: C.textDim,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          padding: "0 10px",
          margin: "0 0 8px",
        }}>
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

      {/* Usuario + logout */}
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
        {/* Avatar del usuario */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: `${C.border}50`,
          borderRadius: 10,
          marginBottom: 10,
        }}>
          <div style={{
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
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.text,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user?.name || "Usuario"}
            </p>
            <p style={{
              fontSize: 10,
              color: C.textMuted,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Botón logout */}
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
          onMouseEnter={e => {
            e.currentTarget.style.background = "#2D1B1B"
            e.currentTarget.style.color = "#FCA5A5"
            e.currentTarget.style.borderColor = "#7F1D1D"
          }}
          onMouseLeave={e => {
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

// ─────────────────────────────────────────────
// PLACEHOLDER para páginas pendientes (Partes 2-4)
// ─────────────────────────────────────────────
function ComingSoon({ pageName }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
      color: C.textMuted,
    }}>
      <div style={{
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
      }}>
        🚧
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>
        {pageName}
      </p>
      <p style={{ fontSize: 13, margin: 0 }}>
        Esta sección llegará en la siguiente parte
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// SHELL PRINCIPAL (app autenticada)
// Aquí se integrarán las páginas de las partes 2, 3 y 4
// ─────────────────────────────────────────────
function AppShell({ user, onLogout }) {
  const [page, setPage] = useState("dashboard")

  // Estos counts se actualizarán cuando integremos las páginas reales
  const expensesCount = null
  const categoriesCount = null

  function renderPage() {
    switch (page) {
      case "dashboard":   return <ComingSoon pageName="Dashboard" />
      case "expenses":    return <ComingSoon pageName="Gastos" />
      case "categories":  return <ComingSoon pageName="Categorías" />
      default:            return <ComingSoon pageName="Dashboard" />
    }
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: C.text,
    }}>
      {/* Scrollbar global */}
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

      {/* Área de contenido principal */}
      <main style={{ flex: 1, padding: "44px 48px", overflowY: "auto" }}>
        {renderPage()}
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────
// COMPONENTE RAÍZ — punto de entrada
// ─────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [authView, setAuthView] = useState("login") // "login" | "register"

  function handleAuth(t, u) {
    setToken(t)
    setUser(u)
  }

  function handleLogout() {
    setToken(null)
    setUser(null)
    setAuthView("login")
  }

  // Sin sesión → pantallas de auth
  if (!token) {
    return authView === "login" ? (
      <LoginScreen
        onAuth={handleAuth}
        onGoRegister={() => setAuthView("register")}
      />
    ) : (
      <RegisterScreen
        onAuth={handleAuth}
        onGoLogin={() => setAuthView("login")}
      />
    )
  }

  // Con sesión → shell de la app
  return (
    <AuthContext.Provider value={{ token, user }}>
      <AppShell user={user} onLogout={handleLogout} />
    </AuthContext.Provider>
  )
}
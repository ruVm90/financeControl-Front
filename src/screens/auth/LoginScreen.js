import { useState } from "react"
import { api } from "../../lib/api"
import { C } from "../../theme/tokens"
import AuthLayout from "../../components/layout/AuthLayout"
import ErrorBanner from "../../components/ui/ErrorBanner"
import Field from "../../components/ui/Field"
import PrimaryButton from "../../components/ui/PrimaryButton"

export default function LoginScreen({ onAuth, onGoRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.login({ email, password })
      onAuth(response.token, response.user)
    } catch (err) {
      setError(err.data?.message || "Credenciales incorrectas")
    }

    setLoading(false)
  }

  return (
    <AuthLayout title="Bienvenido de nuevo" subtitle="Accede a tu panel financiero">
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
          type="button"
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

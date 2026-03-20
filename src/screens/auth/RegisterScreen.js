import { useState } from "react"
import { api } from "../../lib/api"
import { C } from "../../theme/tokens"
import AuthLayout from "../../components/layout/AuthLayout"
import ErrorBanner from "../../components/ui/ErrorBanner"
import Field from "../../components/ui/Field"
import PrimaryButton from "../../components/ui/PrimaryButton"

export default function RegisterScreen({ onAuth, onGoLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const setField = (field) => (value) => setForm((current) => ({ ...current, [field]: value }))

  async function handleSubmit(e) {
    e.preventDefault()

    if (form.password !== form.password_confirmation) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await api.register(form)
      onAuth(response.token, response.user)
    } catch (err) {
      const errors = err.data?.errors
      setError(errors ? Object.values(errors).flat().join(", ") : err.data?.message || "Error al registrarse")
    }

    setLoading(false)
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Empieza a controlar tus finanzas hoy">
      <form onSubmit={handleSubmit}>
        <ErrorBanner message={error} />
        <Field label="Nombre" value={form.name} onChange={setField("name")} placeholder="Tu nombre" required autoComplete="name" />
        <Field label="Email" type="email" value={form.email} onChange={setField("email")} placeholder="tu@email.com" required autoComplete="email" />
        <Field label="Contraseña" type="password" value={form.password} onChange={setField("password")} placeholder="Mínimo 8 caracteres" required minLength={8} autoComplete="new-password" />
        <Field label="Confirmar contraseña" type="password" value={form.password_confirmation} onChange={setField("password_confirmation")} placeholder="Repite la contraseña" required autoComplete="new-password" />
        <PrimaryButton type="submit" loading={loading}>
          Crear cuenta
        </PrimaryButton>
      </form>

      <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13, marginTop: 24 }}>
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
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

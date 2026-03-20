import { useState } from "react"
import { useAuth } from "../context/auth"
import { api } from "../lib/api"
import { C } from "../theme/tokens"
import ErrorBanner from "./ui/ErrorBanner"
import Field from "./ui/Field"
import PrimaryButton from "./ui/PrimaryButton"

const cardStyle = {
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 24,
}

function getErrorMessage(err, fallback) {
  const errors = err?.data?.errors
  if (errors) return Object.values(errors).flat().join(", ")
  return err?.data?.message || fallback
}

export default function CategoriesPage({ categories, loading, onSaved, onDeleted }) {
  const { token } = useAuth()
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitLoading(true)
    setError("")

    try {
      await api.createCategory({ name }, token)
      setName("")
      await onSaved()
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear la categoría"))
    }

    setSubmitLoading(false)
  }

  async function handleDelete(categoryId) {
    setDeletingId(categoryId)
    setError("")

    try {
      await api.deleteCategory(categoryId, token)
      await onDeleted()
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo borrar la categoría"))
    }

    setDeletingId(null)
  }

  return (
    <div style={{ color: C.text }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Categorías
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
          Organiza tus gastos en categorías reutilizables.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 420px) 1fr", gap: 20, alignItems: "start" }}>
        <section style={cardStyle}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
            Nueva categoría
          </p>
          <form onSubmit={handleSubmit}>
            <ErrorBanner message={error} />
            <Field
              label="Nombre"
              value={name}
              onChange={setName}
              placeholder="Ej. Alimentación"
              required
            />
            <PrimaryButton type="submit" loading={submitLoading}>
              Crear categoría
            </PrimaryButton>
          </form>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
              Categorías creadas
            </p>
            <span style={{ fontSize: 12, color: C.textMuted }}>{categories.length} total</span>
          </div>

          {loading ? (
            <p style={{ margin: 0, color: C.textMuted }}>Cargando categorías...</p>
          ) : categories.length === 0 ? (
            <p style={{ margin: 0, color: C.textMuted }}>Todavía no has creado ninguna categoría.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {categories.map((category) => (
                <article
                  key={category.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    background: C.bgInput,
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: C.text }}>
                      {category.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
                      ID #{category.id}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={deletingId === category.id}
                    onClick={() => handleDelete(category.id)}
                    style={{
                      border: `1px solid #7F1D1D`,
                      background: "transparent",
                      color: "#FCA5A5",
                      borderRadius: 10,
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: deletingId === category.id ? "wait" : "pointer",
                    }}
                  >
                    {deletingId === category.id ? "Borrando…" : "Borrar"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

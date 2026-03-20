import { useMemo, useState } from "react"
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

function getInitialForm() {
  return {
    title: "",
    amount: "",
    category_id: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  }
}

function getExpenseCategoryName(expense, categoriesById) {
  return expense.category?.name || expense.category_name || categoriesById[expense.category_id]?.name || "Sin categoría"
}

function getExpenseNote(expense) {
  return expense.note || expense.description || expense.concept || ""
}

function getExpenseTitle(expense) {
  return expense.title || expense.name || expense.concept || "Gasto sin título"
}

export default function ExpensesPage({
  expenses,
  categories,
  loading,
  onSaved,
  onDeleted,
  onGoToCategories,
}) {
  const { token } = useAuth()
  const [form, setForm] = useState(getInitialForm())
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const hasCategories = categories.length > 0
  const categoriesById = useMemo(
    () =>
      categories.reduce((acc, category) => {
        acc[category.id] = category
        return acc
      }, {}),
    [categories]
  )

  const categoryOptions = [
    { value: "", label: hasCategories ? "Selecciona una categoría" : "Primero crea una categoría", disabled: true },
    ...categories.map((category) => ({ value: String(category.id), label: category.name })),
  ]

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function resetForm() {
    setForm(getInitialForm())
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!hasCategories) return

    setSubmitLoading(true)
    setError("")

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      category_id: Number(form.category_id),
      date: form.date,
      note: form.note,
    }

    try {
      if (editingId) {
        await api.updateExpense(editingId, payload, token)
      } else {
        await api.createExpense(payload, token)
      }
      resetForm()
      await onSaved()
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo guardar el gasto"))
    }

    setSubmitLoading(false)
  }

  function startEdit(expense) {
    setEditingId(expense.id)
    setError("")
    setForm({
      title: expense.title || expense.name || expense.concept || "",
      amount: String(expense.amount ?? expense.total ?? ""),
      category_id: String(expense.category_id ?? expense.category?.id ?? ""),
      date: expense.date ? String(expense.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
      note: getExpenseNote(expense),
    })
  }

  async function handleDelete(expenseId) {
    setDeletingId(expenseId)
    setError("")

    try {
      await api.deleteExpense(expenseId, token)
      if (editingId === expenseId) {
        resetForm()
      }
      await onDeleted()
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo borrar el gasto"))
    }

    setDeletingId(null)
  }

  return (
    <div style={{ color: C.text }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Gastos
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
          Registra y mantiene tus gastos vinculados a una categoría.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 420px) 1fr", gap: 20, alignItems: "start" }}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
              {editingId ? "Editar gasto" : "Nuevo gasto"}
            </p>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.textMuted,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          {!hasCategories && (
            <div
              style={{
                marginBottom: 16,
                padding: "12px 14px",
                borderRadius: 12,
                border: `1px solid ${C.warning}55`,
                background: C.goldDim,
              }}
            >
              <p style={{ margin: "0 0 8px", color: C.text, fontSize: 13 }}>
                Necesitas al menos una categoría antes de crear gastos.
              </p>
              <button
                type="button"
                onClick={onGoToCategories}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.gold,
                  padding: 0,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Ir a categorías
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <ErrorBanner message={error} />
            <Field
              label="Título"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              placeholder="Ej. Compra semanal"
              required
              disabled={!hasCategories}
            />
            <Field
              label="Importe"
              type="number"
              value={form.amount}
              onChange={(value) => updateField("amount", value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              disabled={!hasCategories}
            />
            <Field
              label="Categoría"
              as="select"
              value={form.category_id}
              onChange={(value) => updateField("category_id", value)}
              options={categoryOptions}
              required
              disabled={!hasCategories}
            />
            <Field
              label="Fecha"
              type="date"
              value={form.date}
              onChange={(value) => updateField("date", value)}
              required
              disabled={!hasCategories}
            />
            <Field
              label="Nota"
              as="textarea"
              value={form.note}
              onChange={(value) => updateField("note", value)}
              placeholder="Añade contexto si lo necesitas"
              rows={4}
              disabled={!hasCategories}
            />
            <PrimaryButton type="submit" loading={submitLoading} style={{ marginBottom: editingId ? 12 : 0 }}>
              {editingId ? "Guardar cambios" : "Crear gasto"}
            </PrimaryButton>
          </form>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
              Historial de gastos
            </p>
            <span style={{ fontSize: 12, color: C.textMuted }}>{expenses.length} total</span>
          </div>

          {loading ? (
            <p style={{ margin: 0, color: C.textMuted }}>Cargando gastos...</p>
          ) : expenses.length === 0 ? (
            <p style={{ margin: 0, color: C.textMuted }}>Todavía no has registrado ningún gasto.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {expenses.map((expense) => (
                <article
                  key={expense.id}
                  style={{
                    border: `1px solid ${C.border}`,
                    background: C.bgInput,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.text }}>
                        {getExpenseTitle(expense)}
                      </p>
                      <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: C.accent }}>
                        €{Number(expense.amount ?? expense.total ?? 0).toFixed(2)}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
                        {getExpenseCategoryName(expense, categoriesById)} · {expense.date ? String(expense.date).slice(0, 10) : "Sin fecha"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => startEdit(expense)}
                        style={{
                          border: `1px solid ${C.border}`,
                          background: "transparent",
                          color: C.text,
                          borderRadius: 10,
                          padding: "8px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === expense.id}
                        onClick={() => handleDelete(expense.id)}
                        style={{
                          border: `1px solid #7F1D1D`,
                          background: "transparent",
                          color: "#FCA5A5",
                          borderRadius: 10,
                          padding: "8px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: deletingId === expense.id ? "wait" : "pointer",
                        }}
                      >
                        {deletingId === expense.id ? "Borrando…" : "Borrar"}
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: 13 }}>
                    {getExpenseNote(expense) || "Sin nota"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

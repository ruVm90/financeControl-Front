const API_BASE = "http://localhost:8000/api"

async function request(url, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers })
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data?.message || "API request failed")
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  request,
  API_BASE,
  register: (body) =>
    request("/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/login", { method: "POST", body: JSON.stringify(body) }),
  logout: (token) =>
    request("/logout", { method: "POST" }, token),
  getExpenses: (token) => request("/expenses", {}, token),
  createExpense: (body, token) =>
    request("/expenses", { method: "POST", body: JSON.stringify(body) }, token),
  updateExpense: (id, body, token) =>
    request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),
  deleteExpense: (id, token) =>
    request(`/expenses/${id}`, { method: "DELETE" }, token),
  getCategories: (token) => request("/categories", {}, token),
  createCategory: (body, token) =>
    request("/categories", { method: "POST", body: JSON.stringify(body) }, token),
  deleteCategory: (id, token) =>
    request(`/categories/${id}`, { method: "DELETE" }, token),
  getSummary: (token) => request("/statistics/summary", {}, token),
  getByCategory: (token, month, year) =>
    request(`/statistics/by-category?month=${month}&year=${year}`, {}, token),
  getTrends: (token, months = 6) =>
    request(`/statistics/trends?months=${months}`, {}, token),
  getForecast: (token) => request("/statistics/forecast", {}, token),
}

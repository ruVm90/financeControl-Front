import { useState } from "react"
import { AuthContext } from "./context/auth"
import AppShell from "./components/layout/AppShell"
import LoginScreen from "./screens/auth/LoginScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"

export default function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [authView, setAuthView] = useState("login")

  function handleAuth(nextToken, nextUser) {
    setToken(nextToken)
    setUser(nextUser)
  }

  function handleLogout() {
    setToken(null)
    setUser(null)
    setAuthView("login")
  }

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

  return (
    <AuthContext.Provider value={{ token, user }}>
      <AppShell user={user} onLogout={handleLogout} />
    </AuthContext.Provider>
  )
}

export default function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div
      style={{
        background: "#2D1B1B",
        border: "1px solid #7F1D1D",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#FCA5A5",
        fontSize: 13,
        marginBottom: 16,
      }}
    >
      {message}
    </div>
  )
}

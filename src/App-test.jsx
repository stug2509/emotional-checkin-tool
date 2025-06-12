// Minimal test version to check if Vite/React works
function App() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{color: '#3B82F6', marginBottom: '20px'}}>
        🎉 Emotional Check-In Tool
      </h1>
      <p style={{color: '#666', marginBottom: '30px'}}>
        Development server is working!
      </p>
      <div style={{
        padding: '15px 30px',
        backgroundColor: '#3B82F6',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Test Button
      </div>
      <p style={{color: '#999', marginTop: '20px', fontSize: '14px'}}>
        Environment: {import.meta.env.MODE}
      </p>
    </div>
  )
}

export default App
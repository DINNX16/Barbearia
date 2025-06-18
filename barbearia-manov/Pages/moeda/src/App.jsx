// src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(false);
      window.location.href = "http://127.0.0.1:5500/barbearia-manov/Pages/main.html";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return null; // Opcional: poderia mostrar um redirect loader ou algo assim
  }

  return (
    <div className="container">
      <img
        src="https://raw.githubusercontent.com/DINNX16/Barbearia/prototipo-feed/barbearia-manov/assets/moedamoeda.png"
        alt="Moeda girando"
        id="minha-moeda"
        className="girar-infinito"
      />
      <div id="mensagem-loading">Loading...</div>
    </div>
  );
}

export default App;

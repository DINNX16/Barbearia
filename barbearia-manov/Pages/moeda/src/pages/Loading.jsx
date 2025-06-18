import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loading.css"; // se quiser estilizar separado

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/main"); // redireciona após 5 segundos
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <img
        src="https://raw.githubusercontent.com/DINNX16/Barbearia/prototipo-feed/barbearia-manov/assets/moedamoeda.png"
        alt="Moeda girando"
        style={styles.moeda}
      />
      <p style={styles.loadingText}>Loading...</p>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  moeda: {
    width: "150px",
    height: "150px",
    animation: "girar 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "1.5em",
    letterSpacing: "2px",
  },
};

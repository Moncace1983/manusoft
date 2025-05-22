import { useEffect, useState } from "react";
import styles from "./informes.module.css";
import SidebarMenu from "../../components/SidebarMenu";
import html2pdf from "html2pdf.js";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Informes = () => {
  const [tipoInforme, setTipoInforme] = useState("inventario");
  const [datos, setDatos] = useState([]);
  const { logOut } = useAuth(); // Obtiene el token del contexto de autenticación
  const { username } = useAuth(); // Obtiene el nombre de usuario del contexto de autenticación
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut(); // Llama a la función logOut del contexto
    navigate("/"); // Redirige al usuario a la página de inicio de sesión
  };

  useEffect(() => {
    fetch(`http://localhost:3002/api/informes/${tipoInforme}`)
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch((error) =>
        console.error(`Error al obtener informe de ${tipoInforme}:`, error)
      );
  }, [tipoInforme]);

  const imprimirInforme = () => {
    const ventana = window.open("", "_blank");
    if (!ventana) {
      alert("No se pudo abrir la ventana de impresión");
      return;
    }

    const doc = ventana.document;
    doc.open();

    doc.write(`
      <html>
        <head>
          <title>Informe de ${tipoInforme}</title>
          <style>
            table { border-collapse: collapse; width: 100%; margin-top: 20px }
            th, td { border: 1px solid #333; padding: 8px; text-align: left }
            h2 { text-align: center }
          </style>
        </head>
        <body>
          <h2>Informe de ${tipoInforme.toUpperCase()}</h2>
          ${generarTablaHTML()}
        </body>
      </html>
    `);

    doc.close();
    ventana.onload = () => ventana.print();
  };

  const generarTablaHTML = () => {
    if (datos.length === 0) return "<p>No hay datos disponibles.</p>";

    const columnas = Object.keys(datos[0]);
    const encabezado = columnas.map((col) => `<th>${col}</th>`).join("");

    const filas = datos
      .map(
        (fila) =>
          `<tr>${columnas.map((col) => `<td>${fila[col]}</td>`).join("")}</tr>`
      )
      .join("");

    return `<table><thead><tr>${encabezado}</tr></thead><tbody>${filas}</tbody></table>`;
  };

  const descargarPDF = () => {
    const tablaHTML = generarTablaHTML();

    const contenido = `
    <div>
      <h2>Informe de ${tipoInforme.toUpperCase()}</h2>
      ${tablaHTML}
    </div>
  `;

    const opciones = {
      margin: 0.5,
      filename: `informe_${tipoInforme}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(contenido).set(opciones).save();
  };

  return (
    <>
      <SidebarMenu username={username} onLogout={handleLogOut} />
      <div className={styles.informesContainer}>
        <h2>Módulo de Informes</h2>

        <div className={styles.botonesInforme}>
          <button
            className={styles.boton}
            onClick={() => setTipoInforme("inventario")}
          >
            Inventario
          </button>
          <button
            className={styles.boton}
            onClick={() => setTipoInforme("entradas")}
          >
            Entradas
          </button>
          <button
            className={styles.boton}
            onClick={() => setTipoInforme("salidas")}
          >
            Salidas
          </button>
        </div>

        <div className={styles.resultadoTabla}>
          <h3>Informe de {tipoInforme}</h3>
          {datos.length > 0 ? (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  {Object.keys(datos[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((valor, i) => (
                      <td key={i}>{valor}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </div>

        {datos.length > 0 && (
          <>
            <button onClick={imprimirInforme} className={styles.botonImprimir}>
              Imprimir informe
            </button>
            <button onClick={descargarPDF} className={styles.botonPDF}>
              Descargar PDF
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Informes;

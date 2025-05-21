import { useState, useEffect } from "react";
import styles from "./salida.module.css";
import SidebarMenu from "../../components/SidebarMenu.jsx";

const SalidaProducto = () => {
  const [productos, setProductos] = useState([]);
  const [salidas, setSalidas] = useState([{ productoId: "", cantidad: "" }]);
  const [resumenSalida, setResumenSalida] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3002/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando inventario:", err));
  }, []);

  const handleAgregarFila = () => {
    setSalidas([...salidas, { productoId: "", cantidad: "" }]);
  };

  const handleEliminarFila = (index) => {
    const nuevasSalidas = [...salidas];
    nuevasSalidas.splice(index, 1);
    setSalidas(nuevasSalidas);
  };

  const handleCambio = (index, field, value) => {
    const nuevasSalidas = [...salidas];

    if (field === "productoId") {
      const producto = productos.find(
        (p) =>
          p.nombre.toLowerCase() === value.toLowerCase() ||
          String(p.id) === value
      );
      nuevasSalidas[index].productoId = producto ? producto.id : "";
    } else {
      nuevasSalidas[index][field] = value;
    }

    setSalidas(nuevasSalidas);
  };

  const handleConfirmarSalida = async () => {
    // Validación previa a la solicitud
    for (let i = 0; i < salidas.length; i++) {
      const salida = salidas[i];
      const producto = productos.find((p) => p.id === salida.productoId);

      if (!producto) {
        alert(`El producto en la fila ${i + 1} no existe.`);
        return;
      }

      const cantidadSolicitada = parseInt(salida.cantidad, 10);
      const stockDisponible = parseInt(producto.cantidad, 10);

      if (isNaN(cantidadSolicitada) || cantidadSolicitada <= 0) {
        alert(`La cantidad en la fila ${i + 1} no es válida.`);
        return;
      }

      if (cantidadSolicitada > stockDisponible) {
        alert(
          `No hay suficiente stock para el producto "${producto.nombre}". Stock disponible: ${stockDisponible}, solicitado: ${cantidadSolicitada}`
        );
        return;
      }
    }

    // Si pasa la validación, continúa con la solicitud
    try {
      const response = await fetch("http://localhost:3002/api/salidas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ salidas }),
      });

      if (response.ok) {
        const data = await response.json();
        setResumenSalida(data);
        abrirDocumentoSalida(data);
        setSalidas([{ productoId: "", cantidad: "" }]);
        alert("Salida registrada correctamente");
      } else {
        const errorData = await response.json();
        console.error("Error al registrar la salida:", errorData);
        alert("Error al registrar salida");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red al registrar salida");
    }
  };

  const abrirDocumentoSalida = (data) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("No se pudo abrir la ventana de impresión");
      return;
    }

    const doc = printWindow.document;

    doc.open();

    const html = doc.createElement("html");
    const head = doc.createElement("head");
    const body = doc.createElement("body");

    const title = doc.createElement("title");
    title.innerText = "Documento de Salida Manusoft";
    head.appendChild(title);

    const styleLink = doc.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.type = "text/css";
    styleLink.href = "/salidaPrint.css";
    head.appendChild(styleLink);

    const heading = doc.createElement("h3");
    heading.innerText = "Documento de Salida Manusoft";
    body.appendChild(heading);

    const fecha = doc.createElement("p");
    fecha.innerText = `Fecha: ${new Date().toLocaleString()}`;
    body.appendChild(fecha);

    const table = doc.createElement("table");
    const thead = doc.createElement("thead");
    const headerRow = doc.createElement("tr");

    ["Producto", "Cantidad"].forEach((texto) => {
      const th = doc.createElement("th");
      th.innerText = texto;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = doc.createElement("tbody");

    data.productos.forEach((item) => {
      const row = doc.createElement("tr");

      const producto = productos.find((p) => p.id === item.productoId);

      const tdNombre = doc.createElement("td");
      tdNombre.innerText = producto ? producto.nombre : "Producto no encontrado";

      const tdCantidad = doc.createElement("td");
      tdCantidad.innerText = item.cantidad;

      row.appendChild(tdNombre);
      row.appendChild(tdCantidad);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    body.appendChild(table);

    html.appendChild(head);
    html.appendChild(body);
    doc.appendChild(html);

    doc.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <>
      <SidebarMenu />
      <div className={styles.salidaContainer}>
        <h2>Salida de Productos</h2>
        <table>
          <thead>
            <tr>
              <th>Producto (nombre o ID)</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {salidas.map((salida, index) => (
              <tr key={index}>
                <td>
                  <input
                    list="listaProductos"
                    value={
                      productos.find((p) => p.id === salida.productoId)?.nombre || ""
                    }
                    onChange={(e) =>
                      handleCambio(index, "productoId", e.target.value)
                    }
                    className={styles.inputProducto}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={salida.cantidad}
                    onChange={(e) =>
                      handleCambio(index, "cantidad", e.target.value)
                    }
                    className={styles.inputCantidad}
                  />
                </td>
                <td>
                  <button onClick={() => handleEliminarFila(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <datalist id="listaProductos">
          {productos.map((producto) => (
            <option
              key={producto.id}
              value={producto.nombre}
              label={`ID: ${producto.id}`}
            />
          ))}
        </datalist>

        <button onClick={handleAgregarFila}>Agregar Producto</button>
        <button onClick={handleConfirmarSalida} className={styles.btn_confirmar}>
          Confirmar Salida
        </button>
      </div>
    </>
  );
};

export default SalidaProducto;


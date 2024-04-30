import fs from "fs";
import { v4 as uuidv4 } from "uuid";

/* agregar gasto */
export async function agregarGasto(req, res) {
  try {
    const { roommate, descripcion, monto } = req.body;
    const gasto = { id: uuidv4(), roommate, descripcion, monto };
    const gastos = fs.readFileSync("gastos.json", "utf8");
    const data = await JSON.parse(gastos);
    const newGasto = data.gastos;
    newGasto.push(gasto);
    fs.writeFileSync("gastos.json", JSON.stringify(data));
    recalcularDeudas()
    console.log("Nuevo gasto añadido:", roommate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al agregar el gasto:", error);
    res.status(500).json({ error: "Error al agregar el gasto" });
  }
}

/* Get gastos  */
export async function getGastos(req, res) {
  try {
    const gastosData = fs.readFileSync("gastos.json", "utf8");
    const data = JSON.parse(gastosData);
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener datos de gastos:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
/* modificar el pago desde el json */
export async function updateGasto(req, res) {
  try {
    const { id } = req.query;
    const { roommate, descripcion, monto } = req.body;
    const gastosData = fs.readFileSync("gastos.json", "utf-8");
    const data = JSON.parse(gastosData);
    let { gastos } = data;
    gastos = gastos.map((gasto) => {
      if (gasto.id === id) {
        gasto.roommate = roommate;
        gasto.descripcion = descripcion;
        gasto.monto = monto;
      }
      return gasto;
    });
    data.gastos = gastos;
    fs.writeFileSync("gastos.json", JSON.stringify(data));
    recalcularDeudas()
    res.status(200).json({ message: "Gasto actualizado correctamente", data: data });
  } catch (error) {
    console.error("Error al modificar el gasto:", error);
    res.status(500).json({ error: "Error al modificar el gasto" });
  }
}


/* eliminar un pago especifico en el json  */
export async function deleteGasto(req, res) {
  try {
    const { id } = req.query;
    const gastosData = fs.readFileSync("gastos.json", "utf-8");
    const data = JSON.parse(gastosData);
    let { gastos } = data;
    const gastoIndex = gastos.findIndex((gasto) => gasto.id === id);
    if (gastoIndex !== -1) {
        gastos.splice(gastoIndex, 1);
        fs.writeFileSync("gastos.json", JSON.stringify(data));
        res.status(200).json({ message: "Gasto eliminado correctamente", data: data });
    } else {
        res.status(404).json({ error: "El gasto no se encontró" });
    }
    recalcularDeudas()
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error, no se pudo borrar el usuario" });
}
}

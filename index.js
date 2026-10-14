const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/parqueadero_el_aljibe")  .then(() => console.log("Conectado exitosamente a MongoDB"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

// Esquema y Modelo para la Sede El Aljibe
const parqueaderoSchema = new mongoose.Schema({
  ticket_id: { type: String, required: true, unique: true },
  vehiculo: {
    tipo: { type: String, required: true },
    placa: { type: String, required: true },
    marca: { type: String, required: true }
  },
  propietario: {
    codigo: { type: String, required: true },
    nombre: { type: String, required: true },
    programa: { type: String, required: true },
    rol: { type: String, required: true }
  },
  hora_ingreso: { type: Date, default: Date.now },
  hora_salida: { type: Date, default: null },
  estado: { type: String, enum: ['Activo', 'Finalizado'], default: 'Activo' },
  cascos_guardados: { type: Number, default: 0 }
});

const Ticket = mongoose.model('parqueadero_el_aljibe', parqueaderoSchema);

// ==========================================
// LAS 10 FUNCIONALIDADES (ENDPOINTS)
// ==========================================

// HU001: Registrar un nuevo usuario / propietario
app.post('/api/propietarios', async (req, res) => {
  try {
    const nuevoTicket = new Ticket(req.body);
    await nuevoTicket.save();
    res.status(201).json({ mensaje: "Usuario y registro creados con éxito", datos: nuevoTicket });
  } catch (error) {
    res.status(400).json({ error: "Datos inválidos", detalle: error.message });
  }
});

// HU002: Registrar ingreso de vehículo
app.post('/api/parqueadero/ingreso', async (req, res) => {
  try {
    const ingreso = new Ticket(req.body);
    await ingreso.save();
    res.status(201).json({ mensaje: "Ingreso registrado con éxito", ticket: ingreso });
  } catch (error) {
    res.status(400).json({ error: "Error al registrar ingreso", detalle: error.message });
  }
});

// HU003: Listar vehículos activos
app.get('/api/parqueadero/activos', async (req, res) => {
  try {
    const activos = await Ticket.find({ estado: 'Activo' });
    res.status(200).json(activos);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// HU004: Buscar vehículo por placa
app.get('/api/parqueadero/vehiculo/:placa', async (req, res) => {
  try {
    const vehiculo = await Ticket.findOne({ "vehiculo.placa": req.params.placa.toUpperCase() });
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });
    res.status(200).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

// HU005: Filtrar por programa académico
app.get('/api/parqueadero/programa/:programa', async (req, res) => {
  try {
    const filtrados = await Ticket.find({ "propietario.programa": req.params.programa });
    res.status(200).json(filtrados);
  } catch (error) {
    res.status(500).json({ error: "Error al filtrar" });
  }
});

// HU006: Registrar salida (Actualizar estado)
app.patch('/api/parqueadero/salida/:ticket_id', async (req, res) => {
  try {
    const salida = await Ticket.findOneAndUpdate(
      { ticket_id: req.params.ticket_id },
      { hora_salida: new Date(), estado: 'Finalizado' },
      { new: true }
    );
    if (!salida) return res.status(404).json({ error: "Ticket no encontrado" });
    res.status(200).json({ mensaje: "Salida registrada", ticket: salida });
  } catch (error) {
    res.status(400).json({ error: "Error al registrar salida" });
  }
});

// HU007: Consultar historial por código de propietario
app.get('/api/parqueadero/propietario/:codigo', async (req, res) => {
  try {
    const historial = await Ticket.find({ "propietario.codigo": req.params.codigo });
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar historial" });
  }
});

// HU008: Actualizar datos del ticket (Modificar)
app.put('/api/parqueadero/:ticket_id', async (req, res) => {
  try {
    const actualizado = await Ticket.findOneAndUpdate(
      { ticket_id: req.params.ticket_id },
      req.body,
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Ticket no encontrado" });
    res.status(200).json({ mensaje: "Ticket actualizado", ticket: actualizado });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar" });
  }
});

// HU009: Eliminar registro incorrecto
app.delete('/api/parqueadero/:ticket_id', async (req, res) => {
  try {
    const eliminado = await Ticket.findOneAndDelete({ ticket_id: req.params.ticket_id });
    if (!eliminado) return res.status(404).json({ error: "Ticket no encontrado" });
    res.status(200).json({ mensaje: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// HU010: Reporte estadístico por tipo de vehículo (Agregación)
app.get('/api/parqueadero/reportes/estadisticas', async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: "$vehiculo.tipo",
          total_registros: { $sum: 1 },
          cascos_totales: { $sum: "$cascos_guardados" }
        }
      }
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error al generar estadísticas" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
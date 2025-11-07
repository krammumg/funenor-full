import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import becadasRoutes from "./routes/becadasRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import seguimientoRoutes from "./routes/seguimientoRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === CONFIGURACIÓN PARA SERVIR EL FRONTEND ===

// Obtener la ruta absoluta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend (html, css, js, imágenes)
app.use(express.static(path.join(__dirname, "../public")));

// === RUTAS API ===
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin/becadas", becadasRoutes);
app.use("/api/admin/usuarios", usuariosRoutes);
app.use("/api/admin/seguimiento", seguimientoRoutes);

// --- Configuración PayPal ---
app.get("/api/config/paypal", (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// --- Rutas de retorno de pagos PayPal ---
app.get("/donations/success", (req, res) => {
  res.send("✅ Pago realizado con éxito. ¡Gracias por tu donación!");
});

app.get("/donations/cancel", (req, res) => {
  res.send("❌ Pago cancelado.");
});

// === FALLBACK: para que cualquier ruta no API devuelva index.html ===
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).send("Ruta API no encontrada");
  }
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// === INICIO DEL SERVIDOR ===
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});

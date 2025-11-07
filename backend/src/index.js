import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Importar rutas de la API
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import becadasRoutes from "./routes/becadasRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import seguimientoRoutes from "./routes/seguimientoRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// === Configuración de rutas API ===
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin/becadas", becadasRoutes);
app.use("/api/admin/usuarios", usuariosRoutes);
app.use("/api/admin/seguimiento", seguimientoRoutes);

// Configuración PayPal
app.get("/api/config/paypal", (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Rutas de retorno de pagos PayPal
app.get("/donations/success", (req, res) => {
  res.send("✅ Pago realizado con éxito. Gracias por tu donación!");
});

app.get("/donations/cancel", (req, res) => {
  res.send("❌ Pago cancelado.");
});

// === Configuración para servir el frontend ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend
// Ajusta la ruta según donde esté tu index.html y carpetas css/js/img
app.use(express.static(path.join(__dirname, ".."))); // si index.html está en la raíz

// Fallback: cualquier ruta que no sea API devuelve index.html
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // deja que Express maneje rutas API
  }
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});

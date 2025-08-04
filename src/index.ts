// =======================================================================
// ARCHIVO: index.ts (Archivo principal del Backend)
// DESCRIPCIÓN: ESTA ES LA CORRECCIÓN CLAVE. Se añade la importación y
//              el uso de las rutas para las reseñas (resenaRoutes), que
//              faltaban y causaban el error 404.
// =======================================================================
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/producto.routes';
import orderRoutes from './routes/order.routes';
import categoriaRoutes from './routes/categoria.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';
// --- INICIO DE LA CORRECCIÓN ---
import resenaRoutes from './routes/resena.routes'; // <-- 1. IMPORTAR LAS RUTAS
// --- FIN DE LA CORRECCIÓN ---

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: Missing environment variables.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a la base de datos MongoDB'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

app.use(cors());
app.use(express.json());

// Registramos las rutas en la aplicación
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
// --- INICIO DE LA CORRECCIÓN ---
app.use('/api/resenas', resenaRoutes); // <-- 2. USAR LAS RUTAS
// --- FIN DE LA CORRECCIÓN ---

app.get('/api', (req: Request, res: Response) => {
  res.send('¡API de MercadoLocal funcionando! 🚀');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '¡Algo salió mal en el servidor!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

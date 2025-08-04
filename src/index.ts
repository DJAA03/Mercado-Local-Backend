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
import resenaRoutes from './routes/resena.routes';

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

// --- INICIO DE LA CORRECCIÓN DE CORS ---
// Lista de orígenes permitidos
const allowedOrigins = [
  'https://mercadolocal-frontend.vercel.app', // Tu frontend en producción
  'http://localhost:5173'                     // Tu frontend en desarrollo local
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones sin origen (como las de Postman o apps móviles) o si el origen está en la lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// --- FIN DE LA CORRECCIÓN DE CORS ---

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resenas', resenaRoutes);

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

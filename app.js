require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require("./midleware/error");
const userRouter = require('./routes/userRoutes');
const doctorRouter = require('./routes/doctorRouters');
const appointmentRouter = require('./routes/appointmentRouter');
const router = require('./controllers/paymentController');

const app = express();

// CORS Middleware - Place it before routes
const corsOptions = {
    // local origin: 'http://localhost:5173'
    origin:'https://prescripto-client.vercel.app/', // Allow only this origin
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true, // Enable to allow cookies
};
app.use(cors(corsOptions));

// Parse incoming JSON data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Testing API
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
});

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/appointment",appointmentRouter);
app.use("/api/v1/payment",router)

// Unknown route handler
app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

// Error middleware
app.use(errorMiddleware);

module.exports = { app };

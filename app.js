
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// app.js mein top pe import add karo
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from 'swagger-jsdoc';

// import { swaggerOptions } from "./config/swaggerOptions.js";

dotenv.config()

import { connectDB } from './config/db.config.js';
import userRoutes from "./routes/user.routes.js"
import captainRoutes from "./routes/captain.routes.js";
import mapsRoutes from "./routes/maps.routes.js"
import rideRoutes from "./routes/rides.routes.js";

const app = express();

connectDB()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())

// Swagger options
// Swagger options
export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uber Clone API",
      version: "1.0.0",
      description: "API documentation for Uber Clone backend",
    },
    servers: [
      {
         url: "https://uber-clone-backend-zeiy.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI route add karo before other routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Uber backend API' });
});

// Going to implement our application api routes
app.use("/api/v1/users" , userRoutes);
app.use("/api/v1/captain" , captainRoutes);
app.use("/api/v1/maps" , mapsRoutes);
app.use("/api/v1/rides" , rideRoutes);




export default app;

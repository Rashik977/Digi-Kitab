import express from "express";
import config from "./config";
import helmet from "helmet";
import cors from "cors";

import { requestLogger } from "./Middleware/logger";
import router from "./Routes";
import { errorHandler } from "./Middleware/errorHandling";

import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swaggerConfig";

const app = express();
app.use(cors());

const port = config.port;

// Add security headers
app.use(helmet());

// Parse JSON
app.use(express.json());

// For logger
app.use(requestLogger);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Add routes
app.use(router);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

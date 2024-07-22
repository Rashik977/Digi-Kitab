import express from "express";
import config from "./config";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.use(cors());

const port = config.port;

// Add security headers
app.use(helmet());

// Parse JSON
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

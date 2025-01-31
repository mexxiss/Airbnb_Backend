import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { apiError } from "./utils/apiError.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json" assert { type: "json" };
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1", routes);

app.use((err, req, res, next) => {
  if (err instanceof apiError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { app };

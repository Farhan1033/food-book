import express from "express";
import { errorHandler } from "../../shared/middleware/errorHandler";

const app = express();

app.use(errorHandler);

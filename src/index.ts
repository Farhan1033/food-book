import express from "express";
import { errorHandler } from "../shared/middleware/errorHandler";
import router from "./router/router";

const app = express();

app.use(express.json());
app.use("/api/v1", router)

app.use(errorHandler);


app.listen(5000, () => {
    console.log("Terhubung")
})
import express from "express";
import { errorHandler } from "../shared/middleware/errorHandler";
import router from "./router/router";
import redis from "./infrastructure/redisClient";

const app = express();

app.use(express.json());
app.use("/api/v1", router)

app.use(errorHandler);

const PORT = 5000
app.listen(PORT, async () => {
    try {
        await redis.ping();
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Redis not connected", error);
    }
});
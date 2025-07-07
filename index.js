import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gptRoute from "./api/gpt.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/gpt", gptRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

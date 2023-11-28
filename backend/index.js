import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { authRouter } from "./routes/auth.js";
import { expensesRouter } from "./routes/expenses.js";
import { orderRouter } from "./routes/order.js";

dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT;

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
app.use("/", expensesRouter);
app.use("/", orderRouter);
app.use("/auth", authRouter);

app.listen(port, () => console.log(`listenin on port ${port}`));

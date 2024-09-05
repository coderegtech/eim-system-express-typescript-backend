import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import supplierRoutes from "./routes/supplier.routes";
import authRoutes from "./routes/user.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Builtin middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/suppliers", supplierRoutes);

app.listen(PORT, () => {
  console.log("Server running in port " + PORT);
});

import { Router } from "express";
import { addProduct, getAllProducts, getProduct, productsCount, removeProduct } from "../controller/product.controller";
import upload from "../middleware/fileUpload";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

router.post("/create", verifyJWT, upload.single("productImg"), addProduct);
router.get("/all", getAllProducts);
router.get("/search", getProduct);
router.get("/count", productsCount);
router.delete("/delete/:id", verifyJWT, removeProduct);

export default router;

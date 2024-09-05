import { Router } from "express";
import { createSupplier, getAllSuppliers } from "../controller/supplier.controller";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

router.post("/create", verifyJWT, createSupplier);
router.get("/all", getAllSuppliers);
// router.get("/search", getCategory);
// router.delete("/del/:id",verifyJWT, deleteCategory);

export default router;

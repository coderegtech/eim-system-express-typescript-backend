import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
} from "../controller/category.controller";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

router.post("/create", verifyJWT, createCategory);
router.get("/all", getAllCategories);
router.get("/search", getCategory);
router.delete("/del/:id",verifyJWT, deleteCategory);

export default router;

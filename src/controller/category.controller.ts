import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { Category } from "../types";


export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;
    // check if category exist
    const isCategoryExist = await prisma.categories.findUnique({
      where: { name },
    });
    if (isCategoryExist) {
      return res.status(409).send({ message: "Category already exist" });
    }

    const newCategory: Category = await prisma.categories.create({
      data: { name, description },
    });

    if (newCategory) {
      return res.status(201).send({ message: "Added category" });
    }
    next();
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories: Category[] = await prisma.categories.findMany();
    res.status(200).json(categories);
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const name: any = req.query.q;
    const category = await prisma.categories.findUnique({ where: { name } });

    if (!category) {
      return res.status(404).send({ message: "No category found" });
    }
    res.status(200).json([category]);
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const category = await prisma.categories.delete({
      where: { id: parseInt(id) },
    });
    if (category) {
      res.status(200).send({ message: "Category removed" });
    }
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

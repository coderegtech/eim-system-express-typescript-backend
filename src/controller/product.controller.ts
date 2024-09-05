import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import path from "path";
import prisma from "../prisma";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = req.body;
    const file = req.file;

    const product = await prisma.products.create({
      data: {
        productImg: file?.filename!,
        name: products.name,
        categoryId: Number(products.categoryId),
        price: Number(products.price),
        description: products.description,
        quantity: Number(products.quantity),
        supplierId: Number(products.supplierId),
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        supplier: {
          select: {
            supplierName: true,
            city: true,
            country: true,
          },
        },
      },
    });

    if (product) {
      return res
        .status(201)
        .send({ status: "success", message: "Product added", data: product });
    }

    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany();

    if (products) {
      return res.status(200).json(products);
    }
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const products = await prisma.products.findMany({
      where: { name },
    });

    if (products) {
      return res.status(200).json(products);
    }
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as any;

    const product = await prisma.products.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // remove the selected  product
    await prisma.products.delete({
      where: { id: product.id },
    });

    const productImgName = product.productImg;
    const filePath = path.join(
      __dirname,
      "../../uploads/productsImgs/",
      productImgName
    );
    // Delete the associated image file
    await fs.promises.unlink(filePath);

    return res.status(200).json(product);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const productsCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await prisma.products.count();
    return res.json(count);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

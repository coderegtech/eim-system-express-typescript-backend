import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";


export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      supplierName,
      contactName,
      phoneNumber,
      email,
      address,
      city,
      postalCode,
      country,
    } = req.body;

    const foundSupplier = await prisma.suppliers.findMany({
      where: {
        OR: [supplierName, contactName],
      },
    });

    if (foundSupplier) {
      return res.status(409).send({ message: "Supplier already exist" });
    }

    const supplier = await prisma.suppliers.create({
      data: {
        supplierName,
        contactName,
        phoneNumber,
        email,
        address,
        city,
        postalCode,
        country,
      },
    });

    if (supplier) {
      res.status(201).send({
        status: "success",
        message: "Supplier added",
        data: supplier,
      });
    }

    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suppliers = await prisma.suppliers.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (suppliers) {
      return res.status(200).json(suppliers);
    }
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// export const getSupplier = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const supplierName = req.query.q

//     const supplier = await prisma.suppliers.findMany({
//       where: {
//         supplierName: {
//           contains: supplierName,
//         },
//       },
//     });

//     if (supplier) {
//       return res.status(200).json(supplier);
//     }
//     next();
//   } catch (err: any) {
//     return res.status(500).json({ error: err.message });
//   }
// };
import bcryptjs from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma";
import { User } from "../types";


export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const userExist = await prisma.user.findUnique({ where: { username } });
    if (userExist) {
      return res.status(409).send({ message: "User already exists" });
    }

    const saltRounds = 10;
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser: User = await prisma.user.create({
      data: {
        userId: uuidv4(),
        username,
        password: hashedPassword,
      },
    });

    if (newUser) {
      return res.status(201).send({ message: "User created successfully" });
    }

    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password }: User = req.body;
    const foundUser = await prisma.user.findUnique({ where: { username } });

    if (!foundUser) {
      return res.status(404).send({ message: "User not exists" });
    }

    const verifyPassword = await bcryptjs.compare(password, foundUser.password);
    if (!verifyPassword) {
      return res.status(409).send({status: "error",message: "Wrong password"});
    }

    const accessToken = await jwt.sign(
      { id: foundUser.userId },
      process.env.ACCESS_TOKEN!,
      { expiresIn: "1h" },
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const user = foundUser.username;

    res
      .status(200)
      .send({ message: "User logged in", data: { user, accessToken } });
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.clearCookie("access_token").status(200).json("User has been logged out!");
  next();
};

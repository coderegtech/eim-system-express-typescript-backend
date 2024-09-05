import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend the Request type to include a userId property
interface CustomRequest extends Request {
  userId?: string;
}

const verifyJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(403).send({status: "error", message: "Forbidden"});
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Define the structure of the decoded JWT if known
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!) as {
      id: string;
    };

    req.userId = decoded.id;
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export default verifyJWT;

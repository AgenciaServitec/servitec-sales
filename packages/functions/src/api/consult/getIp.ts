import { Request, Response } from "express";

export const getIp = (req: Request, res: Response) => {
  const clientIp: string | undefined =
    req.get("x-forwarded-for") || req.socket.remoteAddress;

  res.send({ ip: clientIp });
};

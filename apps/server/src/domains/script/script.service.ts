import { Request, Response } from "express";
import path from "path";
import { isProd } from "../../lib/config";

const scriptRoute = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/javascript");

  if (isProd()) {
    res.setHeader("Cache-Control", "public, max-age=3600");
  }

  res.sendFile(path.join(__dirname, "./statslog-script.js"));
};

export default scriptRoute;

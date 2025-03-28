import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";

import { auth } from "./lib/auth";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.all("/api/auth/*", toNodeHandler(auth));

app.use(cookieParser());
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  // If session exists, then the user is authenticated, otherwise not
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  console.log("Session: ", session);

  res.json({ message: "Hello World" });
});

app.listen(8080, () => console.log("Server running on port 8080"));

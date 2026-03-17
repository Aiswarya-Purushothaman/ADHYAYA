import express from "express";
import { connectDB } from "./db/database";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes";
import instructorRoutes from "./Routes/instructorRoutes";
import adminRoutes from "./Routes/adminRoutes";
import bodyParser from "body-parser";
import cors, { CorsOptions, CorsOptionsDelegate } from "cors";
import session from "express-session";
import { SessionData } from "express-session";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { socket } from "./Socket";

declare module "express-session" {
  interface SessionData {
    otp: string;
    token: string;
  }
}

const app = express();
const server = createServer(app);

dotenv.config();
connectDB();

const port = 5000;

const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
  const origin = "http://localhost:3000";
  const methods = ["GET", "POST", "PUT", "PATCH"];
  const accessControlRequestHeaders = req.headers[
    "access-control-request-headers"
  ] as string | undefined;
  const allowedHeaders = accessControlRequestHeaders
    ? accessControlRequestHeaders.split(",")
    : ["Content-Type", "Authorization"];
  const corsOptions = {
    origin,
    methods,    
    allowedHeaders,
    credentials: true,
  };

  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: "your-secret-Key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
    },
  })
);

console.log("route working");

app.use("/api", userRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/admin", adminRoutes);
socket(server);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

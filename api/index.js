import dotenv from "dotenv";
import { userRoutes } from "../routes/userRoutes.js";

dotenv.config();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // Parse JSON body for POST, PUT, PATCH
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      req.body = data ? JSON.parse(data) : {};
    } catch (err) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({ success: false, error: "Invalid JSON format" })
      );
    }
  }

  // Route handling
  if (req.url.startsWith("/api/users")) {
    return userRoutes(req, res);
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: false, error: "Route not found" }));
}

import dotenv from "dotenv";
import { userRoutes } from "../routes/userRoutes.js";

dotenv.config();

// This is the function that Vercel will run per request
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // Route handling
  if (req.url.startsWith("/api/users")) {
    return userRoutes(req, res); // Pass request to your routes
  }

  // Default 404 response
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: false, error: "Route not found" }));
}

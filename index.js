import http from "http";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Route handling
  if (req.url.startsWith("/api/users")) {
    userRoutes(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Route not found" }));
  }
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/api/users`)
);

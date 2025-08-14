// server.js
import http from "http";
// const http = require("http");
import { v4 as uuidv4 } from "uuid";
// const { v4: uuidv4 } = require("uuid"); // For unique IDs
import fs from "fs";
// const fs = require("fs");

// In-memory "database"
let users = [];

// Helper to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// Helper to get request body data
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split("/");
  const method = req.method;
  const id = urlParts[2]; // /users/:id

  // GET /users
  if (urlParts[1] === "users" && method === "GET" && !id) {
    return sendJSON(res, 200, users);
  }

  // GET /users/:id
  if (urlParts[1] === "users" && method === "GET" && id) {
    const user = users.find((u) => u.id === id);
    return user
      ? sendJSON(res, 200, user)
      : sendJSON(res, 404, { message: "User not found" });
  }

  // POST /users
  if (urlParts[1] === "users" && method === "POST") {
    try {
      const body = await getRequestBody(req);
      const newUser = { id: uuidv4(), ...body };
      users.push(newUser);
      return sendJSON(res, 201, newUser);
    } catch (err) {
      return sendJSON(res, 400, { message: "Invalid JSON data" });
    }
  }

  // PUT /users/:id
  if (urlParts[1] === "users" && method === "PUT" && id) {
    try {
      const body = await getRequestBody(req);
      const index = users.findIndex((u) => u.id === id);
      if (index === -1)
        return sendJSON(res, 404, { message: "User not found" });
      users[index] = { id, ...body };
      return sendJSON(res, 200, users[index]);
    } catch (err) {
      return sendJSON(res, 400, { message: "Invalid JSON data" });
    }
  }

  // DELETE /users/:id
  if (urlParts[1] === "users" && method === "DELETE" && id) {
    users = users.filter((u) => u.id !== id);
    return sendJSON(res, 200, { message: "User deleted" });
  }

  // If route not found
  sendJSON(res, 404, { message: "Route not found" });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

export default Server;

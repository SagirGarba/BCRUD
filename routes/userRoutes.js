import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

export const userRoutes = (req, res) => {
  const urlParts = req.url.split("/");
  const id = urlParts[3]; // /api/users/:id

  // Helper to parse JSON body safely
  const parseRequestBody = (callback) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) return callback({});
      try {
        const data = JSON.parse(body);
        callback(data);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Invalid JSON format" })
        );
      }
    });
  };

  // GET all users
  if (req.url === "/api/users" && req.method === "GET") {
    return getUsers(req, res);
  }

  // POST create a user
  if (req.url === "/api/users" && req.method === "POST") {
    return parseRequestBody((data) => createUser(req, res, data));
  }

  // GET single user
  if (req.url.startsWith("/api/users/") && req.method === "GET") {
    return getUser(req, res, id);
  }

  // PUT update user
  if (req.url.startsWith("/api/users/") && req.method === "PUT") {
    return parseRequestBody((data) => updateUser(req, res, id, data));
  }

  // DELETE user
  if (req.url.startsWith("/api/users/") && req.method === "DELETE") {
    return deleteUser(req, res, id);
  }

  // 404 fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: false, error: "Route not found" }));
};

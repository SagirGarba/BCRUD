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

  if (req.url === "/api/users" && req.method === "GET")
    return getUsers(req, res);
  if (req.url === "/api/users" && req.method === "POST")
    return createUser(req, res);
  if (req.url.startsWith("/api/users/") && req.method === "GET")
    return getUser(req, res, id);
  if (req.url.startsWith("/api/users/") && req.method === "PUT")
    return updateUser(req, res, id);
  if (req.url.startsWith("/api/users/") && req.method === "DELETE")
    return deleteUser(req, res, id);

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: false, error: "Route not found" }));
};

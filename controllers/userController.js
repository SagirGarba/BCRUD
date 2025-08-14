import fs from "fs";
import path from "path";
import { errorHandler } from "../utils/errorHandler.js";

const __dirname = path.resolve();
const filePath = path.join(__dirname, "data", "users.json");

// Helper: Read Users
const getUsersFromFile = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
};

// Helper: Save Users
const saveUsersToFile = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// ✅ GET All Users
export const getUsers = (req, res) => {
  const users = getUsersFromFile();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true, data: users }));
};

// ✅ GET Single User
export const getUser = (req, res, id) => {
  const users = getUsersFromFile();
  const user = users.find((u) => u.id === id);
  if (!user) return errorHandler(res, 404, "User not found");
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true, data: user }));
};

// ✅ Create User with Validation
export const createUser = (req, res, data) => {
  const { name, email } = data;
  if (!name || !email) {
    return errorHandler(res, 400, "Name and Email are required");
  }

  const users = getUsersFromFile();
  const newUser = { id: Date.now().toString(), name, email };
  users.push(newUser);
  saveUsersToFile(users);

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true, data: newUser }));
};

// ✅ Update User
export const updateUser = (req, res, id, data) => {
  const { name, email } = data;
  const users = getUsersFromFile();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) return errorHandler(res, 404, "User not found");

  if (!name && !email) {
    return errorHandler(res, 400, "At least one field is required");
  }

  users[index] = {
    ...users[index],
    name: name || users[index].name,
    email: email || users[index].email,
  };
  saveUsersToFile(users);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true, data: users[index] }));
};

// ✅ Delete User
export const deleteUser = (req, res, id) => {
  const users = getUsersFromFile();
  const updatedUsers = users.filter((u) => u.id !== id);

  if (users.length === updatedUsers.length) {
    return errorHandler(res, 404, "User not found");
  }

  saveUsersToFile(updatedUsers);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({ success: true, message: "User deleted successfully" })
  );
};

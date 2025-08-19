// server.js
import http from "http";
import dotenv from "dotenv";
import handler from "./api/index.js";

dotenv.config();
const port = process.env.PORT || 5000;

const server = http.createServer(handler);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/api/users`);
});

const express = require("express");
const cors = require("cors");
const todos = require("./todos");
const files = require("./files");
const { sendError } = require("./errors");

const app = express();
const PORT = process.env.PORT || 4000;

// openapi.yaml 상단 CORS 정책: 프론트 origin(http://localhost:3000)을 반드시 허용
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/todos", todos.list);
app.post("/todos", todos.create);
app.get("/todos/:todoId", todos.getOne);
app.patch("/todos/:todoId", todos.update);
app.delete("/todos/:todoId", todos.remove);

app.post("/files", files.uploadFile);
app.get("/files/:fileId", files.downloadFile);
app.delete("/files/:fileId", files.deleteFile);

// 정의되지 않은 경로 / 공통 에러 포맷 유지
app.use((req, res) => {
  sendError(res, 404, "요청한 경로를 찾을 수 없습니다.");
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  sendError(res, 500, "서버 내부 오류가 발생했습니다.");
});

app.listen(PORT, () => {
  console.log(`mock-server listening on http://localhost:${PORT}`);
});

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { randomUUID } = require("crypto");
const { sendError } = require("./errors");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
]);

// 메타데이터는 인메모리로, 실제 바이너리는 uploads/ 디스크에 저장합니다.
const files = new Map();

function nowIso() {
  return new Date().toISOString().replace(/\.\d+Z$/, "Z");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, randomUUID()),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error("UNSUPPORTED_MIME_TYPE"));
    }
    cb(null, true);
  },
}).single("file");

function uploadFile(req, res) {
  upload(req, res, (err) => {
    if (err) {
      if (err.message === "UNSUPPORTED_MIME_TYPE") {
        return sendError(res, 400, "지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, webp만 허용)");
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return sendError(res, 400, "파일 용량이 너무 큽니다. (최대 10MB)");
      }
      return sendError(res, 400, "파일 업로드에 실패했습니다.");
    }
    if (!req.file) {
      return sendError(res, 400, "file 필드가 필요합니다.");
    }

    const id = req.file.filename; // diskStorage에서 randomUUID()로 부여한 이름
    const meta = {
      id,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/files/${id}`,
      createdAt: nowIso(),
      diskPath: req.file.path,
    };
    files.set(id, meta);

    const { diskPath, ...publicMeta } = meta;
    res.status(201).json(publicMeta);
  });
}

function downloadFile(req, res) {
  const meta = files.get(req.params.fileId);
  if (!meta) return sendError(res, 404, "해당 id의 파일을 찾을 수 없습니다.");
  res.setHeader("Content-Type", meta.mimeType);
  res.sendFile(meta.diskPath);
}

function deleteFile(req, res) {
  const meta = files.get(req.params.fileId);
  if (!meta) return sendError(res, 404, "해당 id의 파일을 찾을 수 없습니다.");
  fs.unlink(meta.diskPath, () => {});
  files.delete(req.params.fileId);
  res.status(204).send();
}

module.exports = { uploadFile, downloadFile, deleteFile };

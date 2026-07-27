// openapi.yaml 공통 에러 포맷: { "error": "메시지" }
function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

module.exports = { sendError };

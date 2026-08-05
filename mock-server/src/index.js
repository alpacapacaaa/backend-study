const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = 4000
const JWT_SECRET = 'mock-secret-key-for-testing'

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// 인메모리 사용자 저장소
const users = new Map()

// 유틸리티 함수
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function toUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

// POST /auth/register - 회원가입
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    // 유효성 검사
    if (!email || !password || !name) {
      return res.status(400).json({ error: '이메일, 비밀번호, 이름은 모두 필수입니다.' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: '비밀번호는 8자 이상이어야 합니다.' })
    }

    // 이메일 중복 확인
    if (users.has(email)) {
      return res.status(409).json({ error: '이미 등록된 이메일입니다.' })
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const now = new Date().toISOString()
    const user = {
      id: generateId(),
      email,
      name,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    }

    users.set(email, user)

    res.status(201).json(toUserResponse(user))
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
})

// POST /auth/login - 로그인
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // 유효성 검사
    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호는 모두 필수입니다.' })
    }

    // 사용자 찾기
    const user = users.get(email)
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      token,
      user: toUserResponse(user),
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
})

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`)
})

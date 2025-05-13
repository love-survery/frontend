# 1. 빌드 단계
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml ./

# 패키지 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 앱 빌드
RUN pnpm build

# 2. 실행 단계
FROM node:20-alpine AS runner

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 환경 변수 설정
ENV NODE_ENV production

# 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 불필요한 개발 의존성 제거를 위한 생산 모드 설치
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# 사용자 생성 및 권한 설정
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경 변수: 호스트 설정 (컨테이너 외부에서 접근 가능하도록)
ENV HOSTNAME "0.0.0.0"

# 서버 실행
CMD ["node", "server.js"]

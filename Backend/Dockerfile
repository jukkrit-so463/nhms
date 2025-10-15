# ใช้ Node.js LTS version
FROM node:18-alpine

# ตั้งค่า working directory
WORKDIR /app

# คัดลอก package files
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci --only=production

# คัดลอก source code
COPY . .

# สร้างโฟลเดอร์ uploads
RUN mkdir -p uploads

# เปิด port 3001
EXPOSE 3001

# ตั้งค่า environment variables
ENV NODE_ENV=production
ENV PORT=3001

# สร้าง user non-root เพื่อความปลอดภัย
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN apk add --no-cache curl

# เปลี่ยน ownership ของไฟล์
RUN chown -R nodejs:nodejs /app
USER nodejs

# รันแอปพลิเคชัน
CMD ["node", "index.js"]

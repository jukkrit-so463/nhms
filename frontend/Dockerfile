# Multi-stage build
# Stage 1: Build
FROM node:18-alpine as build

WORKDIR /app

# คัดลอก package files
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci

# คัดลอก source code
COPY . .

# Build สำหรับ production
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# คัดลอก built files จาก stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# คัดลอก nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# เปิด port 80
EXPOSE 80

# รัน nginx
RUN apk add --no-cache curl

CMD ["nginx", "-g", "daemon off;"]

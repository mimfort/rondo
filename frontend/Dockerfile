# Stage 1 - Build
FROM node:20-alpine AS build

WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Stage 2 - Production
FROM nginx:alpine

# Копирование собранного приложения
COPY --from=build /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспорт порта
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"] 
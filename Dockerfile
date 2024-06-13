FROM node:20-alpine3.20 AS builder

RUN rm -rf /app
RUN mkdir /app
WORKDIR /app
COPY package.json  ./ 
COPY package-lock.json ./
COPY angular.json ./
COPY tailwind.config.js ./
COPY tsconfig.app.json ./
COPY tsconfig.json ./
COPY tsconfig.spec.json ./


RUN npm install -g @angular/cli@17 && npm install
COPY . .
RUN npm run build --prod


FROM nginx:alpine
COPY --from=builder /app/dist/mf-kfc001/browser /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
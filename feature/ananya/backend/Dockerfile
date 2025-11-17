FROM node:18-alpine

WORKDIR /app

# Install system dependencies for conversion tools
RUN apk add --no-cache \
    libreoffice \
    tesseract-ocr \
    imagemagick \
    ghostscript

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]


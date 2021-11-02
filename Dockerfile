FROM node:12-alpine as frontend-builder
WORKDIR /opt/frontend
COPY vue-src/package*.json ./
RUN npm install
COPY vue-src/ ./
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "serve"]
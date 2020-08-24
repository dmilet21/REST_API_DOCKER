FROM node:9-slim
RUN mkdir /app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]

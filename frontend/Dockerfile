FROM node:latest
WORKDIR /app
COPY . .
#COPY ./package.json ./
#COPY ./package-lock.json ./
RUN npm ci
RUN npm run build

CMD ["npm", "run", "start"]
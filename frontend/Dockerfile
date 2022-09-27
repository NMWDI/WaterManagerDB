FROM node:alpine
WORKDIR /app
COPY ./package.json ./
#COPY ./package-lock.json ./
COPY ./ ./
RUN npm install --save
CMD ["npm", "run", "start"]
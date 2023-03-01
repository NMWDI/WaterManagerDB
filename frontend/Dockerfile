#CC Testing
FROM node:latest

WORKDIR /home/node/app

#Copy requirements and install before copying everything else
#This is beneficial for when the container is rebuilt
#https://stackoverflow.com/questions/63691203/how-do-i-make-a-react-app-in-docker-compose-container-is-exiting-after-build-st
COPY package*.json ./
RUN npm install

COPY . .

#EXPOSE 3000


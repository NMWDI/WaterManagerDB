FROM node:latest
WORKDIR /app
#COPY . .
##RUN npm install
##COPY ./package.json ./
##COPY ./package-lock.json ./
##RUN npm ci
##RUN npm run build
#RUN yarn
##COPY . ./
#RUN yarn build
##RUN #yarn install --frozen-lockfile
##RUN npm run build
#RUN npm install -g serve
#CMD serve -s build

# stage1 - build react app first
FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn
COPY . /app
CMD yarn start
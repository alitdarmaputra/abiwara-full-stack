FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY ./build build
COPY ./public public
COPY .env .env
CMD [ "serve", "-s", "build" ]

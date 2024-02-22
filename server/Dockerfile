FROM node:alpine

ENV APP_HOME /backend
RUN mkdir ${APP_HOME}
WORKDIR ${APP_HOME}

COPY . .

RUN npm install

EXPOSE 5000

CMD ["npm", "start"]

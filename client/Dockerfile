FROM node:alpine

ENV APP_HOME /frontend
RUN mkdir ${APP_HOME}
WORKDIR ${APP_HOME}

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

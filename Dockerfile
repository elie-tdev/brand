FROM node:lts-alpine

ENV APP_PATH /usr/src/app
USER root

WORKDIR ${APP_PATH}
ADD . .
RUN yarn install

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

CMD ["yarn", "start"]

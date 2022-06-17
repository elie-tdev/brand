FROM node:lts-alpine

ENV APP_PATH /usr/src/app

USER root

RUN apk add --no-cache \
  make \
  build-base \
  gcc \
  g++ \
  python \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev \
  pixman-dev

RUN apk update && apk upgrade && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk add --no-cache \
  chromium \
  nss@edge \
  harfbuzz@edge \
  freetype@edge \
  harfbuzz@edge \
  ttf-freefont@edge

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add user so we don't need --no-sandbox.
# RUN addgroup -S onebranduser && adduser -S -g onebranduser onebranduser \
#   && mkdir -p /home/onebranduser/Downloads ${APP_PATH} \
#   && chown -R onebranduser:onebranduser /home/onebranduser \
#   && chown -R onebranduser:onebranduser ${APP_PATH}

# Run everything after as non-privileged user.
# USER onebranduser
WORKDIR ${APP_PATH}
ADD . .
RUN yarn install

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

CMD ["yarn", "start"]

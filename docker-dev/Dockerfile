FROM node:8.15.0

WORKDIR /usr/local/docker/app

COPY ./package.json /usr/local/docker/app
COPY ./package-lock.json /usr/local/docker/app
COPY ./tsconfig.json /usr/local/docker/app
COPY ./.eslintrc.js /usr/local/docker/app
COPY ./.prettierrc /usr/local/docker/app
COPY ./.jshintrc /usr/local/docker/app
COPY ./.jshintignore /usr/local/docker/app

COPY ./index.js /usr/local/docker/app
COPY ./src /usr/local/docker/app/src
COPY ./lib /usr/local/docker/app/lib
COPY ./bin /usr/local/docker/app/bin
COPY ./test /usr/local/docker/app/test

RUN npm ci \
  && npm run build

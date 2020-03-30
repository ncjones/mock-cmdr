FROM node:erbium
WORKDIR /work
COPY package.json yarn.lock /work/
RUN yarn install
COPY . /work/

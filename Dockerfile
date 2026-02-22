FROM node:latest AS builder
LABEL authors="jitsedesmet"

WORKDIR /var/www/demo
COPY package.json yarn.lock ./

RUN yarn install

COPY . .
RUN yarn setup && yarn build


FROM nginx:latest AS runner

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /var/www/demo/build/ /usr/share/nginx/html


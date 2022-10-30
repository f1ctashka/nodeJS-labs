FROM node:18-alpine as builder

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build


FROM node:18-alpine
LABEL fly_launch_runtime="nodejs"

ARG PORT=${PORT:-3000}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]

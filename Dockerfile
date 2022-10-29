FROM node:18-alpine as builder

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build


FROM node:18-alpine
LABEL fly_launch_runtime="nodejs"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]

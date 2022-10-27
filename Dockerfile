# Build
FROM node:18-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts


# Run
FROM node:18-alpine
LABEL fly_launch_runtime="nodejs"
COPY --from=builder /usr/src/app /usr/src/app/
WORKDIR /usr/src/app
CMD ["npm", "run", "start"]

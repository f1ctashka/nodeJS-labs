# Build
FROM node:18-alpine
LABEL fly_launch_runtime="nodejs"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY ./src ./src
EXPOSE 3000
CMD ["npm", "run", "start"]

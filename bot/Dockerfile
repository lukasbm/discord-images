FROM node:16-alpine
WORKDIR /app

COPY package.json package.json
RUN npm install --only=production
COPY src/ src/

CMD [ "npm", "run", "start" ]

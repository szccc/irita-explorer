FROM node:10.4.1-alpine

COPY explorer /app/explorer
COPY backend /app/backend

RUN apk add --no-cache git && cd /app/explorer && npm install cnpm -g && cnpm install && cd /app/backend && npm install pm2 -g && npm install && npm run tag 

CMD cd /app/explorer && npm run serve && cd /app/backend && pm2 start ./bin/www

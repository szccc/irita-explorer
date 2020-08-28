FROM node:14.4.0-alpine3.12 AS builder
WORKDIR /app
COPY . .
RUN apk add make git && npm i cnpm -g  && make setup && make setup_and_build

FROM nginx:1.19-alpine
RUN echo -e 'server {\n\
	root /usr/share/nginx/html;\n\
    location /api/ {\n\
		proxy_pass http://$BACKEND/;\n\
    }\n\
    location /lcd/ {\n\
		proxy_pass http://$LCD/;\n\
    }\n\
}' > /nginx.template

COPY --from=builder /app/dist/ /usr/share/nginx/html/
CMD sh -c "envsubst < /nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
# Build SPA Web App
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY ./package.json ./
RUN yarn install
COPY ./ ./
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/default.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
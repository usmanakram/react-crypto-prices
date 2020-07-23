# https://medium.com/@shakyShane/lets-talk-about-docker-artifacts-27454560384f
# Stage 1 - the build process
FROM node:13.8.0 as build-deps
WORKDIR /usr/src/app
# COPY package.json yarn.lock ./
# RUN yarn
# COPY . ./
# RUN yarn build
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build
# CMD ["npm", "run", "build"]

# Stage 2 - the production environment
FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY vhost.conf /etc/nginx/conf.d/default.conf

COPY ssl/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY ssl/privkey.pem /etc/nginx/ssl/privkey.pem

# EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]



# FROM nginx:1.12-alpine
# COPY vhost.conf /etc/nginx/conf.d/default.conf
# COPY build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
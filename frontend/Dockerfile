# build stage
FROM node:18-alpine AS build
WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:3000/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY package*.json ./
RUN npm install

COPY . . 
RUN npm run build

# production stage
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

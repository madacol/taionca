FROM node:14-alpine
ARG DATABASE_URL
ARG SECRET_SESSION
ENV DATABASE_URL=$DATABASE_URL
ENV SECRET_SESSION=$SECRET_SESSION
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build:db
RUN npm run build:sapper
EXPOSE 3000
CMD ["npm", "start"]
ENTRYPOINT ["npm", "start"]

FROM node:14
WORKDIR ~/clean-node-api
COPY ./package.json .
RUN yarn --prod
COPY ./dist ./dist
EXPOSE 3333
CMD yarn start

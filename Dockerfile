FROM node:9.11.1
ARG user_id=1000
RUN if [ $(id -u node) != $user_id ]; then usermod -u $user_id -g $user_id node; fi
RUN mkdir -p /app/xeh
RUN chown -R node:node /app
USER node
ENV PATH="/app/xeh/node_modules/.bin:${PATH}"
WORKDIR /app/xeh

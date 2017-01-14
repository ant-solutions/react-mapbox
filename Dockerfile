FROM node:6.7.0
MAINTAINER ANT_Solutions "particle4dev@gmail.com"

ENV DEBIAN_FRONTEND noninteractive

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm cache clean && npm install

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/

EXPOSE 8080

CMD ["npm", "start"]

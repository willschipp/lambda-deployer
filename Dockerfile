FROM iron/node
WORKDIR /app
ADD . /app
ENTRYPOINT ["node","index.js"]

FROM node:20-alpine 
LABEL maintainer="maly@maly.cz"

COPY ./app /opt/web

RUN chmod 755 /opt/web/entry.sh

EXPOSE 1666

CMD ["/opt/web/entry.sh"]
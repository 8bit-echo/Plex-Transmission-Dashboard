# FROM alpine-webdev
FROM torrent-dashboard
WORKDIR /home/alpine/app
RUN mkdir -p "/media/mini/ServerSpace/Media/TV Shows/Ink Master" && touch "/media/mini/ServerSpace/Downloads/www.torrenting.com - Ink Master S12E15 Step Up or Shut Up 1080p HEVC x265-MeGusta"

COPY ["./back-end/", "./back-end"]
COPY ["./client/dist/", "./client/dist"]
RUN cd back-end && yarn
COPY . .
RUN chown -R alpine:alpine /media/mini
EXPOSE 2113 8080
# CMD su alpine && whoami && cd /home/alpine/app/back-end && yarn start
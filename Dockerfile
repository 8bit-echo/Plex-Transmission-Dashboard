# FROM alpine-webdev
FROM torrent-dashboard
WORKDIR /home/alpine/app
RUN mkdir -p "/media/mini/ServerSpace/Media/TV Shows/Cosmos Possible Worlds" && mkdir -p "/media/mini/ServerSpace/Media/TV Shows/Cosmos" && mkdir -p "/media/mini/ServerSpace/Media/TV Shows/Cosmos - A Spacetime Odyssey" && touch "/media/mini/ServerSpace/Downloads/Cosmos Possible Worlds S01E04 Vavilov  [1080p x265 10bit FS90 Joy].mkv"

COPY ["./back-end/", "./back-end"]
COPY ["./client/dist/", "./client/dist"]
RUN cd back-end && yarn
COPY . .
RUN chown -R alpine:alpine /media/mini
EXPOSE 2113 8080
# CMD su alpine && whoami && cd /home/alpine/app/back-end && yarn start
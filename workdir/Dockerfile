FROM sitespeedio/browsertime:latest

WORKDIR /browsertime

## Adding custom configuration of chrome with 4 profiles set
RUN mkdir config
ADD resources/config/google-chrome /config/google-chrome

COPY resources/lib/chrome/P4_NoScript_index.js /usr/src/app/lib/chrome/webdriver/index.js

## Overriding original entrypoint
COPY ./customStart.sh /customStart.sh
ENTRYPOINT ["/customStart.sh"]
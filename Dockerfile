FROM sitespeedio/browsertime:latest
COPY ./customStart.sh /customStart.sh
ENTRYPOINT ["/customStart.sh"]
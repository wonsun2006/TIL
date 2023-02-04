FROM python:3.7-alpine
LABEL MAINTAINER="Korean App Developer Ltd"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY ./app /usr/src/app

RUN adduser -D user
USER user
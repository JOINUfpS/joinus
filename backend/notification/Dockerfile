FROM ubuntu:latest

RUN apt-get -y update
RUN apt-get install python3 -y
RUN apt-get install redis-server -y
RUN apt-get install python3-pip -y
RUN pip install supervisor

ADD /supervisor /src/supervisor
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
COPY . /code
COPY requirements.txt .

RUN pip3 install -r requirements.txt

ENV CONTEXT_ASN_APP="asn/"

EXPOSE 8098

CMD ["supervisord","-c","/src/supervisor/service_script.conf"]
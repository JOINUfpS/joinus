FROM python:3.8
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY . /code
COPY requirements.txt .
RUN pip install -r requirements.txt

ENV CONTEXT_ASN_APP="asn/"

EXPOSE 8091

ENTRYPOINT ["python3", "./manage.py", "runserver", "0.0.0.0:8091"]
FROM python:3.11

ARG CLUSTER_URI
ARG OPENAI_KEY

RUN useradd -m -u 1000 pi

ENV HOME=/home/pi
ENV MONGODB_ATLAS_CLUSTER_URI=$CLUSTER_URI
ENV OPENAI_API_KEY=$OPENAI_KEY

WORKDIR $HOME/app

COPY --chown=pi ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r ./requirements.txt
RUN chown pi $HOME/app
USER pi

COPY --chown=pi ./main.py $HOME/app

EXPOSE 7861

CMD python -m uvicorn main:app --reload --host 0.0.0.0 --port 7861
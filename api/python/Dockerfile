FROM python:3.11

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
COPY ./WizardLM-7B-uncensored.ggmlv3.q5_0.bin /app/WizardLM-7B-uncensored.ggmlv3.q5_0.bin
COPY ./java-design-patterns.pdf /app/java-design-patterns.pdf
COPY ./qbot-db.exchange.json /app/qbot-db.exchange.json
COPY ./CS633_Syllabus.pdf /app/CS633_Syllabus.pdf
COPY ./LECTURE1.pdf /app/LECTURE1.pdf
COPY ./questions_and_answers.txt /app/questions_and_answers.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

RUN useradd -m -u 1000 pi
USER pi

ENV HOME=/home/pi

WORKDIR $HOME/app

COPY --chown=pi . $HOME/app
EXPOSE 8088

CMD python -m uvicorn main:app --host 0.0.0.0 --port 8088
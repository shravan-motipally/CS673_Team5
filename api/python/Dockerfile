FROM python:3.11

RUN useradd -m -u 1000 pi


ENV HOME=/home/pi

WORKDIR $HOME/app

RUN mkdir model
# RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.rpm.sh | bash
RUN apt-get update
RUN apt-get install git-lfs -y
# RUN yum install git-lfs -y
RUN git lfs install
RUN git clone --progress --verbose https://huggingface.co/shravanm/CS673QAModel ./model
#RUN cd ./model/CS673QAModel
#RUN git lfs pull
#RUN curl -L https://huggingface.co/shravanm/CS673QAModel/resolve/main/WizardLM-7B-uncensored.ggmlv3.q5_0.bin --output ./model/WizardLM-7B-uncensored.ggmlv3.q5_0.bin

COPY --chown=pi ./requirements.txt ./requirements.txt
COPY --chown=pi ./java-design-patterns.pdf ./java-design-patterns.pdf
COPY --chown=pi ./qbot-db.exchange.json ./qbot-db.exchange.json
COPY --chown=pi ./CS633_Syllabus.pdf ./CS633_Syllabus.pdf
COPY --chown=pi ./LECTURE1.pdf ./LECTURE1.pdf
COPY --chown=pi ./questions_and_answers.txt ./questions_and_answers.txt
RUN pip install --no-cache-dir -r ./requirements.txt
RUN chown pi $HOME/app
USER pi

RUN mkdir $HOME/app/chroma
COPY --chown=pi . $HOME/app
EXPOSE 8080

CMD python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080
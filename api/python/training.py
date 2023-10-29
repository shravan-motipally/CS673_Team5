import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")


def create():
    file = openai.File.create(
        user_provided_filename="fine-tuning.jsonl",
        file=open("fine-tuning.jsonl", "rb"),
        purpose='fine-tune'
    )
    print(file)
    print("file has been created")
    return file.id


def create_fine_tuned_model(file):
    job = openai.FineTuningJob.create(training_file=file, model="gpt-3.5-turbo")
    print(job)


# file_id = create()
# create_fine_tuned_model(file_id)
jobs = openai.FineTuningJob.list(limit=10)
print(jobs)
# job = openai.FineTuningJob.retrieve(jobs.data[0].id)
# print(job)
events = openai.FineTuningJob.list_events(id=jobs.data[0].id, limit=10)
print(events)
job = openai.FineTuningJob.retrieve(jobs.data[0].id)
print(job)
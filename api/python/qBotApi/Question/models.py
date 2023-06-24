from django.db import models

# Create your models here.

class Query(models.Model):
	QueryId = models.AutoField(primary_key=True)
	Question = models.CharField(max_length=500)
	Answer = models.CharField(max_length=1000)

class Chat(models.Model):
	ChatId = models.AutoField(primary_key=True)
	Type = models.CharField(max_length=10)
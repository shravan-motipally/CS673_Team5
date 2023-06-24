from django.db import models

# Create your models here.

class User(models.Model):
	UserId = models.AutoField(primary_key=True)
	Credentials = models.ForeignKey("Login", on_delete=models.CASCADE)
	PhotoURL = models.CharField(max_length=1000)

class Login(models.Model):
	LogonId = models.AutoField(primary_key=True)
	UserName = models.CharField(max_length=50)
	SaltedHash = models.CharField(max_length=256)
	Salt = models.CharField(max_length=64)

from rest_framework import serializers
from Users.models import User,Login

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model=User
		fields=('UserId','Credentials','PhotoURL')

class LoginSerializer(serializers.ModelSerializer):
	class Meta:
		model=Login
		fields=('LogonId','UserName','SaltedHash', 'Salt')
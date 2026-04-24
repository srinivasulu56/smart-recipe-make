from django.db import models
from django.contrib.auth.models import User

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    ingredients = models.JSONField()
    steps = models.JSONField()
    image = models.URLField()

    def __str__(self):
        return f"{self.user.username} - {self.title}"
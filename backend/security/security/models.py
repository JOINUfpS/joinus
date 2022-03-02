from datetime import datetime

from djongo import models


class SecurityModel(models.Model):
    id = models.TextField(primary_key=True)
    refresh_token = models.TextField()
    user_email = models.EmailField()
    user = models.JSONField()
    user_agent = models.TextField()
    secu_date = models.DateTimeField(default=datetime.now)
    secu_provider = models.TextField()

    class Meta:
        db_table = "security"

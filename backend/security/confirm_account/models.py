import uuid

from djongo import models


class ConfirmAccountModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    user_email = models.TextField()
    user_password = models.TextField()
    temporal_password = models.TextField()
    account_status = models.TextField()
    created_date = models.DateTimeField()

    class Meta:
        db_table = "confirm_account"

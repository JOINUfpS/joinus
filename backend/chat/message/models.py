import uuid

from djongo import models


class MessageModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conv_id = models.UUIDField()
    mess_author = models.UUIDField()
    mess_date = models.DateTimeField()
    mess_content = models.TextField()

    class Meta:
        db_table = "message"

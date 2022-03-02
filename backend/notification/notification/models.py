import uuid

from djongo import models


class NotificationModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    noti_is_read = models.BooleanField(default=False)
    noti_date = models.DateTimeField()
    noti_receiver_id = models.UUIDField()
    noti_path = models.TextField()
    noti_type = models.TextField()
    noti_author_id = models.UUIDField()
    noti_author_name = models.TextField()
    noti_author_photo = models.UUIDField()
    noti_author_email = models.TextField()
    noti_issue = models.TextField()
    noti_destination_name = models.TextField()

    class Meta:
        db_table = "notification"

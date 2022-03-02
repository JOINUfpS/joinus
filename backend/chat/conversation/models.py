import uuid

from djongo import models


class ConversationModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conv_user_emisor_id = models.UUIDField()
    conv_user_receiver_id = models.UUIDField()
    conv_is_bidirectional = models.BooleanField()
    conv_user_emisor_photo_id = models.UUIDField()
    conv_user_receiver_photo_id = models.UUIDField()
    conv_user_emisor_name = models.TextField()
    conv_user_receiver_name = models.TextField()
    conv_user_emisor_email = models.TextField()
    conv_user_receiver_email = models.TextField()

    class Meta:
        db_table = "conversation"

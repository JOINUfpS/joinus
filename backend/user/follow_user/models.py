import uuid

from djongo import models


class FollowUserModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    fous_user_id = models.UUIDField()
    fous_is_bidirectional = models.BooleanField(default=False)
    inst_id_user = models.UUIDField()
    inst_id_fous = models.UUIDField()
    name_user = models.TextField()
    name_fous = models.TextField()
    inst_name_user = models.TextField()
    inst_name_fous = models.TextField()
    user_email = models.TextField()
    fous_email = models.TextField()
    user_degree = models.JSONField()
    fous_degree = models.JSONField()
    user_photo = models.UUIDField()
    fous_photo = models.UUIDField()

    class Meta:
        db_table = "follow_user"

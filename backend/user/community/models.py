import uuid

from djongo import models


class CommunityModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inst_id = models.UUIDField()
    comm_photo_id = models.UUIDField()
    comm_owner_id = models.UUIDField()
    comm_name = models.TextField()
    comm_description = models.TextField()
    comm_category = models.UUIDField()
    comm_category_name = models.TextField()
    comm_privacy = models.BooleanField(default=False)
    comm_amount_member = models.IntegerField()

    class Meta:
        db_table = "community"

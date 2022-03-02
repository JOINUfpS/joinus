import uuid

from djongo import models


class CommunityUserModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    comm_id = models.UUIDField()
    comm_owner_id = models.UUIDField()
    comm_photo = models.UUIDField()
    inst_id = models.UUIDField()
    user_id = models.UUIDField()
    cous_pending_approval = models.BooleanField()
    inst_name = models.TextField()
    cous_admin = models.BooleanField()
    comm_name = models.TextField()
    user_name = models.TextField()
    user_email = models.TextField()
    user_phone = models.TextField()
    user_photo = models.UUIDField()
    comm_category_name = models.TextField()

    class Meta:
        db_table = "community_user"

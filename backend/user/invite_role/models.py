import uuid

from djongo import models


class InviteRoleModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inst_id = models.UUIDField()
    user_id = models.UUIDField()
    role_id = models.UUIDField()
    inro_status = models.TextField()
    inro_type = models.TextField()
    user_name = models.TextField()
    role_name = models.TextField()
    user_email = models.TextField()
    comm_id = models.UUIDField()
    cous_id = models.UUIDField()
    comm_name = models.TextField()

    class Meta:
        db_table = "invite_role"

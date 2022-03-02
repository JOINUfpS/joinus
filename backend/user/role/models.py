import uuid

from djongo import models


class RoleModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inst_id = models.UUIDField()
    role_name = models.TextField()
    role_list_module = models.JSONField(default=[{}])
    role_structure = models.JSONField()
    role_static = models.BooleanField()
    role_status = models.TextField()

    class Meta:
        db_table = "role"

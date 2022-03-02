import uuid

from djongo import models


class ModuleModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    modu_name = models.TextField()
    modu_router = models.TextField()
    modu_icon = models.TextField()
    modu_status = models.TextField()
    modu_permissions = models.JSONField()
    modu_is_generic = models.BooleanField(default=False)

    class Meta:
        db_table = "module"

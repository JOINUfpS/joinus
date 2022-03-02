import uuid

from djongo import models


class FileModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inst_id = models.UUIDField()
    file_extension = models.TextField()
    file_path = models.TextField()
    file_size = models.TextField()

    class Meta:
        db_table = "file"

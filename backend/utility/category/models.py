import uuid

from djongo import models


class CategoryModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    inst_id = models.UUIDField()
    cate_name = models.TextField(unique=True)
    cate_description = models.TextField()
    cate_type = models.TextField()
    cate_status = models.TextField()

    class Meta:
        db_table = "category"

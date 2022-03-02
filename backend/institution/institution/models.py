import uuid

from djongo import models


class InstitutionModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inst_name = models.TextField(unique=True)
    inst_photo = models.UUIDField()
    inst_address = models.TextField()
    inst_country = models.TextField()
    inst_department = models.TextField()
    inst_municipality = models.TextField()
    inst_head = models.TextField()
    inst_website = models.TextField()
    inst_phone = models.TextField()
    inst_fax = models.TextField()

    class Meta:
        db_table = "institution"

import uuid
from datetime import datetime

from djongo import models


class OpportunityModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inst_id = models.UUIDField()
    user_id = models.UUIDField()
    user_name = models.TextField()
    user_photo = models.UUIDField()
    oppo_title = models.TextField()
    oppo_description = models.TextField()
    oppo_expiration_date = models.DateTimeField()
    oppo_employer_email = models.EmailField()
    oppo_simple_request = models.BooleanField()
    oppo_application_url = models.URLField()
    oppo_type_contract = models.TextField()
    oppo_postulates = models.JSONField()
    oppo_attachments = models.JSONField()
    oppo_user_saved = models.JSONField()
    oppo_country = models.JSONField()
    oppo_department = models.JSONField()
    oppo_municipality = models.JSONField()
    oppo_remuneration = models.TextField()
    created_date = models.DateTimeField(default=datetime.now, editable=False)

    class Meta:
        db_table = "opportunity"

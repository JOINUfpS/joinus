import uuid

from djongo import models


class UserModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inst_id = models.UUIDField()
    inst_name = models.TextField()
    user_name = models.TextField()
    user_email = models.TextField(unique=True)
    user_password = models.TextField()
    user_provider = models.TextField()
    user_role = models.JSONField()
    user_role_structure = models.JSONField()
    role_active = models.UUIDField()
    user_admin = models.BooleanField()
    user_intro = models.TextField()
    user_phone = models.TextField()
    user_photo = models.TextField()
    user_gender = models.TextField()
    user_degree = models.JSONField()
    user_projects = models.JSONField()
    user_curriculum_vitae = models.UUIDField()
    user_skill = models.JSONField()
    user_interest = models.JSONField()
    user_country = models.JSONField()
    user_department = models.JSONField()
    user_municipality = models.JSONField()
    user_status = models.TextField()

    class Meta:
        db_table = "user"

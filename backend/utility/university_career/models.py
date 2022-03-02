import uuid

from djongo import models


class UniversityCareerModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    career_name = models.TextField(unique=True)

    class Meta:
        db_table = "university_career"

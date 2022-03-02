import uuid

from djongo import models


class PublicationUserModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    publ_id = models.UUIDField()
    user_id = models.UUIDField()
    puus_interest = models.BooleanField()
    puus_shared = models.BooleanField()
    puus_saved = models.BooleanField()
    publ_user_id = models.UUIDField()
    publ_user_name = models.TextField()
    publ_user_photo = models.UUIDField()
    cate_name = models.TextField()
    comm_id = models.UUIDField()
    comm_name = models.TextField()
    publ_title = models.TextField()
    publ_description = models.TextField()
    publ_authors = models.JSONField()
    publ_comment = models.JSONField()
    publ_privacy = models.BooleanField()
    publ_amount_interest = models.IntegerField()
    publ_amount_shared = models.IntegerField()
    publ_attachments = models.JSONField()
    publ_link_doi = models.TextField()
    publ_project_id = models.UUIDField()
    publ_project = models.JSONField()
    created_date = models.DateTimeField()

    class Meta:
        db_table = "publication_user"

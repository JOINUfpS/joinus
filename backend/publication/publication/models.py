import uuid

from djongo import models


class PublicationModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    user_name = models.TextField()
    user_photo = models.UUIDField()
    inst_id = models.UUIDField()
    comm_id = models.UUIDField()
    cate_id = models.UUIDField()
    cate_name = models.TextField()
    comm_name = models.TextField()
    publ_title = models.TextField()
    publ_description = models.TextField()
    publ_standard = models.BooleanField()
    publ_authors = models.JSONField()
    publ_privacy = models.BooleanField()
    publ_date = models.DateTimeField()
    publ_comment = models.JSONField()
    publ_interested_list = models.JSONField()
    user_interested = models.BooleanField()
    publ_amount_shared = models.IntegerField()
    publ_amount_download = models.IntegerField()
    publ_attachments = models.JSONField()
    publ_full_text = models.BooleanField()
    publ_link_doi = models.TextField()
    publ_permission_view_full_text = models.JSONField()
    publ_project_id = models.UUIDField()
    publ_project = models.JSONField()
    created_date = models.DateTimeField()

    class Meta:
        db_table = "publication"

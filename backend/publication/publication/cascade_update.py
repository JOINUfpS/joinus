import concurrent.futures

from publication_user.models import PublicationUserModel


class CascadeUpdateTaskPublication:

    def cascade_action(self, request):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_update, request)

    def do_cascade_update(self, request):
        data = request.data
        publ_id = data.get('id')
        if request.stream.method == 'PATCH':
            data.pop('inst_id')
            data.pop('id')
            PublicationUserModel.objects.filter(publ_id=publ_id).update(**data)
        else:
            PublicationUserModel.objects.filter(publ_id=publ_id) \
                .update(publ_title=data.get('publ_title'),
                        publ_description=data.get('publ_description'),
                        publ_authors=data.get('publ_authors'),
                        publ_comment=data.get('publ_comment'),
                        publ_privacy=data.get('publ_privacy'),
                        publ_amount_interest=data.get('publ_amount_interest'),
                        publ_amount_shared=data.get('publ_amount_shared'),
                        publ_attachments=data.get('publ_attachments'))

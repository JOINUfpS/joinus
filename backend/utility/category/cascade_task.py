import concurrent.futures
import json

from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.remote import RemoteModel


class CascadeUpdateTaskCategory:

    def cascade_action(self, request):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_update, request)

    def do_cascade_update(self, request):
        remote_model = RemoteModel(request=request, url=EntityUrlMap.COMMUNITY)
        category = request.data
        data = {'cate_id': category.get('id'),
                'cate_name': category.get('cate_name')}
        updated_raw = remote_model.custom(url_path='cascade_update_category_community', method='put', data=data)
        updated = json.loads(updated_raw.content)

        if not updated['status']:
            raise GenericMicroserviceError(detail=updated['errors'], status=updated_raw.status_code)

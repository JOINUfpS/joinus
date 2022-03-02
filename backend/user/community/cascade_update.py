import concurrent.futures
import json

from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.remote import RemoteModel
from community_user.models import CommunityUserModel


class CascadeUpdateTaskCommunity:

    def cascade_action(self, request):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_update, request)

    def do_cascade_update(self, request):
        data = request.data
        CommunityUserModel.objects.filter(comm_id=data.get('id')).update(comm_owner_id=data.get('comm_owner_id'),
                                                                         comm_photo=data.get('comm_photo'),
                                                                         comm_name=data.get('comm_name'),
                                                                         comm_category_name=data.get(
                                                                             'comm_category_name'))
        remote_model = RemoteModel(request=request, url=EntityUrlMap.PUBLICATION)
        kwargs = {'comm_id': data.get('id'),
                  'comm_name': data.get('comm_name')}
        updated_raw = remote_model.custom(url_path='cascade_update_community', method='put', data=kwargs)

        updated = json.loads(updated_raw.content)

        if not updated['status']:
            raise GenericMicroserviceError(detail=updated['errors'], status=updated_raw.status_code)

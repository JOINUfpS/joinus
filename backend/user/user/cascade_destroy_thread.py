import concurrent.futures
import threading

from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.remote import RemoteModel
from community_user.models import CommunityUserModel
from follow_user.models import FollowUserModel
from invite_role.models import InviteRoleModel


class CascadeDestroyTaskUserThread(threading.Thread):

    def __init__(self, request, **kwargs):
        self.request = request
        self.id = kwargs.get('pk')
        threading.Thread.__init__(self)

    def run(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_destroy, self.request)

    def do_cascade_destroy(self, request):
        CommunityUserModel.objects.filter(user_id=self.id).delete()

        InviteRoleModel.objects.filter(user_id=self.id).delete()

        FollowUserModel.objects.filter(user_id=self.id).delete()

        FollowUserModel.objects.filter(fous_user_id=self.id).delete()

        remote_model_opportunity = RemoteModel(request=request, url=EntityUrlMap.OPPORTUNITY)
        remote_model_opportunity.custom(url_path=f'cascade_deFlete_user/{self.id}', method='delete')

        remote_model_notification = RemoteModel(request=request, url=EntityUrlMap.NOTIFICATION)
        remote_model_notification.custom(data={'user_id': self.id}, url_path=f'cascade_delete_user/{self.id}',
                                         method='put')

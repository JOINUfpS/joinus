import concurrent.futures
import threading

from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.remote import RemoteModel
from community_user.models import CommunityUserModel
from follow_user.models import FollowUserModel
from invite_role.models import InviteRoleModel


class CascadeUpdateTaskUserThread(threading.Thread):

    def __init__(self, request, kwargs):
        self.request = request
        self.kwargs = kwargs
        threading.Thread.__init__(self)

    def run(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_update, self.request, self.kwargs)

    def do_cascade_update(self, request, kwargs):
        data = request.data
        user_id = data.get('id') if data.get('id') is not None else kwargs['pk']
        if request.stream.method == 'PATCH':
            if 'user_photo' in data or 'user_name' in data or 'user_email' in data or 'user_phone' in data or 'user_degree' in data:
                CommunityUserModel.objects.filter(user_id=user_id).update(user_photo=data.get('user_photo'),
                                                                          user_name=data.get('user_name'),
                                                                          user_email=data.get('user_email'),
                                                                          user_phone=data.get('user_phone'))

                InviteRoleModel.objects.filter(user_id=user_id).update(user_name=data.get('user_name'),
                                                                       user_email=data.get('user_email'))

                FollowUserModel.objects.filter(user_id=user_id).update(name_user=data.get('user_name'),
                                                                       user_email=data.get('user_email'),
                                                                       user_degree=data.get('user_degree'),
                                                                       user_photo=data.get('user_photo'))

                FollowUserModel.objects.filter(fous_user_id=user_id).update(name_fous=data.get('user_name'),
                                                                            fous_email=data.get('user_email'),
                                                                            fous_degree=data.get('user_degree'),
                                                                            fous_photo=data.get('user_photo'))

                kwargs = {'user_id': user_id,
                          'user_name': data.get('user_name'),
                          'user_photo': data.get('user_photo')}

                remote_model_notification = RemoteModel(request=request, url=EntityUrlMap.NOTIFICATION)
                remote_model_notification.custom(url_path='cascade_update_user', method='put', data=kwargs)

                remote_model_opportunity = RemoteModel(request=request, url=EntityUrlMap.OPPORTUNITY)
                remote_model_opportunity.custom(url_path='cascade_update_user', method='put', data=kwargs)

                remote_model_conversation = RemoteModel(request=request, url=EntityUrlMap.CONVERSATION)
                kwargs.update({'user_email': data.get('user_email')})
                remote_model_conversation.custom(url_path='cascade_update_user', method='put', data=kwargs)

                remote_model = RemoteModel(request=request, url=EntityUrlMap.PUBLICATION)
                remote_model.custom(url_path='cascade_update_user', method='put', data=kwargs)

            elif 'user_projects' in data:
                user_projects_json = {'user_projects': data.get('user_projects')}
                remote_model = RemoteModel(request=request, url=EntityUrlMap.PUBLICATION)
                remote_model.custom(url_path='cascade_update_user_project', method='put',
                                    data=user_projects_json)

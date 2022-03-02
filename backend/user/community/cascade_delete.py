import concurrent.futures

from community_user.models import CommunityUserModel


class CascadeDeleteTaskCommunity:

    def cascade_action(self, comm_id):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_delete, comm_id)

    def do_cascade_delete(self, comm_id):
        CommunityUserModel.objects.filter(comm_id=comm_id).delete()

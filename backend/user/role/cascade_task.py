import concurrent.futures

from user.models import UserModel
from user.serializer import UserSerializer


class CascadeUpdateTaskRole:

    def cascade_action(self, request):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_update, request)

    def do_cascade_update(self, request):
        data = request.data
        inst_id = data.get('inst_id')
        role_id = data.get('id')
        role_name = data.get('role_name')
        users = UserModel.objects.filter(inst_id=inst_id)
        users_serializer = UserSerializer(users, many=True).data
        for user in users_serializer:
            user_model = UserModel.objects.get(id=user['id'])
            for role in user_model.user_role:
                if str(role['roleId']) == str(role_id):
                    role['roleName'] = role_name
                    try:
                        kwargs = {'user_role': user_model.user_role,
                                  'user_role_structure': data.get('role_structure')}
                        user_updated = UserSerializer(instance=user_model, data=kwargs, partial=True)
                        user_updated.is_valid(raise_exception=True)
                        user_updated.save()

                    except ValueError:
                        pass

                    break

    def cascade_action_delete(self, role):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.do_cascade_delete, role)

    def do_cascade_delete(self, role):
        inst_id = role.inst_id
        role_id = str(role.id)
        users = UserModel.objects.filter(inst_id=inst_id)
        users_serializer = UserSerializer(users, many=True).data
        for user in users_serializer:
            user_model = UserModel.objects.get(id=user['id'])
            roles = user_model.user_role
            for role in user_model.user_role:
                if str(role['roleId']) == str(role_id):
                    new_user_roles = list(filter(lambda obj_role: obj_role['roleId'] != role_id, roles))
                    try:
                        kwargs = {'user_role': new_user_roles}
                        user_updated = UserSerializer(instance=user_model, data=kwargs, partial=True)
                        user_updated.is_valid(raise_exception=True)
                        user_updated.save()
                    except ValueError:
                        pass

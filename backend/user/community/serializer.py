import uuid

from rest_framework import serializers

from common_structure_microservices.serializer import AuditorySerializer
from community.models import CommunityModel
from community_user.models import CommunityUserModel
from community_user.serializer import CommunityUserSerializer


class CommunitySerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    comm_photo_id = serializers.UUIDField(required=False, allow_null=True)
    comm_description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    comm_privacy = serializers.BooleanField(default=False)

    class Meta:
        model = CommunityModel
        fields = ('id',
                  'inst_id',
                  'comm_photo_id',
                  'comm_owner_id',
                  'comm_name',
                  'comm_description',
                  'comm_category',
                  'comm_category_name',
                  'comm_privacy',
                  'comm_amount_member',)

    def create(self, validated_data):
        community_user_json = validated_data.pop('community_user')
        community = super().create(validated_data)
        if community:
            community_user = CommunityUserModel(
                comm_id=community.id,
                comm_owner_id=community.comm_owner_id,
                inst_id=community.inst_id,
                user_id=community.comm_owner_id,
                cous_pending_approval=False,
                inst_name=community_user_json['inst_name'],
                cous_admin=True,
                comm_name=community.comm_name,
                user_name=community_user_json['user_name'],
                user_email=community_user_json['user_email'],
                user_phone=community_user_json['user_phone'],
                user_photo=community_user_json['user_photo'],
                comm_category_name=community.comm_category_name,
            )
            community_user.save()
        return community

    def get_communities_by_categories(self, inst_id, user_id):

        all_communities = self.__get_all_communities(inst_id)
        all_communities_related_to_me = self.__get_all_communities_related_to_me(inst_id, user_id)

        communities_managed, communities_member, others_communities, communities_pending_approval = self.classify_communities(
            all_communities,
            all_communities_related_to_me)
        return {'communities_managed': communities_managed,
                'communities_member': communities_member,
                'communities_pending_approval': communities_pending_approval,
                'other_communities': others_communities, }

    def __get_all_communities(self, inst_id):
        instance_community = CommunityModel.objects.filter(inst_id=inst_id)
        serializer_community = CommunitySerializer(instance_community, many=True)
        return serializer_community.data

    def __get_all_communities_related_to_me(self, inst_id, user_id):
        instance_community_user = CommunityUserModel.objects.filter(inst_id=inst_id, user_id=user_id)
        serializer_community = CommunityUserSerializer(instance_community_user, many=True)
        return serializer_community.data

    def classify_communities(self, all_communities, all_communities_related_to_me):
        communities_managed_by_me = list()
        communities_member = list()
        others_communities = list()
        communities_pending_approval = list()

        for community in all_communities:
            related = False
            for community_user in all_communities_related_to_me:
                if community['id'] == community_user['comm_id']:
                    related = True
                    if community_user['cous_pending_approval']:
                        communities_pending_approval.append(community)
                    elif community_user['cous_admin']:
                        communities_managed_by_me.append(community)
                    else:
                        communities_member.append(community)

                    all_communities_related_to_me.remove(community_user)
                    break

            if not related:
                others_communities.append(community)

        return communities_managed_by_me, communities_member, others_communities, communities_pending_approval


class CascadeUpdateCategoryCommunity(serializers.Serializer):
    cate_id = serializers.UUIDField(required=True)
    cate_name = serializers.CharField(required=True)

    def cascade_update_category_community(self):
        cate_id = self.validated_data.get('cate_id')
        cate_name = self.validated_data.get('cate_name')
        CommunityModel.objects.filter(comm_category=cate_id).update(comm_category_name=cate_name)

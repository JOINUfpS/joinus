import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {FollowUserServices} from './follow_user.services';
import {FollowUserModel} from '../../models/user/follow.user.model';
import {FollowUserAdapter} from '../../adapters/implementation/user/follow-user.adapter';
import {UniversityCareerAdapter} from '../../adapters/implementation/utility/universityCareer.adapter';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';


describe('FollowUserService', () => {
  let service: FollowUserServices;
  let httpTestingController: HttpTestingController;
  let followUserAdapter: FollowUserAdapter;
  let universityCareerAdapter: UniversityCareerAdapter;
  let utilities: UtilitiesConfigString;
  const url = `${environment.userUrl}follow_user/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FollowUserServices, HttpClient, UniversityCareerAdapter, UtilitiesConfigString]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FollowUserServices);
    followUserAdapter = TestBed.inject(FollowUserAdapter);
    universityCareerAdapter = TestBed.inject(UniversityCareerAdapter);
    utilities = TestBed.inject(UtilitiesConfigString);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be get if is user followed', () => {

    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const userSession = '70c22228-8956-4378-8e7d-9de59cc14bfd';
    const userId = 'cf5e1370-c389-4cbf-a42c-8977354e8fe3';

    const expectedData = {
      id: '18d0cccd-98c3-43fd-85c4-589cb2afeee4',
      user_id: '70c22228-8956-4378-8e7d-9de59cc14bfd',
      fous_user_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      fous_is_bidirectional: false,
      inst_id_user: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_id_fous: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name_user: 'CRISEL JAZMIN AYALA LLANES',
      name_fous: 'SEMILLERO SILUX UFPS',
      inst_name_user: 'Universidad Francisco de Paula Santander',
      inst_name_fous: 'Universidad Francisco de Paula Santander',
      user_email: 'criseljazminal@ufps.edu.co',
      fous_email: 'silux@ufps.edu.co',
      user_degree: {},
      fous_degree: {},
      user_photo: '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      fous_photo: null
    };

    const expectedDataAdapted = followUserAdapter.adaptObjectReceive(expectedData);

    service.isUserFollowed(instId, userSession, userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(followUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}is_followed/${instId}/${userSession}/${userId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get usuarios seguidos y seguidores', () => {

    const instIdUser = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';
    const userId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const expectedData = [{
      id: '18d0cccd-98c3-43fd-85c4-589cb2afeee4',
      user_id: '70c22228-8956-4378-8e7d-9de59cc14bfd',
      fous_user_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      fous_is_bidirectional: false,
      inst_id_user: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_id_fous: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name_user: 'CRISEL JAZMIN AYALA LLANES',
      name_fous: 'SEMILLERO SILUX UFPS',
      inst_name_user: 'Universidad Francisco de Paula Santander',
      inst_name_fous: 'Universidad Francisco de Paula Santander',
      user_email: 'criseljazminal@ufps.edu.co',
      fous_email: 'silux@ufps.edu.co',
      user_degree: {},
      fous_degree: {},
      user_photo: '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      fous_photo: null
    }];

    const expectedDataAdapted = followUserAdapter.adaptList(expectedData);

    service.getUsersFollowedAndFolllowers(instIdUser, userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(followUserAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}followed_users/${instIdUser}/${userId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get suggested users', () => {
    const instIdUser = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';
    const userId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const expectedData = [{
      id: '6eec0eb3-1a95-421f-93c1-cb7a885bcea8',
      comm_id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      comm_photo: null,
      user_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      cous_pending_approval: false,
      cous_admin: true,
      comm_name: 'Joinufps',
      comm_category_name: 'Grupo de estudio',
      user_name: 'SEMILLERO SILUX UFPS',
      user_email: 'silux@ufps.edu.co',
      user_phone: '',
      user_photo: null,
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_name: 'Universidad Francisco de Paula Santander',
      user_degree: {
        career_name: 'Ingeniería de sistemas',
        id: 'e2075aac-e37b-4aea-93ba-9fecaa7a2778'
      },
      fous_degree: {
        career_name: 'Psicologa',
        id: 'f2075aac-e37b-4aea-93ba-9fecaa7a2776'
      }
    }];

    const expectedDataAdapted = followUserAdapter.adaptList(expectedData);

    service.getSuggestedUsers(instIdUser, userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(followUserAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}suggested_users/${instIdUser}/${userId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be follow user', () => {

    const follow = new FollowUserModel('18d0cccd-98c3-43fd-85c4-589cb2afeee4',
      '70c22228-8956-4378-8e7d-9de59cc14bfd',
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      false,
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'CRISEL JAZMIN AYALA LLANES',
      'SEMILLERO SILUX UFPS',
      'Universidad Francisco de Paula Santander',
      'Universidad Francisco de Paula Santander',
      'criseljazminal@ufps.edu.co',
      'silux@ufps.edu.co',
      {
        id: 'e2075aac-e37b-4aea-93ba-9fecaa7a2778',
        careerName: 'Ingeniería de Sistemas'
      },
      {
        id: 'e2075aac-e37b-4aea-93ba-9fecaa7a2778',
        careerName: 'Ingeniería de Sistemas'
      },
      '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      null);

    const followAdapted = followUserAdapter.adaptObjectSend(follow);

    service.followUser(follow).then(response => {
      expect(typeof response).toBe('boolean');
      expect(followAdapted).toEqual(followUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}follow/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be unfollow user', () => {

    const idUserSession = 'cf5e1370-c389-4cbf-a42c-8977354e8fe3';

    const follow = new FollowUserModel('18d0cccd-98c3-43fd-85c4-589cb2afeee4',
      '70c22228-8956-4378-8e7d-9de59cc14bfd',
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      false,
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'CRISEL JAZMIN AYALA LLANES',
      'SEMILLERO SILUX UFPS',
      'Universidad Francisco de Paula Santander',
      'Universidad Francisco de Paula Santander',
      'criseljazminal@ufps.edu.co',
      'silux@ufps.edu.co',
      {
        id: 'e2075aac-e37b-4aea-93ba-9fecaa7a2778',
        careerName: 'Ingeniería de Sistemas'
      },
      {
        id: 'e2075aac-e37b-4aea-93ba-9fecaa7a2778',
        careerName: 'Ingeniería de Sistemas'
      },
      '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      null);

    const followAdapted = followUserAdapter.adaptObjectSend(follow);

    service.unfollowUser(follow, idUserSession).then(response => {
      expect(typeof response).toBe('boolean');
      expect(followAdapted).toEqual(followUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}unfollow/${idUserSession}/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});

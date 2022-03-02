import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEditPublicationComponent} from './create-edit-publication.component';
import {CategoryService} from '../../../../services/utility/category.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {PublicationService} from '../../../../services/publication/publication.service';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {UsersService} from '../../../../services/user/user.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {FileService} from '../../../../services/file/file.service';
import {AuthorPublicationAdapter} from '../../../../adapters/implementation/publication/author-publication.adapter';
import {UtilityRichText} from '../../../../utilities/utility-rich-text';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PublicationModel} from '../../../../models/publication/publication.model';

describe('CreateEditPublicationComponent', () => {
  let component: CreateEditPublicationComponent;
  let fixture: ComponentFixture<CreateEditPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CreateEditPublicationComponent ],
      providers: [CategoryService,
        CategoryAdapter,
        PublicationService,
        PublicationAdapter,
        DatePipe,
        ConstString,
        UsersService,
        MessagerService,
        MessageService,
        UtilitiesConfigString,
        FileService,
        AuthorPublicationAdapter,
        UtilityRichText]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show type publication', () => {
    component.showTypePublication();
    expect(component.typePublications).toEqual(true);
  });

  it('should show dialog', () => {
    component.show(null, true);
    expect(component.buttonFormActioned).toBeUndefined(true);
  });

  it('should show remove fields upload', () => {
    component.publication = new PublicationModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      'Yindy Paola Pájaro Urquijo',
      null,
      '',
      null,
      '',
      'Aplicación movil para la administración de las granjas porcinas',
      '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      true,
      [
        {
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          authorName: 'Yindy Paola Pájaro Urquijo',
          authorPhoto: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          authorName: 'Fernando Romero',
          authorPhoto: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }],
      false,
      new Date(),
      [
        {
          id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
          comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          comm_user_name: 'Fernando Romero',
          comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
          comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
          comm_date: '18-10-2021 03:55 PM'
        },
        {
          id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
          comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
          comm_user_name: 'MILTON JESUS VERA CONTRERAS',
          comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
          comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
          comm_date: '27-10-2021 08:58 PM'
        }],
      4,
      [
        {
          id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
          instId: null,
          fileExtension: 'png',
          filePath: '',
          fileSize: '',
          fileType: 'image/png'
        }],
      ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        '2db5485c-02cf-4ef2-bd93-4668cd430499'],
      4,
      false,
      [],
      '',
      'dc847485-9121-43a2-a8a5-28c57cce6609',
      {
        id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        title: 'Softpig',
        abstract: 'Plataforma para administrar ganado porcino',
        startDate: new Date(),
        endDate: new Date(),
        link: null
      },
      new Date());
    component.removeFieldUpload();
    expect(component.publication.publAttachments).toEqual([]);
  });

  it('should show reset fields upload', () => {
    component.reseatFieldsUpload();
    expect(component.imgChange).toEqual(null);
    expect(component.pdfUpload).toEqual(null);
    expect(component.videoUpload).toEqual(null);
    expect(component.uploadedFiles).toEqual([]);
  });

  it('should create edit publication question', () => {
    component.show(null, false);
    component.form.setValue({
      publCategory: 'Categoria de pruebas',
      publTitle: 'Aplicación movil para la administración de las granjas porcinas',
      publDescription: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      publPrivacy: false,
      publProject: {}
    });
    component.createEditPublication();
    expect(component.form.get('publTitle').hasError('missingQuestionMark')).toEqual(true);
    expect(component.buttonFormActioned).toEqual(false);
  });

  it('should create edit publication standard', () => {
    component.show(null, true);
    const publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 10);
    component.form.setValue({
      publCategory: 'Categoria de pruebas',
      publTitle: 'Aplicación movil para la administración de las granjas porcinas',
      publDescription: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      publPrivacy: false,
      publAuthors: [{
        id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        author_name: 'Yindy Paola Pájaro Urquijo',
        author_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
      },
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          author_name: 'Fernando Romero',
          author_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }
      ],
      publDate: publicationDate,
      publFullText: false,
      publLinkDoi: '',
      publProject: {}
    });
    component.createEditPublication();
    expect(component.form.get('publDate').hasError('noValidDate')).toEqual(true);
    expect(component.buttonFormActioned).toEqual(false);
  });

});

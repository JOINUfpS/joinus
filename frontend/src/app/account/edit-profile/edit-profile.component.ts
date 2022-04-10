import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UsersService} from '../../services/user/user.service';
import {UserModel} from '../../models/user/user.model';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {FileService} from '../../services/file/file.service';
import {SendAttachments} from '../../utilities/send-attachments.service';
import {MessagerService} from '../../messenger/messager.service';
import {GeographicalLocationService} from '../../services/utility/geographical-location.service';
import {UtilitiesList} from '../../utilities/utilities-list';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';
import {UniversityCareerService} from '../../services/utility/university-career.service';
import {UniversityCareerModel} from '../../models/utility/university-career.model';
import {UniversityCareerAdapter} from '../../adapters/implementation/utility/universityCareer.adapter';
import {ConstString} from '../../utilities/string/const-string';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/es';
import {UtilityRichText} from '../../utilities/utility-rich-text';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  interestForm: FormGroup;
  skillForm: FormGroup;
  introForm: FormGroup;
  formGeneral: FormGroup;
  formNewProject: FormGroup;
  editProfileDialogDisplay: boolean;
  newProjectDialogDisplay: boolean;
  fieldEdit: string;
  headerText: string;
  validFile: boolean;
  uploadedFiles: any[];
  listUniversityCareers: Array<UniversityCareerModel>;
  buttonFormActioned: boolean;
  startDateProject: Date;
  EndDateProject: Date;
  countries: Array<any>;
  availableStates: Array<any>;
  states: Array<any>;
  cities: Array<any>;
  hiddenCities: boolean;
  hiddenStates: boolean;
  editorRichAbstract = ClassicEditor;
  editingProject: boolean;
  private showEditButton: boolean;
  private userSession: UserModel;
  private projects: Array<any>;
  private indexProjectToEdit: number;
  @Output() updateList: EventEmitter<any>;
  @Input() permissions: any;

  constructor(
    private messagerService: MessagerService,
    private userServices: UsersService,
    private userAdapter: UserAdapter,
    private fileService: FileService,
    private geographicalLocationService: GeographicalLocationService,
    private universityCareerService: UniversityCareerService,
    private universityCareerAdapter: UniversityCareerAdapter,
    private userProjectAdapter: ProjectAdapter,
    public utilitiesConfigString: UtilitiesConfigString,
    public utilityRichText: UtilityRichText) {
    this.showEditButton = true;
    this.validFile = false;
    this.buttonFormActioned = false;
    this.hiddenCities = false;
    this.hiddenStates = false;
    this.editingProject = false;
    this.updateList = new EventEmitter();
    this.userSession = this.utilitiesConfigString.ls.get('user');
    this.initInterestForm();
    this.initSkillForm();
    this.initNewProjectForm();
    this.initGeneralForm();
    this.initIntroForm();
  }

  ngOnInit(): void {
    this.initCareerUniversity();
    this.getCountries();
  }

  private setGeneralData(): void {
    this.formGeneral.reset();
    this.formGeneral.get('id').setValue(this.userSession ? this.userSession.id : '');
    this.formGeneral.get('user_name').setValue(this.userSession ? this.userSession.userName : '');
    this.formGeneral.get('user_email').setValue(this.userSession ? this.userSession.userEmail : '');
    this.formGeneral.get('user_phone').setValue(this.userSession ? this.userSession.userPhone : '');
    this.formGeneral.get('user_country').setValue(
      this.userSession.userCountry.name !== undefined ? this.userSession.userCountry : undefined);
    if (this.userSession.userMunicipality.name !== undefined) {
      this.formGeneral.get('user_municipality').setValue(this.userSession.userMunicipality);
      this.cities = [this.userSession.userMunicipality];
      this.hiddenCities = false;
    } else {
      this.hiddenCities = true;
      this.formGeneral.get('user_municipality').setValue(undefined);
    }
    this.formGeneral.get('user_degree').setValue(
      this.userSession.userDegree.careerName !== undefined ? this.userSession.userDegree : undefined);
    if (this.userSession.userDepartment.name !== undefined) {
      this.formGeneral.get('user_department').setValue(this.userSession.userDepartment);
      this.states = new Array<any>();
      this.states.push(this.userSession.userDepartment);
      this.hiddenStates = false;
    } else if (this.userSession.userCountry.name !== undefined) {
      this.getStates();
    } else {
      this.states = new Array<any>();
      this.hiddenStates = true;
      this.formGeneral.get('user_department').setValue(undefined);
    }
  }

  processDialogToShow(field: string, user: UserModel): void {
    this.userSession = user;
    this.fieldEdit = field;
    this.chooseHeaderDialog();
    if (this.fieldEdit === 'projects') {
      this.editingProject = false;
      this.showNewProjectForm();
    } else if (this.fieldEdit === 'general') {
      this.setGeneralData();
      this.editProfileDialogDisplay = true;
      this.formGeneral.enable();
    } else if (this.fieldEdit === 'intro') {
      this.setIntroData();
      this.editProfileDialogDisplay = true;
      this.introForm.enable();
    } else if (this.fieldEdit === 'interest') {
      this.setInterestData();
      this.editProfileDialogDisplay = true;
      this.interestForm.enable();
    } else if (this.fieldEdit === 'skill') {
      this.setSkillData();
      this.editProfileDialogDisplay = true;
      this.skillForm.enable();
    } else if (this.fieldEdit === 'curriculum vitae') {
      this.editProfileDialogDisplay = true;
      this.setGeneralData();
    }
  }

  reseatDropdownStatesAndCities(): void {
    this.formGeneral.get('user_municipality').setValue(undefined);
    this.formGeneral.get('user_department').setValue(undefined);
    this.hiddenCities = true;
    this.hiddenStates = true;
    this.availableStates = undefined;
    this.hasStates();
  }

  getCountries(): void {
    if (this.countries === undefined) {
      this.geographicalLocationService.getCountries()
        .then(res => {
          this.countries = res;
        });
    }
  }

  getStates(): void {
    this.geographicalLocationService.getStates(this.formGeneral.value.user_country.iso2)
      .then(res => {
        if (res.length > 0) {
          this.hiddenStates = false;
          this.availableStates = res;
          this.formatStates();
        } else {
          this.hiddenStates = true;
        }
      });
  }

  private initInterestForm(): void {
    if (this.interestForm === undefined) {
      this.interestForm = new FormGroup({
        id: new FormControl(''),
        user_interest: new FormControl('')
      });
    }
  }

  private initSkillForm(): void {
    if (this.skillForm === undefined) {
      this.skillForm = new FormGroup({
        id: new FormControl(''),
        user_skill: new FormControl(''),
      });
    }
  }

  private initGeneralForm(): void {
    this.formGeneral = new FormGroup({
      id: new FormControl({value: null, disabled: false}),
      user_name: new FormControl({value: null, disabled: false}, [Validators.required,
        Validators.minLength(3), Validators.maxLength(100)]),
      user_phone: new FormControl({value: null, disable: false},
        [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ConstString.PATTERN_ONLY_NUMBER)]),
      user_email: new FormControl({value: null, disabled: true}, [Validators.required,
        Validators.minLength(3), Validators.maxLength(100)]),
      user_country: new FormControl({value: null, disabled: false}, [Validators.required,
        Validators.minLength(3), Validators.maxLength(100)]),
      user_department: new FormControl({value: null, disabled: false}, [Validators.required,
        Validators.minLength(3), Validators.maxLength(100)]),
      user_municipality: new FormControl({value: null, disabled: false}, [Validators.required,
        Validators.minLength(3), Validators.maxLength(100)]),
      user_degree: new FormControl({value: null, disabled: false}, [Validators.required,
        Validators.minLength(3), Validators.maxLength(100)]),
    });
  }

  private initIntroForm(): void {
    this.introForm = new FormGroup({
      id: new FormControl(''),
      user_intro: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)])
    });
  }

  private initNewProjectForm(): void {
    if (this.formNewProject === undefined) {
      this.formNewProject = new FormGroup({
        userProjectTitle: new FormControl('',
          [Validators.required, Validators.minLength(1), Validators.pattern(ConstString.PATTERN_NO_EMPTY_STRING)]),
        userProjectAbstract: new FormControl(''),
        userProjectStartDate: new FormControl(null, [Validators.required]),
        userProjectEndDate: new FormControl(null, [Validators.required]),
        userProjectLink: new FormControl('', [Validators.pattern(ConstString.PATTERN_URL)])
      });
    }
  }

  showNewProjectForm(indexProject: number = null): void {
    this.formNewProject.reset();
    if (indexProject != null) {
      const projectToEdit = this.userSession.userProjects[indexProject];
      this.fieldEdit = 'projects';
      this.headerText = 'Editar proyecto';
      this.formNewProject.get('userProjectTitle').setValue(projectToEdit.title);
      this.formNewProject.get('userProjectAbstract').setValue(projectToEdit.abstract);
      this.formNewProject.get('userProjectStartDate').setValue(projectToEdit.startDate);
      this.formNewProject.get('userProjectEndDate').setValue(projectToEdit.endDate);
      this.formNewProject.get('userProjectLink').setValue(projectToEdit.link);
      this.editingProject = true;
      this.indexProjectToEdit = indexProject;
    }

    this.buttonFormActioned = false;
    this.newProjectDialogDisplay = true;
    this.formNewProject.enable();

  }

  edit(): void {
    if (this.permissions.updateAction) {
      this.formGeneral.enable();
      this.showEditButton = false;
    }
  }

  private setIntroData(): void {
    this.introForm.reset();
    this.introForm.get('id').setValue(this.userSession ? this.userSession.id : '');
    this.introForm.get('user_intro').setValue(this.userSession ? this.userSession.userIntro : '');
  }

  private setInterestData(): void {
    this.interestForm.reset();
    this.interestForm.get('id').setValue(this.userSession ? this.userSession.id : '');
    this.interestForm.get('user_interest').setValue(this.userSession.userInterest ? this.userSession.userInterest : []);
  }

  private setSkillData(): void {
    this.skillForm.reset();
    this.skillForm.get('id').setValue(this.userSession ? this.userSession.id : '');
    this.skillForm.get('user_skill').setValue(this.userSession.userSkill ? this.userSession.userSkill : []);
  }

  private chooseHeaderDialog(): void {
    switch (this.fieldEdit) {
      case 'general':
        this.headerText = 'Actualiza tus datos básicos';
        break;
      case 'intro':
        this.headerText = 'Actualiza tu introducción';
        break;
      case 'interest':
        this.headerText = 'Agrega tus intereses';
        break;
      case 'discipline':
        this.headerText = 'Actualiza tus disciplinas';
        break;
      case 'skill':
        this.headerText = 'Actualiza tus habilidades';
        break;
      case 'curriculum vitae':
        this.headerText = 'Actualiza tu hoja de vida';
        break;
      case 'projects':
        this.headerText = 'Agrega un proyecto';
        break;
      default:
        this.headerText = 'Actualiza tu información';
        break;
    }
  }

  private formatStates(): void {
    if (this.availableStates.length > 0) {
      if (this.availableStates[0].name.indexOf('Department') >= 0) {
        this.states = UtilitiesList.replaceTextFieldArrayAny(this.availableStates, 'name', ' Department', '');
      } else if (this.availableStates[0].name.indexOf('District') >= 0) {
        this.states = UtilitiesList.replaceTextFieldArrayAny(this.availableStates, 'name', ' District', '');
      } else if (this.availableStates[0].name.indexOf('Province') >= 0) {
        this.states = UtilitiesList.replaceTextFieldArrayAny(this.availableStates, 'name', ' Province', '');
      } else if (this.availableStates[0].name.indexOf('Region') >= 0) {
        this.states = UtilitiesList.replaceTextFieldArrayAny(this.availableStates, 'name', ' Region', '');
      } else {
        this.states = this.availableStates;
      }
    }
  }

  processSaved(): void {
    this.buttonFormActioned = true;
    switch (this.fieldEdit) {
      case'projects':
        this.saveNewProject();
        break;
      case'curriculum vitae':
        this.saveCurriculumVitaeUser().then();
        break;
      default:
        this.saveNewInfoUser();
        break;
    }
  }

  getCities(): void {
    if (this.cities === undefined || this.cities.length <= 1) {
      this.geographicalLocationService.getCities(this.formGeneral.value.user_country.iso2, this.formGeneral.value.user_department.iso2)
        .then(res => {
          if (res.length > 0) {
            this.cities = res;
            this.hiddenCities = false;
          } else {
            this.hiddenCities = true;
          }
        });
    }
  }

  reseatDropdownCities(): void {
    if (this.formGeneral.value.user_department.iso2 !== this.userSession.userDepartment.iso2) {
      this.cities = undefined;
      this.formGeneral.get('user_municipality').setValue(undefined);
      this.getCities();
    }
  }

  private hasStates(): void {
    this.geographicalLocationService.getStates(this.formGeneral.value.user_country.iso2)
      .then(res => {
        if (res.length > 0) {
          this.availableStates = res;
          this.hiddenStates = false;
        } else {
          this.hiddenStates = true;
        }
      });
  }

  private async saveCurriculumVitaeUser(): Promise<any> {
    await this.sendCurriculumVitae();
    this.partialUserUpdate(this.userAdapter.adaptUpdateCurriculumVitae(this.userSession.userCurriculumVitae));
  }

  onSelectFile(event, photo): void {
    this.uploadedFiles = [];
    for (const file of event.files) {
      if (file.type === 'application/pdf') {
        if (file.size <= 1024000) {
          this.uploadedFiles.push(file);
          this.validFile = true;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, ConstString.MESSAGE_FILE_1MB);
        }
      } else {
        this.messagerService.showToast(EnumLevelMessage.WARNING, 'Tipo de archivo no válido');
      }
      photo.clear();
    }
  }

  private async sendCurriculumVitae(): Promise<any> {
    if (this.uploadedFiles.length !== 0) {
      const uploadAttachments = new SendAttachments(this.fileService);
      await uploadAttachments.sendAttachments(this.uploadedFiles, this.userSession.instId).then(response => {
        if (response.status) {
          this.userSession.userCurriculumVitae = response.data.id;
          this.utilitiesConfigString.ls.set('user', this.userSession);
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
        }
      }).catch(_ => {
        this.buttonFormActioned = false;
      }).finally(() => {
        this.buttonFormActioned = false;
      });
    }
  }

  saveSkill(): void {
    const skillUser = this.skillForm.value;
    this.partialUserUpdate(skillUser);
  }

  saveInterest(): void {
    const interestUser = this.interestForm.value;
    this.partialUserUpdate(interestUser);
  }

  private initCareerUniversity(): void {
    this.universityCareerService.getAllUniversityCareer()
      .then(response => {
        if (response.status) {
          this.listUniversityCareers = this.universityCareerAdapter.adaptList(response.data);
        } else {
          this.addUniversityCareersDefault();
        }
      })
      .catch(_ => {
        this.addUniversityCareersDefault();
      });
  }

  private addUniversityCareersDefault(): void {
    this.listUniversityCareers = new Array<UniversityCareerModel>();
    this.listUniversityCareers.push(this.userSession.userDegree);
  }

  private saveNewProject(): void {
    if (this.formNewProject.value.userProjectStartDate <= this.formNewProject.value.userProjectEndDate) {
      const projectNewOrEditedAdapted = this.userProjectAdapter.adaptNewProject(this.formNewProject.value);
      let projectsUsers;
      if (this.editingProject) {
        projectsUsers = this.userProjectAdapter.updateProject(this.indexProjectToEdit, this.userSession.userProjects,
          projectNewOrEditedAdapted);
      } else {
        projectsUsers = this.userProjectAdapter.adaptAddProject(this.userSession.userProjects, projectNewOrEditedAdapted);
      }
      const projectUsersAdaptedSend = this.userProjectAdapter.adaptArrayObjectSend(projectsUsers);

      this.userServices.partialUserUpdate(projectUsersAdaptedSend, this.userSession.id)
        .then(response => {
          if (response.status) {
            this.userSession.userProjects = this.userProjectAdapter.adaptList(response.data.user_projects);
            this.utilitiesConfigString.ls.set('user', this.userSession);
            this.startDateProject = null;
            this.EndDateProject = null;
            this.formNewProject.reset();
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Proyecto agregado con éxito!');
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
          }
        }).finally(() => {
        this.newProjectDialogDisplay = false;
        this.buttonFormActioned = false;
      });
    } else {
      this.formNewProject.get('userProjectEndDate').setErrors({noValidDate: true});
      this.messagerService.showToast(EnumLevelMessage.ERROR, 'La fecha de finalización debe ser mayor o igual a la fecha de inicio');
      this.buttonFormActioned = false;
    }
  }

  private saveNewInfoUser(): void {
    const dataUpdatedUser = this.formGeneral.value;
    this.partialUserUpdate(this.userAdapter.adaptDataUpdatedUser(dataUpdatedUser));
  }

  saveIntro(): void {
    const introUser = this.introForm.value;
    this.partialUserUpdate(introUser);
  }

  private partialUserUpdate(fieldToUpdate: any): void {
    this.buttonFormActioned = true;
    this.userServices.partialUserUpdate(fieldToUpdate, this.userSession.id)
      .then(res => {
        if (res.status) {
          this.utilitiesConfigString.ls.set('user', this.userAdapter.adaptObjectReceive(res.data));
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Actualización exitosa!');
          this.updateList.emit();
          this.editProfileDialogDisplay = false;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      }).finally(() => {
      this.buttonFormActioned = false;
    });
  }
}

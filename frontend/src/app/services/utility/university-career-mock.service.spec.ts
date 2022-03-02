import {UniversityCareerModel} from '../../models/utility/university-career.model';

export class UniversityCareerMockService {
  private universityCareerArchitecture = new UniversityCareerModel(
    'cff8fd61-24ab-40da-a3df-583f3445bda7',
    'Arquitectura'
  );
  private universityCareerEngineer = new UniversityCareerModel(
    'cff8fd61-24ab-40da-a3df-583f3445bda7',
    'Ingeniero'
  );

  public getAllUniversityCareer(): Promise<any> {
    return new Promise((resolve) => {
      resolve([this.universityCareerArchitecture, this.universityCareerEngineer]);
    });
  }

}


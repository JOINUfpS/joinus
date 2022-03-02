import {v4 as uuid} from 'uuid';

export class FileModel {
  constructor(
    public id: uuid,
    public instId: uuid,
    public fileExtension: string,
    public filePath: string,
    public fileSize: string,
    public fileType: string
  ) {
  }
}

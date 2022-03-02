import {Injectable} from '@angular/core';
import {FileService} from '../services/file/file.service';


@Injectable()
export class SendAttachments {

  constructor(private fileService: FileService) {
  }

  sendAttachments(uploadedFiles, instId): Promise<any> {
    if (uploadedFiles.length !== 0) {
      return new Promise((resolve) => {
        const input = new FormData();
        input.append('file_content', uploadedFiles[0]);
        input.append('inst_id', instId);
        this.fileService.saveFile(input)
          .then(res => {
            resolve(res);
          });
      });
    }
  }

}

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityRichText {

  readonly config = {
    toolbar: {
      items: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', '|', 'indent', 'outdent', '|', 'blockQuote', '|', 'undo', 'redo'],
      viewportTopOffset: 30,
      shouldNotGroupWhenFull: true
    },
    placeholder: 'Agrega una descripción o resumen...',
    language: {
      ui: 'es',
      content: 'es'
    }
  };

}

import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare, faHeart, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

const FONTAWESOME = [
  FontAwesomeModule
]

@NgModule({
  declarations: [],
  imports: FONTAWESOME,
  exports: FONTAWESOME
})
export class FontawesomeModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare, faHeart);
  }
}

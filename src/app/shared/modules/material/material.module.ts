import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

const MATERIALS = [
  MatButtonModule,
  MatIconModule
]

@NgModule({
  declarations: [],
  imports: MATERIALS,
  exports: MATERIALS,
})
export class MaterialModule { }

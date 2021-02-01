import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedTagsPipe } from './selected-tags.pipe';
import {SelectedTagsSearchPipe} from './selected-tags-search.pipe';

@NgModule({
  declarations: [SelectedTagsPipe, SelectedTagsSearchPipe],
  imports: [
    CommonModule
  ],
    exports: [SelectedTagsPipe, SelectedTagsSearchPipe]
})
export class PipesModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LRHeaderComponent} from './lrheader/lrheader.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    LRHeaderComponent],
  exports: [
    LRHeaderComponent
  ]
})

export class loginRegisterModule {
}

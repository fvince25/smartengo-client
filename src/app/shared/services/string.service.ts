import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {

  constructor() { }

  public getExcerpt(value: string) : string {

      if (value.length > 120) {
          return value.substring(0, 115) + ' ...';
      } else {
          return value;
      }
  }
}

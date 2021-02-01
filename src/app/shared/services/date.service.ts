import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateService {

    constructor() {
    }

    formatDate(date: string): string {

        var event = new Date(date);
        var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        return event.toLocaleDateString('en-EN', options);

    }
}

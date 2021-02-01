import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'selectedTags',
    pure: false
})
export class SelectedTagsPipe implements PipeTransform {

    transform(tags: any, selected: boolean): any {
        return tags.filter(tag => tag.chosen === selected);
    }

}

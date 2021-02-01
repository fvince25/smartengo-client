import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'selectedTagsSearch',
    pure: false
})
export class SelectedTagsSearchPipe implements PipeTransform {

    transform(tags: any, selected: boolean): any {
        if (tags) {
            return tags.filter(tag => tag.selectedForSearch === selected);
        } else {
            return tags;
        }
    }

}

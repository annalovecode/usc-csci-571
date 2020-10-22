import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {

  transform<T>(value: T[], perGroup: number): T[][] {
    const groups: T[][] = [];
    for (let i = 0; i < value.length; i += perGroup) {
      groups.push(value.slice(i, i + perGroup));
    }
    return groups;
  }

}

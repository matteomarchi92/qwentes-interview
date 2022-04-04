import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(value: String): String {
    let str = value.split(' ').filter(x => x.length > 1).join(' ')
    let regex = /(?!\bmr\.?\b|\bmrs\.?\b)((?<=\s)|(?<=^))(\b[a-z])/ig;
    let matches: any = [...str.match(regex)];

    matches = matches.map(char => char.toUpperCase()).join('');
    return matches;
  }

}

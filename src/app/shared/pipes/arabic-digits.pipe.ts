import { Pipe, PipeTransform } from '@angular/core';
import { toArabicDigits } from '../../core/utils/format.util';

@Pipe({
  name: 'arabicDigits',
  standalone: true,
})
export class ArabicDigitsPipe implements PipeTransform {
  transform(value: string | number | undefined | null): string {
    return toArabicDigits(value);
  }
}

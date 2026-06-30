import { Pipe, PipeTransform, inject } from '@angular/core';
import { toArabicDigits } from '../../core/utils/format.util';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'arabicDigits',
  standalone: true,
  pure: false,
})
export class ArabicDigitsPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(value: string | number | undefined | null): string {
    const isArabic = this.translate.currentLang() === 'ar';
    if (!isArabic) {
      return value === undefined || value === null ? '' : String(value);
    }
    return toArabicDigits(value);
  }
}

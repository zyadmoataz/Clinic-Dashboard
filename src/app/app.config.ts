import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  ErrorHandler,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  Stethoscope,
  Clock,
  BarChart3,
  Calendar,
  DoorOpen,
  Contact,
  Sun,
  Moon,
  LogOut,
  Globe,
  Activity,
  DollarSign,
  Inbox,
  AlertCircle,
  FileSearch,
  Eye,
  Edit,
  Trash,
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslateService({ fallbackLang: 'en' }),
    provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        Users,
        Stethoscope,
        Clock,
        BarChart3,
        Calendar,
        DoorOpen,
        Contact,
        Sun,
        Moon,
        LogOut,
        Globe,
        Activity,
        DollarSign,
        Inbox,
        AlertCircle,
        FileSearch,
        Eye,
        Edit,
        Trash,
      }),
    ),
  ],
};

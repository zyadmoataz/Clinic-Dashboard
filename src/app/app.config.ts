import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Contact,
  Database,
  DoorOpen,
  Edit,
  Eye,
  EyeOff,
  Globe,
  Inbox,
  LayoutDashboard,
  LogOut,
  LucideAngularModule,
  Menu,
  Moon,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  Sun,
  Tag,
  Ticket,
  Trash,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { mockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideRouter(routes),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideHttpClient(withInterceptors([authInterceptor, mockBackendInterceptor])),
    provideTranslateService({ fallbackLang: 'en' }),
    provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    importProvidersFrom(
      LucideAngularModule.pick({
        Activity,
        AlertCircle,
        BarChart3,
        Calendar,
        CheckCircle2,
        ChevronDown,
        Clock,
        Contact,
        Database,
        DoorOpen,
        Edit,
        Eye,
        EyeOff,
        Globe,
        Inbox,
        LayoutDashboard,
        LogOut,
        Menu,
        Moon,
        Plus,
        Printer,
        RefreshCw,
        RotateCcw,
        ShieldCheck,
        Stethoscope,
        Sun,
        Tag,
        Ticket,
        Trash,
        TrendingUp,
        User,
        UserCheck,
        Users,
        X,
      }),
    ),
  ],
};

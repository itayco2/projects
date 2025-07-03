import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/components/page/home/home';

bootstrapApplication(HomeComponent, appConfig)
  .catch((err) => console.error(err));

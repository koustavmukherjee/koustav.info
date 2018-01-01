import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { FruitRageComponent } from './fruit-rage/fruit-rage.component';
import { FruitRageBasicService } from './fruit-rage/fruit-rage-basic.service';


@NgModule({
  declarations: [
    AppComponent,
    FruitRageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot()
  ],
  providers: [FruitRageBasicService],
  bootstrap: [AppComponent]
})
export class AppModule { }

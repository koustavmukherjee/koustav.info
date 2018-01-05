import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { FruitRageComponent } from './fruit-rage/fruit-rage.component';
import { FruitRageBasicService } from './fruit-rage/fruit-rage-basic.service';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [FruitRageBasicService],
  bootstrap: [AppComponent]
})
export class AppModule { }

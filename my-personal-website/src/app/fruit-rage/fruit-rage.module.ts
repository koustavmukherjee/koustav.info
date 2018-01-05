import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FruitRageRoutingModule } from './fruit-rage-routing.module';
import { FruitRageComponent } from './fruit-rage.component';

@NgModule({
  imports: [
    CommonModule,
    FruitRageRoutingModule
  ],
  declarations: [FruitRageComponent]
})
export class FruitRageModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FruitRageComponent } from './fruit-rage.component';

const routes: Routes = [
    {
        path: '', component: FruitRageComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FruitRageRoutingModule { }

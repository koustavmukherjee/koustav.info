import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {FruitRageComponent} from '../fruit-rage/fruit-rage.component';
const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'aboutme' },
            { path: 'aboutme', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'experience', loadChildren: './experience/experience.module#ExperienceModule' },
            { path: 'projects/ai/fruit-rage', loadChildren: '../fruit-rage/fruit-rage.module#FruitRageModule' }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}

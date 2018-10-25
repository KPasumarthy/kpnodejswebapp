import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common'; //KP : Auto-Generated using <ng generate module app-routing --flat --module=app>
/** KP : Additonal Router Modules to be generated */
import { RouterModule, Routes } from '@angular/router';
import { HerosComponent } from './heros/heros.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';

//KP : Constant Routes
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HerosComponent}
];

@NgModule({
  imports: [
    //CommonModule
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [    
  ]
})
export class AppRoutingModule {
}


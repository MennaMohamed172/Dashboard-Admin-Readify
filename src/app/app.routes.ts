import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { NgModule } from '@angular/core';
import { ReviewComponent } from './components/review/review.component';
import { BookComponent } from './components/book/book.component';
import { CopounComponent } from './components/copoun/copoun.component';
import { CategoryComponent } from './components/category/category.component';
import { ChartComponent } from './components/chart/chart.component';
import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';
import { MessageComponent } from './components/message/message.component';
import { DeactivatedUsersComponent } from './components/deactivated-users/deactivated-users.component';
import { SubscribedUsersComponent } from './components/subscribed-users/subscribed-users.component';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  { path: 'chart', component: ChartComponent ,canActivate:[userGuard]},
  { path: 'user', component: UserComponent ,canActivate:[userGuard]},
  { path: 'review', component: ReviewComponent ,canActivate:[userGuard]},
  { path: 'book', component: BookComponent ,canActivate:[userGuard]},
  { path: 'copoun', component: CopounComponent ,canActivate:[userGuard]},
  { path: 'category', component: CategoryComponent ,canActivate:[userGuard]},
  { path: 'deactivated', component: DeactivatedUsersComponent,canActivate:[userGuard] },
  { path: 'subscribedUsers', component: SubscribedUsersComponent ,canActivate:[userGuard]},

  { path: 'login', component: LoginComponent },
  { path: 'order', component: OrderComponent ,canActivate:[userGuard]},

  { path: 'message', component: MessageComponent ,canActivate:[userGuard]},

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { AuthGuardService } from './shared/services/guards/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { AdminComponent } from './components/admin/admin.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { AllBlogsComponent } from './components/admin/all-blogs/all-blogs.component';
import { AddBlogComponent } from './components/admin/add-blog/add-blog.component';
import { UpdateBlogComponent } from './components/admin/update-blog/update-blog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MyinfoComponent } from './components/admin/myinfo/myinfo.component';
import { CategoryComponent } from './components/admin/category/category.component';
import { EmailComponent } from './components/admin/email/email.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SortComponent } from './components/admin/sort/sort.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { CategorySortListComponent } from './components/category-sort-list/category-sort-list.component';
import { QuestionComponent } from './components/question-board/all-question/question.component';
import { AddQuestionComponent } from './components/question-board/add-question/add-question.component';
import { DetailQuestionComponent } from './components/question-board/detail-question/detail-question.component';
import { TestComponent } from './components/test/test.component';

import { TreeModule } from 'angular-tree-component';
import { Test3Component } from './components/test3/test3.component';
import { ChartsComponent } from './components/charts/charts.component';


const routes: Routes = [
  { path: '', component: RedirectComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomepageComponent },
      // {path:'home', redirectTo: '', pathMatch: 'full' },
      // {path:'search-list/:content',component:SearchListComponent},
      { path: 'search-list', component: SearchListComponent },
      { path: 'category-list', component: CategorySortListComponent },
      // {path:'category-list/:category',component:CategorySortListComponent},
      { path: 'question-list', component: QuestionComponent },
      { path: 'test', component: TestComponent },
      { path: 'test3', component: Test3Component },
      { path: 'charts', component: ChartsComponent },

      { path: 'question/add-question', component: AddQuestionComponent },
      { path: 'question/:id', component: DetailQuestionComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'blog/:id', component: BlogDetailsComponent },
      {
        path: 'admin', component: AdminComponent,
        canActivate: [AuthGuardService], /*서비스에 의한 접근 제한*/
        children: [
          { path: 'all-blogs', component: AllBlogsComponent },
          { path: 'add-blog', component: AddBlogComponent },
          { path: 'update-blog/:id', component: UpdateBlogComponent },
          { path: 'myinfo', component: MyinfoComponent },
          { path: 'category', component: CategoryComponent },
          { path: 'sort', component: TestComponent },
          { path: 'email', component: EmailComponent },
        ]
      },
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: NotFoundComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes),TreeModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule { }

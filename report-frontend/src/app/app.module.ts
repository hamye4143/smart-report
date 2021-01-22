import { AuthService } from './shared/services/guards/auth.service';
import { AuthGuardService } from './shared/services/guards/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminComponent } from './components/admin/admin.component';
import { MaterialModule } from './modules/material/material.module';
import { AddBlogComponent } from './components/admin/add-blog/add-blog.component';
import { AllBlogsComponent } from './components/admin/all-blogs/all-blogs.component';
import { TagComponent } from './components/tag/tag.component';
import { DialogBodyComponent } from './shared/components/dialog-body/dialog-body.component';
import { AlertDialogBodyComponent } from './shared/components/alert-dialog-body/alert-dialog-body.component';
import { UpdateBlogComponent } from './components/admin/update-blog/update-blog.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MyinfoComponent } from './components/admin/myinfo/myinfo.component';
import { FileComponent } from './components/file/file.component';
import { DndDirective } from './shared/directives/dnd.directive';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LikeComponent } from './components/like/like.component';
import { DownloadsHistoryComponent } from './components/admin/myinfo/downloads-history/downloads-history.component';
import { StarComponent } from './components/star/star.component';
import { DialogStarComponent } from './shared/components/dialog-star/dialog-star.component';
import { MylikeListComponent } from './components/admin/myinfo/mylike-list/mylike-list.component';
import { CategoryComponent } from './components/admin/category/category.component';
import { CommentComponent } from './components/blog-details/comment/comment.component';
import { SanitizeHTMLPipe } from './shared/pipes/sanitize-html.pipe';
import { EmailComponent } from './components/admin/email/email.component';
import { CategoriesComponent } from './components/blog-details/categories/categories.component';
import { ChangeInfoComponent } from './components/admin/myinfo/change-info/change-info.component';
import { TableDialogComponent } from './shared/components/table-dialog/table-dialog.component';
import { DialogService } from './shared/services/dialog/dialog.service';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SortComponent } from './components/admin/sort/sort.component';
import { AddNodeComponent, NewNodeDialog } from './components/admin/sort/sort-dialog/add-node/add-node.component';
import { DeleteNodeComponent } from './components/admin/sort/sort-dialog/delete-node/delete-node.component';
import { EditNodeComponent, EditNodeDialog } from './components/admin/sort/sort-dialog/edit-node/edit-node.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { MenuItemComponent } from './shared/components/menu-item/menu-item.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { LoginFormComponent } from './components/form/login-form/login-form.component';
import { SignFormComponent } from './components/form/sign-form/sign-form.component';
import { DateFilterComponent } from './shared/components/date-filter/date-filter.component';
import { CategorySelectComponent } from './components/admin/add-blog/category-select/category-select.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { CategorySortListComponent } from './components/category-sort-list/category-sort-list.component';
import { AddQuestionComponent } from './components/question-board/add-question/add-question.component';
import { QuestionComponent } from './components/question-board/all-question/question.component';
import { DetailQuestionComponent } from './components/question-board/detail-question/detail-question.component';
import { AnswerCommentComponent } from './components/question-board/answer-comment/answer-comment.component';
import { TestComponent } from './components/test/test.component';
import { EDITABLE_CONFIG, EditableConfig, EditableModule } from '@ngneat/edit-in-place';
import {IvyCarouselModule} from 'angular-responsive-carousel';
// import { TreeModule } from 'angular-tree-component';
import { TreeModule } from '@circlon/angular-tree-component';
import { Test2Component } from './components/test2/test2.component';
import { Test3Component } from './components/test3/test3.component';
import { ChartsComponent } from './components/charts/charts.component';
import { TrendModule } from 'ngx-trend';
import { Test4Component } from './components/test4/test4.component';
import { DisableControlDirective } from './shared/directives/disable-control.directive';
import { EmailHistoryComponent } from './components/admin/myinfo/email-history/email-history.component';
import { ErrorToastrComponent } from './shared/components/notification/error-toastr/error-toastr.component';
import { SuccessToastrComponent } from './shared/components/notification/success-toastr/success-toastr.component';
import { InfoToastrComponent } from './shared/components/notification/info-toastr/info-toastr.component';
import { SearchListOptionComponent } from './components/search-list-option/search-list-option.component';
import { Ng5SliderModule } from 'ng5-slider';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AddBlogComponent,
    AllBlogsComponent,
    TagComponent,
    DialogBodyComponent,
    AlertDialogBodyComponent,
    UpdateBlogComponent,
    HomepageComponent,
    BlogDetailsComponent,
    LoginComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    MyinfoComponent,
    FileComponent,
    DndDirective,
    LayoutComponent,
    LikeComponent,
    DownloadsHistoryComponent,
    StarComponent,
    DialogStarComponent,
    MylikeListComponent,
    CategoryComponent,
    CommentComponent,
    SanitizeHTMLPipe,
    EmailComponent,
    CategoriesComponent,
    ChangeInfoComponent,
    TableDialogComponent,
    StatisticsComponent,
    SortComponent,
    AddNodeComponent,
    DeleteNodeComponent,
    EditNodeComponent,
    NewNodeDialog,
    EditNodeDialog,
    MenuItemComponent,
    SearchListComponent,
    SearchBarComponent,
    QuestionComponent,
    LoginFormComponent,
    SignFormComponent,
    DateFilterComponent,
    CategorySelectComponent,
    LineChartComponent,
    PieChartComponent,
    CategorySortListComponent,
    AddQuestionComponent,
    DetailQuestionComponent,
    AnswerCommentComponent,
    TestComponent,
    Test2Component,
    Test3Component,
    ChartsComponent,
    Test4Component,
    DisableControlDirective,
    EmailHistoryComponent,
    ErrorToastrComponent,
    SuccessToastrComponent,
    InfoToastrComponent,
    SearchListOptionComponent,
    

  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    RichTextEditorAllModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxPaginationModule,
    SlideshowModule,
    NgApexchartsModule,
    EditableModule,
    IvyCarouselModule,
    TreeModule,
    TrendModule,
    Ng5SliderModule,
    AutocompleteLibModule,
    ToastrModule.forRoot(),
    JwtModule.forRoot({
      //모든 HTTP 요청에 헤더 안에 있는 auth_token이 보내질 것임 --> 유저는 CRUD 작업을 할 수 있다. 
      config: {
        tokenGetter: function  tokenGetter() {
             return localStorage.getItem('auth_token');},
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['http://localhost:5000/login']
      }
    }),
    environment.production ? [] : AkitaNgDevtools.forRoot()
  ],
  // providers: [DialogService],
  providers: [DialogService,
    {
      provide: EDITABLE_CONFIG,
      useValue: {
        openBindingEvent: 'click',
        closeBindingEvent: 'click',
      } as EditableConfig,
    },
  ],
  entryComponents: [DialogBodyComponent,AlertDialogBodyComponent, DialogStarComponent, TableDialogComponent, NewNodeDialog, EditNodeDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }

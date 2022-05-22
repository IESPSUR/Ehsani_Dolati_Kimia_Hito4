import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { RegisterComponent } from './register/register.component';
import { NotificationComponent } from './notification/notification.component';
import { HomeComponent } from './home/home.component';
import { FollowsComponent } from './follows/follows.component';
import { PostFormComponent } from './post-form/post-form.component';
import { ContactComponent } from './contact/contact.component';
import { ChatComponent } from './chat/chat.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AdoptionsComponent } from './adoptions/adoptions.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    PostComponent,
    CommentComponent,
    LoginComponent,
    RegisterComponent,
    NotificationComponent,
    HomeComponent,
    FollowsComponent,
    PostFormComponent,
    ContactComponent,
    ChatComponent,
    AdoptionsComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

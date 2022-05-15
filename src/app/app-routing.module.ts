import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { CommentComponent } from './comment/comment.component';
import { ContactComponent } from './contact/contact.component';
import { FollowsComponent } from './follows/follows.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostComponent } from './post/post.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: 'comments/:id', component: CommentComponent},
  {path: 'users', component: UserComponent},
  {path: 'users/:nombreUsuario', component: UserComponent},
  {path: 'animalsAdopted/:nombreUsuario', component: UserComponent},

  {path: 'myProfile', component: UserComponent},
  {path: 'editProfile/:nombreUsuario', component: RegisterComponent},
  {path: 'posts', component: PostComponent},
  {path: 'posts/:id', component: PostComponent},
  {path: 'postsUser/:nombreUsuario', component: PostComponent},
  
  {path: 'adminPosts', component: PostComponent},
  {path: 'editPost/:id', component: PostFormComponent},
  {path: 'createPost', component: PostFormComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'notifications', component: NotificationComponent},
  {path: 'home', component: HomeComponent},
  {path: 'users/:nombreUsuario/followings', component: FollowsComponent},
  {path: 'users/:nombreUsuario/followers', component: FollowsComponent},
  {path: 'myProfile/followings', component: FollowsComponent},
  {path: 'myProfile/followers', component: FollowsComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'chat', component: ChatComponent},

  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

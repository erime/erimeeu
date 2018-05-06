import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {HttpClientModule} from '@angular/common/http'
import {RouterModule, Routes} from '@angular/router'


import {AppComponent} from './app.component'
import {PostListComponent} from './post-list/post-list.component'
import {PostComponent} from './post/post.component'
import {CategoriesListComponent} from './categories-list/categories-list.component'

import {CategoriesService} from './services/categories.service'
import {PostsService} from './services/posts.service'
import {MediaService} from './services/media.service'


const appRoutes: Routes = [
  {
    path: 'categories',
    component: CategoriesListComponent,
    data: {title: 'Categories List'}
  },
  {
    path: 'posts',
    component: PostListComponent,
    data: {title: 'Posts List'}
  },
  {
    path: 'post/:id',
    component: PostComponent,
    data: {title: 'Post'}
  },
  {
    path: '',
    redirectTo: '/posts',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PostListComponent
  }
]


@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    CategoriesListComponent,
    PostComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    )
  ],
  providers: [
    CategoriesService,
    PostsService,
    MediaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

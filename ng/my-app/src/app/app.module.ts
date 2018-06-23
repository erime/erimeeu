import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {HttpClientModule} from '@angular/common/http'
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router'
import {FormsModule} from '@angular/forms'

import {AppComponent} from './app.component'
import {PostListComponent} from './post-list/post-list.component'
import {PostComponent} from './post/post.component'
import {CategoriesListComponent} from './categories-list/categories-list.component'

import {CategoriesService} from './services/categories.service'
import {PostsService} from './services/posts.service'
import {MediaService} from './services/media.service'
import {SocialService} from './services/social.service'
import {CustomReuseStrategy} from './shared/routing'


declare var Hammer: any

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pan': {direction: Hammer.DIRECTION_HORIZONTAL},
    'swipe': {direction: Hammer.DIRECTION_HORIZONTAL}
  }

  buildHammer(element: HTMLElement) {
    delete Hammer.defaults.cssProps.userSelect;
    const mc = new Hammer(element, {
      touchAction: 'auto',
      inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_HORIZONTAL
        }],
        [Hammer.Pan, {
          direction: Hammer.DIRECTION_HORIZONTAL
        }]
      ]
    })
    mc.get('swipe').set({enable: true})
    mc.get('pan').recognizeWith(mc.get('swipe'))
    return mc
  }
}


const appRoutes: Routes = [
  {
    path: 'posts',
    component: PostListComponent,
    data: {title: 'Posts List', key: 'posts'}
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
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  providers: [
    CategoriesService,
    PostsService,
    MediaService,
    SocialService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

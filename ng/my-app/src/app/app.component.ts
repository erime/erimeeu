import {Component, HostListener, Inject} from '@angular/core'
import {DOCUMENT} from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = 'app'

  fixedNav = false

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const element = this.document.documentElement
    const scroll = element.scrollTop
    if (scroll >= 44) {
      this.fixedNav = true
    } else {
      this.fixedNav = false
    }


  }

  onActivate(event) {
    window.scroll(0,0);
  }

}

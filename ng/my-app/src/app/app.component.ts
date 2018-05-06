import {Component, HostListener, Inject} from '@angular/core'
import {DOCUMENT} from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = 'app'

  smallHeader = false

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const element = this.document.scrollingElement
    const scroll = element.scrollTop
    if (scroll >= 10) {
      this.smallHeader = true
    } else {
      this.smallHeader = false
    }

  }

}

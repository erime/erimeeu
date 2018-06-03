import {Component, HostListener, Inject, OnInit} from '@angular/core'
import {DOCUMENT} from '@angular/common'
import {ActivatedRoute, Router} from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit {

  title = 'app'

  fixedNav = false
  searchString: string

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private route: ActivatedRoute) {
  }

  search() {
    console.log(this.searchString)
    if(this.searchString) {
      this.router.navigate(['/posts'],{ queryParams: { search: this.searchString } })
    } else {
      this.router.navigate(['/posts'])
    }
  }

  ngOnInit(): void {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.searchString = params['search']
      })
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
    window.scroll(0,0)
  }

}

import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'erime-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'app';

  fixedNav = false;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = this.document.documentElement;
    const scroll = element.scrollTop;
    this.fixedNav = scroll >= 44;
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

}

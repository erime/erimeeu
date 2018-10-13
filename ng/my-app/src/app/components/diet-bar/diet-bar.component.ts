import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../services/post';
import {Category} from '../../services/category';

@Component({
  selector: 'erime-diet-bar',
  templateUrl: './diet-bar.component.html',
  styleUrls: ['./diet-bar.component.scss']
})
export class DietBarComponent implements OnInit {

  @Input() diets: Category[];

  constructor() { }

  ngOnInit() {
  }

}

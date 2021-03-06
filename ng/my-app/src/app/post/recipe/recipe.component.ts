import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../services/post';

@Component({
  selector: 'erime-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  @Input() post: Post;

  constructor() {
  }

  ngOnInit() {
  }

}

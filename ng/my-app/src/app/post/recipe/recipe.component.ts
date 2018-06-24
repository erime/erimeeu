import {Component, Input, OnInit} from '@angular/core'
import {Post} from '../../services/post'

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.less']
})
export class RecipeComponent implements OnInit {

  @Input() post: Post

  constructor() { }

  ngOnInit() {
  }

}

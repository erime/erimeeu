import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../services/post';

@Component({
  selector: 'erime-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  @Input() post: Post;

  constructor() {
  }

  clearShoppingList() {
    if (this.post.shoppingList && this.post.shoppingList.length > 0) {
      for (const ingredient of this.post.shoppingList) {
        ingredient.checked = false;
      }
    }
  }

  copyIngredients() {
    const selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.post.acf.ingredients;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();

    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnInit() {
  }

}

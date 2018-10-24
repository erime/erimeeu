import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../services/category';

@Component({
  selector: 'erime-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input() selectedDishType = undefined;
  @Input() last = false;
  @Input() menuExpanded = false;

  @Output() dishTypeChanged  = new EventEmitter();

  @Input() dish: Category;

  constructor() {
  }

  active(): boolean {
    return this.selectedDishType === this.dish.id;
  }

  selectDishType() {
    this.dishTypeChanged.emit(this.dish.id);
  }

  ngOnInit() {
  }

}

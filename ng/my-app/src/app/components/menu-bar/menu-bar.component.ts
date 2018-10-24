import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriesService} from '../../services/categories.service';
import {Category} from '../../services/category';

enum Status {
  LOADING = 'loading', SUCCESS = 'success', ERROR = 'error'
}

@Component({
  selector: 'erime-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  @Input() fixedNav = false;

  selectedDishType: number;
  recipeSelectorExpanded = false;

  searchString: string;
  searchExpanded = false;

  dishTypes: Category[];
  dishTypesLoadStatus: string;

  constructor(private router: Router, private route: ActivatedRoute, private _categoriesService: CategoriesService) { }

  selectDishType(type: number) {
    this.recipeSelectorExpanded = !this.recipeSelectorExpanded && (!type || this.selectedDishType === type);
    this.selectedDishType = type;
    this.router.navigate(['/posts'], {queryParams: {dishType: this.selectedDishType}});
  }

  search() {
    if (!this.searchExpanded) {
      this.searchExpanded = true;
    } else if (this.searchString) {
      this.router.navigate(['/posts'], {queryParams: {search: this.searchString}});
    } else {
      this.router.navigate(['/posts']);
      this.searchExpanded = false;
    }
  }

  getDishTypes() {
    this.dishTypesLoadStatus = Status.LOADING;
    this._categoriesService.getDishTypes().subscribe(data => {
      this.dishTypes = data;
      this.dishTypesLoadStatus = Status.SUCCESS;
    }, err => {
      this.dishTypesLoadStatus = Status.ERROR;
    });
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.selectedDishType = +params['dishType'];
        this.searchString = params['search'];
      });

    this.getDishTypes();
  }

}

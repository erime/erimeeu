import {Component, OnInit} from '@angular/core';
import {CategoriesService} from '../services/categories.service'

import {Category} from '../services/category'

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.less']
})


export class CategoriesListComponent implements OnInit {

  //let CAT_DIET_ID = 469;
  categories: Category[]
  diets: Category[]
  
  categoriesLoadStatus: string
  dietsLoadStatus: string

  constructor(private _categoriesService: CategoriesService) {
    
  }

  getDiets() {
    this.dietsLoadStatus = 'loading'
    this._categoriesService.getDiets().subscribe(data => {
        this.diets = data;
        this.dietsLoadStatus = 'success'
        }, err => {
          this.dietsLoadStatus = 'error'
        });
  }

  isDiet(id: number): boolean {
    if (this.diets) {
      for (let i = 0; i < this.diets.length; i++) {
        if (this.diets[i].id === id) {
          return true
        }
      }
    }
    return false
  }
  
  getCategories() {
    this.categoriesLoadStatus = 'loading'
    this._categoriesService.getCategories().subscribe(data => {
        this.categories = data;
        this.categoriesLoadStatus = 'success'
        }, err => {
          this.categoriesLoadStatus = 'error'
        });
  }

  ngOnInit() {
    this.getCategories()
    this.getDiets()
  }

}

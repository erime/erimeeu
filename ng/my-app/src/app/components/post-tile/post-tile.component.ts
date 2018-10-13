import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../services/post';

@Component({
  selector: 'erime-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.scss']
})
export class PostTileComponent implements OnInit {

  @Input() post: Post;

  constructor() {
  }

  ngOnInit() {
  }

}

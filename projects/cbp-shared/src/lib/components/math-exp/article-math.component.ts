import { Component, Input, OnInit } from '@angular/core';
import { MathJaxService } from './mathJax.service';

export class MathModel {
  equation!: string;
}

@Component({
  selector: 'ds-article-exe-math',
  template: `<p class="ArticleMath__content" id="{{generatedId}}" style="word-break: break-all;" >\`{{content.equation}}\`</p>`,
  styles:[`
   :host ::ng-deep .mjx.chtml{
    white-space: pre-line !important;
    overflow-wrap: breakword;
   }
   :host ::ng-deep .mjx-chtml{
    white-space: pre-line !important;
    overflow-wrap: breakword;
   }
   :host ::ng-deep .MathJax_CHTML{
    white-space: pre-line !important;
    overflow-wrap: breakword;
   }
   
  `]
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleExeMath implements OnInit {
  // @HostBinding('class.ArticleMath') rootClass: boolean = true;

  @Input() content!: MathModel;

  public generatedId:string = `math-${Math.floor(Math.random()*10000)}`;

  constructor(public mathJaxService:MathJaxService) {}

  ngOnInit() {
    this.mathJaxService.renderEquation(`#${this.generatedId}`);
  }
}

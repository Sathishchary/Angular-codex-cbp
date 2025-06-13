import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ExecutionService } from '../../services/execution.service';
declare var $: any;

@Component({
  selector: 'lib-copy-from-word',
  templateUrl: './copy-from-word.component.html',
  styleUrls: ['./copy-from-word.component.css']
})
export class CopyFromWordComponent implements OnInit, AfterViewInit {
  @Input() initialData: any; // To receive data from the parent
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();

  constructor(public executionService: ExecutionService) { }
  ngAfterViewInit(): void {
    if(this.initialData == this.executionService.wordHtml){
      $('#wordData').html(this.executionService.wordHtml);
    }else{
    $('#wordData').html(this.initialData);
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem("tableRow") !== null) {
      localStorage.removeItem("tableRow");
    }
  }

  parseData() {

  }
  Clear() {
    this.executionService.wordData = [];
    this.executionService.wordHtml = '';
    $('#wordData').html('');
    console.log('clear called in copy word')
  }
  save() {
    let html = $('#wordData').html();
    if (html) {
      this.executionService.wordHtml = html;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      let obj = [].map.call(doc.querySelectorAll('tr'), (tr: any) => {
        return [].slice.call(tr.querySelectorAll('td')).reduce((a: any, b: any, i: any) => {
          return a.push(b.textContent), a;
        }, []);
      });
      this.executionService.wordData = obj;
    }
    this.closeEvent.emit({wordData:this.executionService.wordData,wordHtml:this.executionService.wordHtml});
  }
  cancel() {
    this.closeEvent.emit(false);
  }
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'v') {
    } else {
      event.preventDefault(); 
    }
  }

}

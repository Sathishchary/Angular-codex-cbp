import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message, StickyNote } from '../../models';

@Component({
  selector: 'app-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.css']
})
export class StickyNoteComponent implements OnInit {
  @Input() stickyNote: any;
  @Input() userName: any;
  @Input() selectedElement: any;
  @Output() stickyNoteChange: EventEmitter<any> = new EventEmitter<any>();
  stickyColors = ["#FFE66E", "#FF0000", "#4e4ec3", "#D7AFFF", "#00ff00", "#E0E0E0", "#FFF"]
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];
      if (propName === 'stickyNote' && change.currentValue) {
        this.stickyNote = change.currentValue;
        if (!this.stickyNote?.dgUniqueID) {
          this.stickyNote['dgUniqueID'] = new Date().getTime();
        }
      }
      if (propName === 'userName' && change.currentValue) {
        this.userName = change.currentValue;
      }
      if (propName === 'selectedElement' && change.currentValue) {
        this.selectedElement = change.currentValue;
      }
    }
  }

  ngOnInit(): void {
  }

  setMessage(i: number, messageObj: any) {
    this.stickyNote.messageArray[i].messageAdded = true;
    this.stickyNote.TxnId = new Date().getTime() + this.stickyNote.messageArray.length;
    this.stickyNote.messageArray[i].userName = this.userName;
    this.stickyNote.messageArray[i].currentDate = new Date();
    this.stickyNote.messageArray.push(new Message());
    this.setSticky(true);

  }
  clearMessage(i: number, messageObj: any) {
    this.stickyNote.messageArray[i].message = '';
    this.stickyNote.messageArray[i].messageAdded = false;
    this.setSticky(false);
  }
  clearSticky() {
    this.stickyNote = new StickyNote();
    this.stickyNote['deleted'] = true;
    this.setSticky(false);
  }

  setSticky(checked?: boolean) {
    this.stickyNoteChange.emit({ stickyNote: this.stickyNote, changed: checked });
  }

}

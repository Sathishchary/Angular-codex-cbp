import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ExecutionService } from '../../services/execution.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css'],
})
export class ShowUsersComponent implements OnInit {
  @Input() isFormView = true;
  @Input() customUsers!: any;
  @Output() notifyParentEvent: EventEmitter<any> = new EventEmitter();
  constructor(public executionService: ExecutionService) {}

  ngOnInit() {}

  existingSecurityUser(itemObj: any, typeValue: any) {
    this.notifyParentEvent.emit({ item: itemObj, type: typeValue });
  }
}

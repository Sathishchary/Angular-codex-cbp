import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-yubikey',
  templateUrl: './yubikey.component.html',
  styleUrls: ['./yubikey.component.css']
})
export class YubikeyComponent implements OnInit {
  @Output() closeEvent: EventEmitter<any> =  new EventEmitter();

  yubikeyPin = '';

  constructor() { }

  ngOnInit(): void { 
  }
  validatePin() {
    this.closeEvent.emit(this.yubikeyPin);
  }

  closeModal() {
    console.log('close');
    this.closeEvent.emit('');
  }

}

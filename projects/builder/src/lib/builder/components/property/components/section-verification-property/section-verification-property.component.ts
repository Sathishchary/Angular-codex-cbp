import { Component, OnInit } from '@angular/core';
import { CbpService } from '../../../../services/cbp.service';
@Component({
  selector: 'lib-section-verification-property',
  templateUrl: './section-verification-property.component.html',
  styleUrls: ['./section-verification-property.component.css']
})
export class SectionVerificationPropertyComponent implements OnInit {
   
  constructor(public cbpService: CbpService) { }

  ngOnInit(): void {
  }

}

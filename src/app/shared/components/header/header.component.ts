import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() menuId: string = 'main-menu';
  @Input() showBackButton: boolean = false;
  @Input() defaultHref: string = '/';
  @Output() backClick = new EventEmitter<void>();

  constructor(private location: Location) { }

  ngOnInit() {}

  onBackClick() {
    if (this.backClick.observers.length > 0) {
      this.backClick.emit();
    }
    // Si no hay listeners, el ion-back-button manejará la navegación automáticamente
  }

  goBack() {
    if (this.backClick.observers.length > 0) {
      this.backClick.emit();
    } else {
      this.location.back();
    }
  }

}

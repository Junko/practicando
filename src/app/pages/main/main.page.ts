import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
    standalone: false
})
export class MainPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Redirigir automáticamente a home
    this.router.navigate(['/main/home']);
  }

}

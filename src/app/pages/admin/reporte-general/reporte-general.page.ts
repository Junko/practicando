import { Component, OnInit } from '@angular/core';
import { TabsConfig } from 'src/app/shared/models/tab-config.model';
import { ADMIN_TABS_CONFIG } from 'src/app/shared/configs/tabs-configs';

@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.page.html',
  styleUrls: ['./reporte-general.page.scss'],
  standalone: false
})
export class ReporteGeneralPage implements OnInit {

  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  constructor() { }

  ngOnInit() {
  }

}

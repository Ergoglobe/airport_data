import { Component, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AirportInputComponent, Airport_Row } from './airport-input/airport-input.component';

import { AirportDistanceTableComponent } from "./airport-distance-table/airport-distance-table.component";

import { CsvDataComponent } from './csv-data/csv-data.component';

import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, AirportInputComponent, AirportDistanceTableComponent, MatToolbarModule, CsvDataComponent]
})

export class AppComponent {
  title = 'airport_data';
  airport_table: Airport_Row[] = [];

  // airport_table_event: EventEmitter<Airport_Row[]> = new EventEmitter<Airport_Row[]>();

  receive_airport_table( $event: Airport_Row[] ) {

    this.airport_table = $event;

  }

}


import { Component, EventEmitter, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatOptionModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import { all_airport_data } from '../../assets/all-airport-data';

import haversineDistance from 'haversine-distance';

export type Airport_Row = {
  LocID: string;
  Distance: number;
  Name: string;
  City: string;
  StateID: string | undefined;
};

@Component({
  selector: 'app-airport-input',
  standalone: true,
  imports: [CommonModule, MatAutocompleteModule, MatOptionModule, MatInputModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './airport-input.component.html',
  styleUrl: './airport-input.component.css'
})
export class AirportInputComponent {
  airport_input_control = new FormControl('');
  airport_loc_ids: string[] = new Array();
  filtered_airport_loc_ids: Observable<string[]> | undefined;
  airport_table: Airport_Row[] = new Array<Airport_Row>();
  @Output() airport_table_event = new EventEmitter< Airport_Row[] >();

  ngOnInit(){

    for ( var airport of all_airport_data.Airports ){
      this.airport_loc_ids.push( airport['Loc Id'] )
    }

    this.filtered_airport_loc_ids = this.airport_input_control.valueChanges.pipe(
      startWith(''),
      map( value => this._filter( value || '' )),
    );
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.airport_loc_ids.filter(option => option.toLowerCase().includes(filterValue));
  }

  airport_selected( departure_airport_loc_id: string) {

    // reset airport_table
    this.airport_table = new Array<Airport_Row>();

    console.log( "Selected Departure Airport: " + departure_airport_loc_id );

    var departure_airport;

    for ( var airport of all_airport_data.Airports ){
      if ( airport['Loc Id'] == departure_airport_loc_id ){
        departure_airport = airport;
      }
    }    

    console.log( "Found Departure Airport: " + departure_airport?.['Loc Id'] );

    for ( var destination_airport of all_airport_data.Airports ){

      var StateID;

      // not every entry has a state ID
      if ( destination_airport["State Id"] == undefined ){
        StateID = "XX";
      } else
      {
        StateID = destination_airport["State Id"];
      }

      this.airport_table.push( {
        LocID: destination_airport["Loc Id"],
        Name: destination_airport["Name"],
        Distance: this.distance_between_airports( departure_airport, destination_airport),
        StateID: StateID,
        City: destination_airport["City"],
      });

    } 

    // console.log( this.airport_table );

    this.airport_table_event.emit( this.airport_table );

  }

  convert_hms_to_coordinate( ARP_coordinate:string ){
    var h = ARP_coordinate.split( '-' )[0];
    var m = ARP_coordinate.split( '-' )[1];
    var s = ARP_coordinate.split( '-' )[2];

    var coordinate = parseFloat(h) + parseFloat(m) / 60.0000 + parseFloat( s.slice(0, -1) ) / 3600.0000;

    if ( [ "N", "E" ].includes( ARP_coordinate.slice( -1 ) )) {
      return coordinate;
    } else {
      return -coordinate;
    }
    
  }

  distance_between_airports( departure_airport: { "Loc Id": string; "State Id": string; City: string; Name: string; Use: string; "ARP Latitude": string; "ARP Latitude Sec": string; "ARP Longitude": string; "ARP Longitude Sec": string; Elevation: string; } | { "Loc Id": string; City: string; Name: string; Use: string; "ARP Latitude": string; "ARP Latitude Sec": string; "ARP Longitude": string; "ARP Longitude Sec": string; Elevation: string; "State Id"?: undefined; } | undefined, destination_airport: { "Loc Id": string; "State Id": string; City: string; Name: string; Use: string; "ARP Latitude": string; "ARP Latitude Sec": string; "ARP Longitude": string; "ARP Longitude Sec": string; Elevation: string; } | { "Loc Id": string; City: string; Name: string; Use: string; "ARP Latitude": string; "ARP Latitude Sec": string; "ARP Longitude": string; "ARP Longitude Sec": string; Elevation: string; "State Id"?: undefined; } ){
    
    if ( departure_airport != null )
    {
      var departure_lat_long = {latitude: this.convert_hms_to_coordinate(departure_airport["ARP Latitude"]), longitude:this.convert_hms_to_coordinate(departure_airport["ARP Longitude"]) };
      var destination_lat_long = {latitude: this.convert_hms_to_coordinate(destination_airport["ARP Latitude"]), longitude:this.convert_hms_to_coordinate(destination_airport["ARP Longitude"]) };

      var distance = parseFloat((haversineDistance( departure_lat_long, destination_lat_long ) * 0.000539957).toFixed(3)); // meters to NM

      return distance;
    } else {
      return 99999; // error
    }

  }

}

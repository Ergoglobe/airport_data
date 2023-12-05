import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxCsvParser, NgxCsvParserModule } from 'ngx-csv-parser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-csv-data',
  standalone: true,
  imports: [CommonModule, NgxCsvParserModule],
  templateUrl: './csv-data.component.html',
  styleUrl: './csv-data.component.css'
})
export class CsvDataComponent {
  csvData: string = "";

  constructor(private http: HttpClient, private papa: Papa ) {
  }

  ngOnInit() {
    this.http
       .get("/assets/all-airport-data.csv", {responseType: 'text'})
       .pipe(
          // map((res: any) => res.json())
       )
       .subscribe(data => {

          const json = this.papa.parse( data, { header: true, delimiter: ',', escapeChar: '"', } )
          console.log(json);

          // this.csvData = data;
          // console.log( this.csvData );
       });



  }

}

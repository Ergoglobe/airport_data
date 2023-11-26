import { AfterViewInit, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
//import { AirportDistanceTableDataSource } from './airport-distance-table-datasource';
import { Airport_Row } from '../airport-input/airport-input.component';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  NONE = ''
}

@Component({
  selector: 'app-airport-distance-table',
  templateUrl: './airport-distance-table.component.html',
  styleUrls: ['./airport-distance-table.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule]
})
export class AirportDistanceTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, {static: false }) table!: MatTable<Airport_Row>;
  //dataSource = new AirportDistanceTableDataSource();
  dataSource: MatTableDataSource<Airport_Row> = new MatTableDataSource<Airport_Row>();

  @Input() set airport_data( airport_data: Airport_Row[]){
    if( airport_data && airport_data.length > 0 ) {
      // console.log(airport_data);

      this.dataSource.data = airport_data;
      // Do this to update the table
      //this.paginator._changePageSize( this.paginator.pageSize);
      this.paginator.pageIndex = 0;

    }
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['LocID', 'Distance', 'Name', 'City', 'StateID'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.table.dataSource = this.dataSource;
  }
}

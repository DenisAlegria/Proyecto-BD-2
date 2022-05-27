import { Component, OnInit } from '@angular/core';
import { QuerysService } from '../services/querys.service';
import { QueryInterface } from 'src/interfaces/querys.interfaces';


@Component({
  selector: 'app-querys',
  templateUrl: './querys.component.html',
  styleUrls: ['./querys.component.css']
})
export class QuerysComponent implements OnInit {
  baseDeDatos: QueryInterface;
  tablas: any[] = [];
  ejecucion!: QueryInterface;

  respuesta1: any;
  respuesta2: any;

  constructor(private querysService: QuerysService) {
    this.baseDeDatos = JSON.parse(localStorage.getItem('baseDeDatos') || '{}');
    this.ejecucion = {'user':'admin','password':'p9ai5bOGQGIckKRnRqA1','sql':''};
  }

  ngOnInit(): void {
    console.log(this.ejecucion);
    //Tablas de la base de datos en el esquema
    this.baseDeDatos.sql = 'SHOW TABLES;'
    this.querysService.obtenerTablas(this.baseDeDatos).subscribe(data => {
      let respuesta = data as any;
      this.tablas = respuesta.ResultSet;
      console.log(this.tablas)
    });
  }

  ejecutarQuery(ejecucion:QueryInterface){
    this.ejecucion.sql = ejecucion.sql;
    this.querysService.ejecutarQuery(this.ejecucion).subscribe(data => {
      let respuesta = data as any;
      this.respuesta1 = respuesta.Status;
      this.respuesta2 = JSON.stringify(respuesta.ResultSet);
      console.log(respuesta);

    });
    console.log(ejecucion);

  }

}

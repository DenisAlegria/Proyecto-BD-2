import { Component, OnInit } from '@angular/core';
import { QuerysService } from '../services/querys.service';
import { QueryInterface } from 'src/interfaces/querys.interfaces';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-querys',
  templateUrl: './querys.component.html',
  styleUrls: ['./querys.component.css']
})
export class QuerysComponent implements OnInit {
  baseDeDatos: QueryInterface;
  tablas: any[] = [];
  ejecucion!: QueryInterface;
  tabla: boolean = false;
  textArea: boolean = true;

  respuesta1: any;
  respuesta2: any;


  headers: any;
  body: any[] = [];

  constructor(private querysService: QuerysService, private salir: AppComponent) {
    this.baseDeDatos = JSON.parse(localStorage.getItem('baseDeDatos') || '{}');
    this.ejecucion = { 'user': 'admin', 'password': 'abc12345', 'sql': '' };
    console.log(this.baseDeDatos);
    if (this.baseDeDatos.password == "abc12345") {
      this.salir.salir = true;
      console.log(this.baseDeDatos);
    } else {
      alert('No tiene permisos para acceder a esta pagina');
      location.href = '/';
    }
  }

  ngOnInit(): void {
    console.log(this.ejecucion);
    //Tablas de la base de datos en el esquema
    this.baseDeDatos.sql = 'SHOW TABLES;'
    this.querysService.obtenerTablas(this.baseDeDatos).subscribe(data => {
      let respuesta = data as any;
      this.tablas = respuesta.resultset;
      console.log(this.tablas)
    });
  }

  ejecutarQuery(ejecucion: QueryInterface) {
    this.respuesta1 = null;
    console.log(this.baseDeDatos);
    this.ejecucion.sql = ejecucion.sql;
    this.querysService.ejecutarQuery(this.ejecucion).subscribe(data => {
      let respuesta = data as any;
      this.respuesta1 = respuesta.status;

      //validacion de errores y asignacion a respuestas
      if (respuesta.error == '' && respuesta.resultset != null) {
        this.headers = Object.keys(respuesta.resultset[0]);
        respuesta.resultset.forEach((element: { [s: string]: unknown; } | ArrayLike<unknown>) => {
          console.log(Object.values(element));
          this.body.push(Object.values(element));
          console.log(this.body);
        });
        this.respuesta2 = JSON.stringify(respuesta.resultset);
        console.log(this.respuesta2);
        this.tabla = true;
        this.textArea = false;
      }
      if (respuesta.resultset == null) {
        this.respuesta2 = respuesta.error;
        this.tabla = false;
        this.textArea = true;
        console.log(this.respuesta2);
      }
      if (respuesta.error == '' && respuesta.resultset == null) {
        this.tabla = false;
        this.textArea = true;
        //location.href = '/query';
        this.tablas = [];
        this.querysService.obtenerTablas(this.baseDeDatos).subscribe(data => {
          let respuesta = data as any;
          this.tablas = respuesta.resultset;
          console.log(this.tablas)
        });
      }
      console.log(respuesta);
    });

    console.log(ejecucion);
    this.headers = [];
    this.body = [];


  }

}

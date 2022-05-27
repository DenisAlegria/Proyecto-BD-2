import { Component, OnInit } from '@angular/core';
import { QueryInterface } from 'src/interfaces/querys.interfaces';
import { QuerysService } from 'src/app/services/querys.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  query!: QueryInterface;
  basesDeDatos: any[] = [];
  modelo: any = {user:'',password:'',sql:''};

  constructor(private querysService: QuerysService) { 
    this.query={
      user: 'admin',
      password: 'p9ai5bOGQGIckKRnRqA1',
      sql: 'SHOW DATABASES;'
    };

    this.querysService.obtenerBd(this.query).subscribe(data => {
      let respuesta = data as any;
      this.basesDeDatos = respuesta.ResultSet;
      console.log(this.basesDeDatos);

    }
    );
  }
  ngOnInit(): void {
    
  }
  ejecutarQuery(baseDeDatos:any){
    localStorage.setItem('baseDeDatos',JSON.stringify(baseDeDatos));
    console.log(baseDeDatos);
    location.href = 'http://localhost:4200/query';
  }

}
3135079610
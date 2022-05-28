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
  modelo: any = { user: '', password: '', sql: '' };

  constructor(private querysService: QuerysService) {
    this.query = {
      user: 'admin',
      password: 'p9ai5bOGQGIckKRnRqA1',
      sql: ''
    };


  }
  ngOnInit(): void {

  }
  ejecutarQuery(modelo: any) {

      this.querysService.obtenerBd(this.modelo).subscribe(data => {
        let respuesta = data as any;
        this.basesDeDatos = respuesta.ResultSet;
        console.log(this.basesDeDatos);


        localStorage.setItem('baseDeDatos', JSON.stringify(modelo));
        console.log(modelo);
        location.href = 'http://localhost:4200/query';
      }
      );
   
     /* alert('Usuario o contraseña incorrectos');
      this.modelo.user = '';
      this.modelo.password = '';
*/
   


  }

}
3135079610
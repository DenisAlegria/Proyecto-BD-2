import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryInterface } from 'src/interfaces/querys.interfaces';

@Injectable({
  providedIn: 'root'
})
export class QuerysService {
  

  constructor(private http: HttpClient) { 
    
}
  obtenerBd(query:QueryInterface){
    return this.http.post('http://localhost:8090/login',query);
  }
  obtenerTablas(query:QueryInterface){
    return this.http.post('http://localhost:8090/execute',query);
  }
  ejecutarQuery(query:QueryInterface){
    return this.http.post('http://localhost:8090/execute',query);
  }


  }



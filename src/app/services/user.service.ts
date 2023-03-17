import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable, of, Subject } from 'rxjs';
import { IUser } from '../interfaces/interface.user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  constructor(private http: HttpClient) {
    this.getAll()
  }
  private apiUrl = 'http://localhost:3000/users'; 
 
  public height:number=window.innerHeight;



  getPart(page: number, itemPrePage:number): Observable<any> {
    const params = new HttpParams().set('_page', page.toString()).set('_limit',itemPrePage.toString());
    return this.http.get<IUser>(this.apiUrl,{params});
  }

  getAll():Observable<IUser[]>{
      return this.http.get<IUser[]>(this.apiUrl)
  }

  getById(id:number|string):Observable<IUser>{    
    return this.http.get<IUser>(`${this.apiUrl}/${id}`)
  } 
  
  getByIds(ids: number[]|string[]):Observable<IUser[]> {
    const requests =ids.map(id => this.http.get<IUser>(`${this.apiUrl}/${id}`));
      return forkJoin(requests).pipe(
        map((users:IUser[])=> users.filter(user => user !== null))
      );
  }


}

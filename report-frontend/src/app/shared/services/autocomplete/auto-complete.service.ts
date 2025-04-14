import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {API_BASE_URL} from "constants/api-url";

export interface IUserResponse {
  total: number;
  results: User[];
}
export class User {
  constructor(public id: number, public name: string) {}
}
@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {
  private searchBarUrl:string = `${API_BASE_URL}/searchBar/`;

  constructor(private http: HttpClient) { }


  search(filter: {name: string} = {name: ''}, page = 1): Observable<IUserResponse> {
    const word = 'agno';
    return this.http.get<IUserResponse>(this.searchBarUrl+word)
    .pipe(
      tap((response: IUserResponse) => {
        console.log('res',response)
        response.results = response.results
          .map(user => new User(user.id, user.name))
          .filter(user => user.name.toLowerCase().startsWith(filter.name))
        return response;
        })
      );
  }
}

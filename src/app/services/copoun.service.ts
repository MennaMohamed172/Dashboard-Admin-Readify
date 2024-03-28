import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Copoun } from '../models/copoun';


@Injectable({
  providedIn: 'root'
})
export class CopounService {
  private apiUrl = 'http://localhost:4000/copoun';

  constructor(private http: HttpClient) { }

  createCopoun(CopounData: Copoun): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, CopounData);
  }

  getAllCopouns(): Observable<Copoun[]> {
    return this.http.get<Copoun[]>(`${this.apiUrl}`);
  }

  updateCopoun(copounId: string, copoun: Copoun): Observable<any> {
    if (!copounId) {
      // Handle the case where copounId is not provided
      return throwError('CopounId is required');
    }

    return this.http.patch<any>(`${this.apiUrl}/${copounId}`, copoun);
  }



  deleteCopoun(CopounId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${CopounId}`);
  }


  applyCopoun(CopounData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/applyCopoun`, CopounData);
  }
}

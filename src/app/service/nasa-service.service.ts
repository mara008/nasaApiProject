import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class NasaServiceService {

  serviceURLAPOD : string;
  serviceURLMRP : string;

  constructor(private http: HttpClient) {

   this.serviceURLAPOD = environment.nasaApiKeyAPOD;
   this.serviceURLMRP = environment.nasaApiKeyLMRP;

   }

   //  for each api another service url???

   getCurrent(): Observable<any>{
    return this.http.get(this.serviceURLAPOD);
   }

   getImages(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate)
    
    return this.http.get<any>(this.serviceURLAPOD, { params });
  }  
  
  getMarsRoverImages(earthDate: string, camera: string): Observable<any> {
    const params = new HttpParams()
      .set('earth_date', earthDate)
      .set('camera', camera)
    
    return this.http.get<any>(this.serviceURLMRP, { params });
  }
   
}

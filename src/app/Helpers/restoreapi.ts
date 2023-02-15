import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RestoreApiService {
  constructor(private _httpService: HttpClient) {}

  restoreDelete(id: number) {
    return this._httpService.delete('http://localhost:3000/Recycle/' + id);
  }
  
  
}

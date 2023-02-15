import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecycleApiService {
  constructor(private _httpService: HttpClient) {}

  deleteUserFromRecyclebin(id: number) {
    return this._httpService.delete('http://localhost:3000/Recycle/' + id);
  }
  postrecycledUser(data: any) {
    return this._httpService.post('http://localhost:3000/posts/', data);
  }
  
}

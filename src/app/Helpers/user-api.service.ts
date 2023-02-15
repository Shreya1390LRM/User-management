import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private _httpService: HttpClient) {}

  updateUser(user: any) {
    return this._httpService.put(
      `${'http://localhost:3000/posts/'}${user.id}`,
      user
    );
  }

  getUsers() {
    return this._httpService.get<any>('http://localhost:3000/posts');
  }
  addUsers(data: any) {
    return this._httpService.post<any>('http://localhost:3000/posts/', data);
  }

  deleteUser(id: number) {
    return this._httpService.delete('http://localhost:3000/posts/' + id);
  }
  getdeletedUser() {
    return this._httpService.get<any>('http://localhost:3000/Recycle');
  }
  postdeletedUser(data: any) {
    return this._httpService.post('http://localhost:3000/Recycle/', data);
  }


}

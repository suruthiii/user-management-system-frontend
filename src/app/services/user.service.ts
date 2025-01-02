import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private authService: AuthService) {}

  getUsers() {
    const axiosInstance = this.authService.getAxiosInstance();
    return axiosInstance.get<User[]>(this.apiUrl);
  }

  getUserById(id: number) {
    const axiosInstance = this.authService.getAxiosInstance();
    return axiosInstance.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User) {
    const axiosInstance = this.authService.getAxiosInstance();
    return axiosInstance.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User) {
    const axiosInstance = this.authService.getAxiosInstance();
    return axiosInstance.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number) {
    const axiosInstance = this.authService.getAxiosInstance();
    return axiosInstance.delete(`${this.apiUrl}/${id}`);
  }
}
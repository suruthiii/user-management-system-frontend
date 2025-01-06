import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios, { AxiosInstance } from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';

interface LoginResponse {
  message: string;
  token: string;
  refreshToken: string;
  expirationTime: string;
  role: string;
}

interface UserInfo {
  userId: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserInfo | null>;
  public currentUser: Observable<UserInfo | null>;
  private axiosInstance: AxiosInstance;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8080'
    });

    const storedUser = this.getStoredUser();
    
    this.currentUserSubject = new BehaviorSubject<UserInfo | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();

    this.setupAxiosInterceptors();
  }

  private getStoredUser(): UserInfo | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        return this.decodeToken(token);
      }
    }
    return null;
  }

  private setupAxiosInterceptors() {
    this.axiosInstance.interceptors.request.use(
      config => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshAccessToken();
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private decodeToken(token: string): UserInfo | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));
      return {
        userId: payload.userId,
        email: payload.sub
      };
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  login(email: string, password: string): Promise<LoginResponse> {
    return axios.post<LoginResponse>('http://localhost:8080/auth/login', { 
      email, 
      password 
    })
    .then(response => {
      const { token, refreshToken, role } = response.data;

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', role);
      }

      const userInfo = this.decodeToken(token);
      this.currentUserSubject.next(userInfo);

      return response.data;
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
    }

    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) 
      ? localStorage.getItem('token') 
      : null;
  }

  getRefreshToken(): string | null {
    return isPlatformBrowser(this.platformId) 
      ? localStorage.getItem('refreshToken') 
      : null;
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/refresh', {
        refreshToken
      });

      const { token: newToken } = response.data;

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', newToken);
      }

      return newToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  public get currentUserValue(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
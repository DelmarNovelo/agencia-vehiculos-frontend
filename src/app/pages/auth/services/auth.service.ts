import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LoginDto } from '../dto/login.dto';
import { map } from 'rxjs';
import { StorageService } from '../../../services/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  private apiUrl = `${environment.apiUrl}/auth`;

  login(loginDto: LoginDto) {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, loginDto)
      .pipe(map((res: any) => {
        localStorage.setItem('token', res.token);
        this.storageService.setItem('user', res.payload);
      }));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}

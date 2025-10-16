import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { BaseIcon } from "primeng/icons/baseicon";
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    Menubar,
    Button,
    BaseIcon
],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

  private authService = inject(AuthService);

  logOut() {
    this.authService.logout();
  }
  
}

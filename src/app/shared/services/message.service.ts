import { Injectable } from '@angular/core';
import { MessageService as PrimeMessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private primeMessageService: PrimeMessageService) { }

  showSuccess(message: string) {
    this.primeMessageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000
    });
  }

  showError(message: string) {
    this.primeMessageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }

  showInfo(message: string) {
    this.primeMessageService.add({
      severity: 'info',
      summary: 'Información',
      detail: message,
      life: 3000
    });
  }

  showWarn(message: string) {
    this.primeMessageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
      life: 4000
    });
  }
}
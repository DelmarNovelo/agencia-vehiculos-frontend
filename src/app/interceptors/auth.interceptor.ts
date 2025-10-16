import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from '../shared/services/message.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Clonar la solicitud y agregar el header de autorización si existe el token
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    tap((event: any) => {
      // Manejar mensajes de éxito del servidor
      if (event.body && event.body.message) {
        messageService.showSuccess(event.body.message);
      }
    }),
    catchError((error) => {
      // Manejar errores
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor. Inténtalo más tarde.';
      }

      messageService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};

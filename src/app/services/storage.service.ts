import { Injectable } from '@angular/core';

type StorageKey = 'token' | 'user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  getItem<T>(key: StorageKey): T | string | null {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value); // si es JSON válido, lo parsea
    } catch {
      return value; // si falla, es string plano
    }
  }

  setItem(key: StorageKey, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

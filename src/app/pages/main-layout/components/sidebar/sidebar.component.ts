import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgIf,
    RouterLink,
    Menu,
    PanelMenu,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  items: MenuItem[] = [
    {
      label: 'Administración',
      items: [
        {
          label: 'Usuarios',
          items: [
            {
              label: 'Nuevo usuario',
              routerLink: '/panel/usuarios/crear',
              icon: 'pi pi-plus'
            },
            {
              label: 'Usuarios registrados',
              routerLink: '/panel/usuarios/lista',
              icon: 'pi pi-user'
            },
          ]
        },
        {
          label: 'Empresa',
          routerLink: '/panel/empresa',
          icon: 'pi pi-building'
        },
        {
          label: 'Informes',
          routerLink: '/panel/informes',
          icon: 'pi pi-building'
        },
      ]
    },
    {
      label: 'Vehículos',
      items: [
        {
          label: 'Nuevo vehículo',
          routerLink: '/panel/vehiculos/nuevo',
          icon: 'pi pi-plus'
        },
        {
          label: 'Vehículos registrados',
          routerLink: '/panel/vehiculos/lista',
          icon: 'pi pi-car'
        }
      ]
    },
    {
      label: 'Ventas',
      items: [
        {
          label: 'Nueva Venta',
          routerLink: '/panel/ventas',
          icon: 'pi pi-plus'
        },
        {
          label: 'Ventas Registradas',
          routerLink: '/panel/ventas/lista',
          icon: 'pi pi-shopping-cart'
        }
      ]
    },
    {
      label: 'Clientes',
      items: [
        {
          label: 'Nuevo Cliente',
          routerLink: '/panel/clientes/crear',
          icon: 'pi pi-plus'
        },
        {
          label: 'Clientes Registrados',
          routerLink: '/panel/clientes',
          icon: 'pi pi-user'
        }
      ]
    },
    {
      label: 'Compras',
      items: [
        {
          label: 'Nueva Compra',
          routerLink: '/panel/compras/nueva',
          icon: 'pi pi-plus'
        },
        {
          label: 'Compras Registradas',
          routerLink: '/panel/compras/lista',
          icon: 'pi pi-shopping-bag'
        }
      ]
    },
    {
      label: 'Proveedores',
      items: [
        {
          label: 'Crear Proveedor',
          routerLink: '/panel/proveedores/crear',
          icon: 'pi pi-plus'
        },
        {
          label: 'Proveedores Registrados',
          routerLink: '/panel/proveedores',
          icon: 'pi pi-truck'
        }
      ]
    },
    {
      label: 'Configuraciones',
      items: [
        {
          label: 'Roles',
          routerLink: '/panel/roles/lista',
          icon: 'pi pi-shield'
        },
        {
          label: 'Tipos de contacto',
          routerLink: '/panel/tipos-contacto',
          icon: 'pi pi-address-book'
        },
        {
          label: 'Métodos de pago',
          routerLink: '/panel/metodos-pago',
          icon: 'pi pi-credit-card'
        },
        {
          label: 'Vehiculos',
          items: [
            {
              label: 'Marcas',
              routerLink: '/panel/marcas',
            },
            {
              label: 'Lineas',
              routerLink: '/panel/lineas',
            },
            {
              label: 'Modelos',
              routerLink: '/panel/modelos',
            },
            {
              label: 'Colores',
              routerLink: '/panel/colores',
            },
            {
              label: 'Combustibles',
              routerLink: '/panel/combustibles',
            },
            {
              label: 'Transmisiones',
              routerLink: '/panel/transmisiones',
            },
            {
              label: 'Tipos de vehículos',
              routerLink: '/panel/tipos-vehiculos',
            },
          ]
        },
        {
          label: 'Deptos y Munic.',
          items: [
            {
              label: 'Departamentos',
              routerLink: '/panel/departamentos',
            },
            {
              label: 'Municipios',
              routerLink: '/panel/municipios',
            }
          ]
        }
      ]
    },
  ];
}

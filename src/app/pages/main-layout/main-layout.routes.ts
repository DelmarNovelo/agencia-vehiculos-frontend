import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./main-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'usuarios',
        loadChildren: () => import('../usuarios/usuarios.routes').then(m => m.routes)
      },
      {
        path: 'informes',
        loadComponent: () => import('../informes/informes.component')
      },
      {
        path: 'empresa',
        loadComponent: () => import('../empresa/pages/detalles-empresa/detalles-empresa.component')
      },
      {
        path: 'roles',
        loadChildren: () => import('../roles/roles.routes').then(m => m.routes)
      },
      {
        path: 'vehiculos',
        loadChildren: () => import('../vehiculos/vehiculos.routes').then(m => m.routes)
      },
      {
        path: 'marcas',
        loadChildren: () => import('../marcas/marcas.routes').then(m => m.routes)
      },
      {
        path: 'lineas',
        loadChildren: () => import('../lineas/lineas.routes').then(m => m.routes)
      },
      {
        path: 'colores',
        loadChildren: () => import('../colores/color.routes').then(m => m.routes)
      },
      {
        path: 'combustibles',
        loadChildren: () => import('../combustibles/combustible.routes').then(m => m.routes)
      },
      {
        path: 'transmisiones',
        loadChildren: () => import('../transmisiones/transmisiones.routes').then(m => m.routes)
      },
      {
        path: 'modelos',
        loadChildren: () => import('../modelos/modelos.routes').then(m => m.routes)
      },
      {
        path: 'tipos-vehiculos',
        loadChildren: () => import('../tipos-vehiculos/tipos-vehiculos.routes').then(m => m.routes)
      },
      {
        path: 'ventas',
        loadChildren: () => import('../ventas/ventas.routes').then(m => m.routes)
      },
      {
        path: 'clientes',
        loadChildren: () => import('../clientes/clientes.routes').then(m => m.routes)
      },
      {
        path: 'compras',
        loadChildren: () => import('../compras/compras.routes').then(m => m.routes)
      },
      {
        path: 'proveedores',
        loadChildren: () => import('../proveedores/proveedores.routes').then(m => m.routes)
      },
      {
        path: 'departamentos',
        loadChildren: () => import('../departamentos/departamentos.routes').then(m => m.routes)
      },
      {
        path: 'municipios',
        loadChildren: () => import('../municipios/municipios.routes').then(m => m.routes)
      },
      {
        path: 'tipos-contacto',
        loadChildren: () => import('../tipos-contacto/tipos.contacto.routes').then(m => m.routes)
      },
      {
        path: 'metodos-pago',
        loadChildren: () => import('../metodos-pago/metodos-pago.routes').then(m => m.routes)
      },
      {
        path: '',
        redirectTo: 'vehiculos',
        pathMatch: 'full'
      },
    ]
  }
]
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import CustomerOrders from '../views/orders/CustomerOrders.vue';
import Inventory from '../views/inventory/Inventory.vue';
import Manufacturing from '../views/manufacturing/Manufacturing.vue';
import HR from '../views/hr/HR.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/orders',
    name: 'CustomerOrders',
    component: CustomerOrders
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory
  },
  {
    path: '/manufacturing',
    name: 'Manufacturing',
    component: Manufacturing
  },
  {
    path: '/hr',
    name: 'HR',
    component: HR
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
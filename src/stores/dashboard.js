import { defineStore } from 'pinia';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      totalOrders: 24,
      inventoryItems: 156,
      activeProduction: 8,
      employees: 42
    },
    recentActivities: [
      { id: 1, type: 'order', message: 'New order #1234 from ABC Corp', timestamp: '2023-11-15T10:30:00' },
      { id: 2, type: 'inventory', message: 'Low stock alert: Product A', timestamp: '2023-11-15T09:15:00' },
      { id: 3, type: 'production', message: 'Production batch #789 completed', timestamp: '2023-11-15T08:45:00' }
    ]
  })
});
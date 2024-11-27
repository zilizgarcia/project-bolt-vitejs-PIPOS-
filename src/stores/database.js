import { defineStore } from 'pinia';

// Use localStorage to persist data
const STORAGE_KEY = 'erp_database';

const loadPersistedData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error loading persisted data:', err);
    return null;
  }
};

// Initial data structure
const createInitialData = () => ({
  products: [
    { id: 1, name: 'Product A', sku: 'PA001', quantity: 100, minStock: 20, price: 29.99 },
    { id: 2, name: 'Product B', sku: 'PB002', quantity: 15, minStock: 25, price: 49.99 },
    { id: 3, name: 'Product C', sku: 'PC003', quantity: 50, minStock: 30, price: 39.99 },
  ],
  employees: [
    { id: 1, name: 'John Doe', role: 'Operator', department: 'production', shift: 'morning', available: true },
    { id: 2, name: 'Jane Smith', role: 'Supervisor', department: 'production', shift: 'morning', available: true },
    { id: 3, name: 'Mike Johnson', role: 'Operator', department: 'production', shift: 'evening', available: true },
  ],
  orders: [],
  production: []
});

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    data: loadPersistedData() || createInitialData(),
    lastUpdate: null,
    status: {
      connected: true,
      syncing: false
    }
  }),

  actions: {
    persistData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        this.lastUpdate = new Date().toISOString();
      } catch (err) {
        console.error('Error persisting data:', err);
      }
    },

    async syncData() {
      this.status.syncing = true;
      try {
        // In a real application, this would sync with a backend
        // For now, we'll just ensure local storage is up to date
        this.persistData();
        return true;
      } finally {
        this.status.syncing = false;
      }
    },

    async getData(module) {
      return this.data[module] || [];
    },

    async updateData(module, data) {
      this.data[module] = [...data];
      this.persistData();
      return true;
    }
  }
});
import { defineStore } from 'pinia';
import { useDatabaseStore } from './database';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null
  }),

  getters: {
    pendingOrders: (state) => state.orders.filter(order => order.status === 'pending'),
    processingOrders: (state) => state.orders.filter(order => order.status === 'processing'),
    completedOrders: (state) => state.orders.filter(order => order.status === 'completed')
  },

  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const db = useDatabaseStore();
        this.orders = await db.getData('orders');
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData) {
      const db = useDatabaseStore();
      const order = {
        id: Date.now(),
        ...orderData,
        createdAt: new Date().toISOString()
      };

      this.orders.push(order);
      await db.updateData('orders', this.orders);
      return order;
    },

    async updateOrderStatus(orderId, status) {
      const db = useDatabaseStore();
      const order = this.orders.find(o => o.id === orderId);
      
      if (order) {
        order.status = status;
        await db.updateData('orders', this.orders);
      }
    }
  }
});
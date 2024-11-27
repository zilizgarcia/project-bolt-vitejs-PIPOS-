import { defineStore } from 'pinia';
import { useDatabaseStore } from './database';
import { useWorkflowStore } from './workflow';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const db = useDatabaseStore();
        this.products = await db.getData('products');
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async checkStock(orderItems) {
      const insufficientStock = [];
      
      for (const item of orderItems) {
        const product = this.products.find(p => p.id === item.productId);
        if (!product || product.quantity < item.quantity) {
          insufficientStock.push({
            productId: item.productId,
            required: item.quantity,
            available: product ? product.quantity : 0
          });
        }
      }

      return {
        hasStock: insufficientStock.length === 0,
        insufficientStock
      };
    },

    async reserveStock(orderItems) {
      const db = useDatabaseStore();
      
      for (const item of orderItems) {
        const product = this.products.find(p => p.id === item.productId);
        if (product) {
          product.quantity -= item.quantity;
        }
      }

      await db.updateData('products', this.products);
    },

    async updateStock(productUpdates) {
      const db = useDatabaseStore();
      const workflow = useWorkflowStore();

      for (const update of productUpdates) {
        const product = this.products.find(p => p.id === update.productId);
        if (product) {
          product.quantity += update.quantity;
          
          if (product.quantity <= product.minStock) {
            workflow.startWorkflow('low-stock-alert', {
              productId: product.id,
              currentStock: product.quantity,
              minStock: product.minStock
            });
          }
        }
      }

      await db.updateData('products', this.products);
    }
  }
});
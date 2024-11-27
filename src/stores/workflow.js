import { defineStore } from 'pinia';
import { useOrdersStore } from './orders';
import { useInventoryStore } from './inventory';
import { useManufacturingStore } from './manufacturing';

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    activeWorkflows: [],
    notifications: []
  }),

  actions: {
    async startWorkflow(type, data) {
      const workflow = {
        id: Date.now(),
        type,
        data,
        status: 'started',
        steps: [],
        timestamp: new Date().toISOString()
      };

      try {
        switch (type) {
          case 'order-fulfilled':
            await this.handleOrderFulfilled(data);
            break;
          case 'production-needed':
            await this.handleProductionNeeded(data);
            break;
          case 'production-completed':
            await this.handleProductionCompleted(data);
            break;
          case 'low-stock-alert':
            await this.handleLowStockAlert(data);
            break;
        }

        workflow.status = 'completed';
      } catch (error) {
        workflow.status = 'failed';
        workflow.error = error.message;
        console.error(`Workflow ${type} failed:`, error);
      }

      this.activeWorkflows.push(workflow);
      return workflow;
    },

    async handleOrderFulfilled(data) {
      const orders = useOrdersStore();
      await orders.updateOrderStatus(data.orderId, 'completed');
      
      this.addNotification({
        type: 'success',
        message: `Order #${data.orderId} has been fulfilled`,
        timestamp: new Date().toISOString()
      });
    },

    async handleProductionNeeded(data) {
      const manufacturing = useManufacturingStore();
      const orders = useOrdersStore();

      await orders.updateOrderStatus(data.orderId, 'pending');
      
      this.addNotification({
        type: 'info',
        message: `Production order #${data.productionOrderId} created for order #${data.orderId}`,
        timestamp: new Date().toISOString()
      });
    },

    async handleProductionCompleted(data) {
      const inventory = useInventoryStore();
      const orders = useOrdersStore();

      // Update inventory with produced items
      await inventory.updateStock(data.products);
      
      this.addNotification({
        type: 'success',
        message: `Production order #${data.orderId} completed`,
        timestamp: new Date().toISOString()
      });
    },

    async handleLowStockAlert(data) {
      this.addNotification({
        type: 'warning',
        message: `Low stock alert: ${data.productId} (${data.currentStock}/${data.minStock})`,
        timestamp: new Date().toISOString()
      });
    },

    addNotification(notification) {
      this.notifications.unshift({
        id: Date.now(),
        ...notification
      });

      // Keep only the last 100 notifications
      if (this.notifications.length > 100) {
        this.notifications.pop();
      }
    }
  }
});
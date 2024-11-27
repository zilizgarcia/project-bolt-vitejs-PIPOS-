import { defineStore } from 'pinia';
import { useDatabaseStore } from './database';
import { useInventoryStore } from './inventory';
import { useHRStore } from './hr';
import { useWorkflowStore } from './workflow';

export const useManufacturingStore = defineStore('manufacturing', {
  state: () => ({
    productionOrders: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const db = useDatabaseStore();
        this.productionOrders = await db.getData('production');
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createProductionOrder(products, priority = 1) {
      const db = useDatabaseStore();
      const hr = useHRStore();
      const workflow = useWorkflowStore();

      const productionOrder = {
        id: Date.now(),
        status: 'pending',
        products,
        priority,
        requiredBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      };

      // Find available employee
      const availableEmployee = await hr.findAvailableEmployee('production');
      if (availableEmployee) {
        productionOrder.assignedTo = availableEmployee.id;
        productionOrder.status = 'in-progress';
        await hr.updateEmployeeStatus(availableEmployee.id, 'unavailable');
      }

      this.productionOrders.push(productionOrder);
      await db.updateData('production', this.productionOrders);

      workflow.startWorkflow('production-started', {
        orderId: productionOrder.id,
        products: productionOrder.products
      });

      return productionOrder;
    },

    async assignProductionOrder(orderId, employeeId) {
      const db = useDatabaseStore();
      const hr = useHRStore();
      const workflow = useWorkflowStore();

      const order = this.productionOrders.find(o => o.id === orderId);
      if (!order) return;

      order.assignedTo = employeeId;
      order.status = 'in-progress';
      await hr.updateEmployeeStatus(employeeId, 'unavailable');

      await db.updateData('production', this.productionOrders);

      workflow.startWorkflow('production-assigned', {
        orderId: order.id,
        employeeId: employeeId
      });
    },

    async completeProductionOrder(orderId) {
      const db = useDatabaseStore();
      const inventory = useInventoryStore();
      const hr = useHRStore();
      const workflow = useWorkflowStore();

      const order = this.productionOrders.find(o => o.id === orderId);
      if (!order) return;

      order.status = 'completed';
      order.completedAt = new Date().toISOString();

      // Update inventory
      await inventory.updateStock(order.products);

      // Update employee status
      if (order.assignedTo) {
        await hr.updateEmployeeStatus(order.assignedTo, 'available');
      }

      await db.updateData('production', this.productionOrders);

      workflow.startWorkflow('production-completed', {
        orderId: order.id,
        products: order.products
      });
    }
  }
});
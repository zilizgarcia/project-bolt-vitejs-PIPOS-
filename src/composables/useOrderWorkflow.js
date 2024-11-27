import { ref } from 'vue';
import { useOrdersStore } from '../stores/orders';
import { useInventoryStore } from '../stores/inventory';
import { useManufacturingStore } from '../stores/manufacturing';
import { useWorkflowStore } from '../stores/workflow';

export function useOrderWorkflow() {
  const orders = useOrdersStore();
  const inventory = useInventoryStore();
  const manufacturing = useManufacturingStore();
  const workflow = useWorkflowStore();

  const processing = ref(false);
  const error = ref(null);

  const processOrder = async (orderData) => {
    processing.value = true;
    error.value = null;

    try {
      // Check inventory
      const stockCheck = await inventory.checkStock(orderData.items);

      if (stockCheck.hasStock) {
        // Reserve stock
        await inventory.reserveStock(orderData.items);
        
        // Create order
        const order = await orders.createOrder({
          ...orderData,
          status: 'processing'
        });

        workflow.startWorkflow('order-fulfilled', { orderId: order.id });
      } else {
        // Create production orders for missing items
        const productionOrder = await manufacturing.createProductionOrder(
          stockCheck.insufficientStock.map(item => ({
            productId: item.productId,
            quantity: item.required - item.available
          }))
        );

        // Create order with pending status
        const order = await orders.createOrder({
          ...orderData,
          status: 'pending',
          productionOrderId: productionOrder.id
        });

        workflow.startWorkflow('production-needed', {
          orderId: order.id,
          productionOrderId: productionOrder.id
        });
      }

      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      processing.value = false;
    }
  };

  return {
    processOrder,
    processing,
    error
  };
}
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Customer Orders</h1>
      <button 
        @click="showNewOrderForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        New Order
      </button>
    </div>

    <!-- Order Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="stat in orderStats" :key="stat.label" 
           class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">{{ stat.label }}</h3>
        <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders.orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.customerName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ order.total.toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Order Modal -->
    <div v-if="showNewOrderForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">New Order</h3>
          <form @submit.prevent="submitOrder">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Customer Name
              </label>
              <input 
                v-model="newOrder.customerName"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            
            <!-- Product Selection -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Products
              </label>
              <div v-for="(item, index) in newOrder.items" :key="index" class="flex gap-2 mb-2">
                <select 
                  v-model="item.productId"
                  class="flex-1 shadow border rounded py-2 px-3 text-gray-700"
                  required
                >
                  <option value="">Select Product</option>
                  <option v-for="product in inventory.products" 
                          :key="product.id"
                          :value="product.id">
                    {{ product.name }} - ${{ product.price }}
                  </option>
                </select>
                <input 
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  class="w-20 shadow border rounded py-2 px-3 text-gray-700"
                  required
                >
                <button 
                  @click="removeOrderItem(index)"
                  type="button"
                  class="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
              <button 
                @click="addOrderItem"
                type="button"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Product
              </button>
            </div>

            <div class="flex justify-end gap-4">
              <button 
                type="button"
                @click="showNewOrderForm = false"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="processing"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ processing ? 'Processing...' : 'Create Order' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useOrdersStore } from '../../stores/orders';
import { useInventoryStore } from '../../stores/inventory';
import { useOrderWorkflow } from '../../composables/useOrderWorkflow';

const orders = useOrdersStore();
const inventory = useInventoryStore();
const { processOrder, processing, error } = useOrderWorkflow();

const showNewOrderForm = ref(false);
const newOrder = ref({
  customerName: '',
  items: [{ productId: '', quantity: 1 }]
});

const orderStats = computed(() => [
  { label: 'Pending Orders', value: orders.pendingOrders.length },
  { label: 'Processing Orders', value: orders.processingOrders.length },
  { label: 'Completed Orders', value: orders.completedOrders.length }
]);

const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy HH:mm');

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status] || '';
};

const addOrderItem = () => {
  newOrder.value.items.push({ productId: '', quantity: 1 });
};

const removeOrderItem = (index) => {
  newOrder.value.items.splice(index, 1);
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const product = inventory.products.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
};

const submitOrder = async () => {
  const orderData = {
    ...newOrder.value,
    total: calculateTotal(newOrder.value.items)
  };

  const success = await processOrder(orderData);
  if (success) {
    showNewOrderForm.value = false;
    newOrder.value = {
      customerName: '',
      items: [{ productId: '', quantity: 1 }]
    };
  }
};

onMounted(async () => {
  await orders.fetchOrders();
  await inventory.fetchProducts();
});
</script>
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manufacturing Operations</h1>
      <button 
        @click="showNewOrderForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        New Production Order
      </button>
    </div>

    <!-- Manufacturing Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Active Orders</h3>
        <p class="text-2xl font-bold text-gray-900">{{ activeOrders.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Completed Today</h3>
        <p class="text-2xl font-bold text-green-600">{{ completedToday }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Pending Assignment</h3>
        <p class="text-2xl font-bold text-yellow-600">{{ pendingAssignment.length }}</p>
      </div>
    </div>

    <!-- Production Orders -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Products
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Required By
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in manufacturing.productionOrders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div v-for="product in order.products" :key="product.productId">
                {{ getProductName(product.productId) }} ({{ product.quantity }})
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getEmployeeName(order.assignedTo) || 'Unassigned' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.requiredBy) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                v-if="order.status === 'in-progress'"
                @click="() => completeOrder(order.id)"
                class="text-green-600 hover:text-green-900 mr-3"
              >
                Complete
              </button>
              <button 
                v-if="!order.assignedTo"
                @click="() => assignOrder(order)"
                class="text-blue-600 hover:text-blue-900"
              >
                Assign
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Production Order Modal -->
    <div v-if="showNewOrderForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">New Production Order</h3>
          <form @submit.prevent="createOrder">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Products</label>
              <div v-for="(item, index) in newOrder.products" :key="index" class="flex gap-2 mb-2">
                <select 
                  v-model="item.productId"
                  class="flex-1 shadow border rounded py-2 px-3 text-gray-700"
                  required
                >
                  <option value="">Select Product</option>
                  <option v-for="product in inventory.products" 
                          :key="product.id"
                          :value="product.id">
                    {{ product.name }}
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

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Priority</label>
              <select 
                v-model="newOrder.priority"
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </select>
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
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Assign Order Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Assign Production Order #{{ selectedOrder.id }}
          </h3>
          <form @submit.prevent="submitAssignment">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Employee</label>
              <select 
                v-model="selectedEmployee"
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="">Select Employee</option>
                <option v-for="employee in availableEmployees" 
                        :key="employee.id"
                        :value="employee.id">
                  {{ employee.name }} ({{ employee.role }})
                </option>
              </select>
            </div>

            <div class="flex justify-end gap-4">
              <button 
                type="button"
                @click="selectedOrder = null"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Assign
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
import { useManufacturingStore } from '../../stores/manufacturing';
import { useInventoryStore } from '../../stores/inventory';
import { useHRStore } from '../../stores/hr';

const manufacturing = useManufacturingStore();
const inventory = useInventoryStore();
const hr = useHRStore();

const showNewOrderForm = ref(false);
const selectedOrder = ref(null);
const selectedEmployee = ref('');

const newOrder = ref({
  products: [{ productId: '', quantity: 1 }],
  priority: 1
});

const activeOrders = computed(() => 
  manufacturing.productionOrders.filter(o => o.status === 'in-progress')
);

const pendingAssignment = computed(() =>
  manufacturing.productionOrders.filter(o => !o.assignedTo)
);

const completedToday = computed(() => {
  const today = new Date();
  return manufacturing.productionOrders.filter(o => {
    if (!o.completedAt) return false;
    const completedDate = new Date(o.completedAt);
    return completedDate.toDateString() === today.toDateString();
  }).length;
});

const availableEmployees = computed(() =>
  hr.employees.filter(e => e.available && e.department === 'production')
);

const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
  };
  return classes[status] || '';
};

const getProductName = (productId) => {
  const product = inventory.products.find(p => p.id === productId);
  return product ? product.name : 'Unknown Product';
};

const getEmployeeName = (employeeId) => {
  if (!employeeId) return null;
  const employee = hr.employees.find(e => e.id === employeeId);
  return employee ? employee.name : 'Unknown Employee';
};

const addOrderItem = () => {
  newOrder.value.products.push({ productId: '', quantity: 1 });
};

const removeOrderItem = (index) => {
  newOrder.value.products.splice(index, 1);
};

const createOrder = async () => {
  await manufacturing.createProductionOrder(
    newOrder.value.products,
    newOrder.value.priority
  );
  
  showNewOrderForm.value = false;
  newOrder.value = {
    products: [{ productId: '', quantity: 1 }],
    priority: 1
  };
};

const assignOrder = (order) => {
  selectedOrder.value = order;
  selectedEmployee.value = '';
};

const submitAssignment = async () => {
  if (selectedOrder.value && selectedEmployee.value) {
    await manufacturing.assignProductionOrder(
      selectedOrder.value.id,
      selectedEmployee.value
    );
    selectedOrder.value = null;
    selectedEmployee.value = '';
  }
};

const completeOrder = async (orderId) => {
  await manufacturing.completeProductionOrder(orderId);
};

onMounted(async () => {
  await Promise.all([
    manufacturing.fetchOrders(),
    inventory.fetchProducts(),
    hr.fetchEmployees()
  ]);
});
</script>
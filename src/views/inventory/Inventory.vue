<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Inventory Management</h1>
      <button 
        @click="showAddProductForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Product
      </button>
    </div>

    <!-- Inventory Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Total Products</h3>
        <p class="text-2xl font-bold text-gray-900">{{ inventory.products.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Low Stock Items</h3>
        <p class="text-2xl font-bold text-red-600">{{ lowStockItems.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Total Stock Value</h3>
        <p class="text-2xl font-bold text-gray-900">${{ totalStockValue.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in inventory.products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ product.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ product.sku }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ product.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ product.price.toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStockStatusClass(product)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStockStatus(product) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                @click="() => showUpdateStock(product)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Update Stock
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddProductForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Product</h3>
          <form @submit.prevent="addProduct">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input 
                v-model="newProduct.name"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">SKU</label>
              <input 
                v-model="newProduct.sku"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Initial Quantity</label>
              <input 
                v-model.number="newProduct.quantity"
                type="number"
                min="0"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Min Stock Level</label>
              <input 
                v-model.number="newProduct.minStock"
                type="number"
                min="0"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Price</label>
              <input 
                v-model.number="newProduct.price"
                type="number"
                min="0"
                step="0.01"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="flex justify-end gap-4">
              <button 
                type="button"
                @click="showAddProductForm = false"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Update Stock Modal -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Update Stock - {{ selectedProduct.name }}</h3>
          <form @submit.prevent="updateProductStock">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Quantity Change</label>
              <div class="flex items-center">
                <select 
                  v-model="stockUpdate.type"
                  class="mr-2 shadow border rounded py-2 px-3 text-gray-700"
                >
                  <option value="add">Add</option>
                  <option value="remove">Remove</option>
                </select>
                <input 
                  v-model.number="stockUpdate.quantity"
                  type="number"
                  min="1"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <button 
                type="button"
                @click="selectedProduct = null"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
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
import { useInventoryStore } from '../../stores/inventory';

const inventory = useInventoryStore();
const showAddProductForm = ref(false);
const selectedProduct = ref(null);

const newProduct = ref({
  name: '',
  sku: '',
  quantity: 0,
  minStock: 0,
  price: 0
});

const stockUpdate = ref({
  type: 'add',
  quantity: 1
});

const lowStockItems = computed(() => 
  inventory.products.filter(p => p.quantity <= p.minStock)
);

const totalStockValue = computed(() =>
  inventory.products.reduce((total, product) => 
    total + (product.quantity * product.price), 0)
);

const getStockStatus = (product) => {
  if (product.quantity === 0) return 'Out of Stock';
  if (product.quantity <= product.minStock) return 'Low Stock';
  return 'In Stock';
};

const getStockStatusClass = (product) => {
  const classes = {
    'Out of Stock': 'bg-red-100 text-red-800',
    'Low Stock': 'bg-yellow-100 text-yellow-800',
    'In Stock': 'bg-green-100 text-green-800'
  };
  return classes[getStockStatus(product)];
};

const addProduct = async () => {
  await inventory.addProduct(newProduct.value);
  showAddProductForm.value = false;
  newProduct.value = {
    name: '',
    sku: '',
    quantity: 0,
    minStock: 0,
    price: 0
  };
};

const showUpdateStock = (product) => {
  selectedProduct.value = product;
  stockUpdate.value = {
    type: 'add',
    quantity: 1
  };
};

const updateProductStock = async () => {
  const quantity = stockUpdate.value.type === 'add' 
    ? stockUpdate.value.quantity 
    : -stockUpdate.value.quantity;
    
  await inventory.updateStock([{
    productId: selectedProduct.value.id,
    quantity
  }]);
  
  selectedProduct.value = null;
};

onMounted(async () => {
  await inventory.fetchProducts();
});
</script>
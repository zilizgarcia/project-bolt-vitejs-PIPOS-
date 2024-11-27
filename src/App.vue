<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">ERP System</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                v-for="route in routes" 
                :key="route.path"
                :to="route.path"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2"
                :class="$route.path === route.path ? 'border-blue-500' : 'border-transparent'"
              >
                {{ route.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const routes = ref([
  { path: '/', name: 'Dashboard' },
  { path: '/orders', name: 'Orders' },
  { path: '/inventory', name: 'Inventory' },
  { path: '/manufacturing', name: 'Manufacturing' },
  { path: '/hr', name: 'HR' }
]);
</script>
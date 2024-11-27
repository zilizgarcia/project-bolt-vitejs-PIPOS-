<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <div class="flex gap-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Generate Report
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm font-medium">Inventory Items</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.inventoryItems }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm font-medium">Active Production</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeProduction }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm font-medium">Employees</h3>
            <p class="text-2xl font-bold text-gray-900">{{ stats.employees }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" 
             class="flex items-center p-4 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <div :class="getActivityIconClass(activity.type)" class="p-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="getActivityIcon(activity.type)" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-900">{{ activity.message }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(activity.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { format } from 'date-fns';
import { useDashboardStore } from '../stores/dashboard';

const dashboardStore = useDashboardStore();
const { stats, recentActivities } = dashboardStore;

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

const getActivityIconClass = (type) => {
  const classes = {
    order: 'bg-blue-100 text-blue-600',
    inventory: 'bg-green-100 text-green-600',
    production: 'bg-purple-100 text-purple-600'
  };
  return classes[type] || 'bg-gray-100 text-gray-600';
};

const getActivityIcon = (type) => {
  const icons = {
    order: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    inventory: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
    production: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
  };
  return icons[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
};
</script>
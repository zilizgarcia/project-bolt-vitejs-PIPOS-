<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Human Resources</h1>
      <button 
        @click="showAddEmployeeForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Employee
      </button>
    </div>

    <!-- HR Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Total Employees</h3>
        <p class="text-2xl font-bold text-gray-900">{{ hr.employees.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Available Now</h3>
        <p class="text-2xl font-bold text-green-600">{{ availableEmployees.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-gray-500 text-sm font-medium">Assigned to Tasks</h3>
        <p class="text-2xl font-bold text-blue-600">{{ assignedEmployees.length }}</p>
      </div>
    </div>

    <!-- Department Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-4" aria-label="Departments">
        <button
          v-for="dept in departments"
          :key="dept"
          @click="selectedDepartment = dept"
          :class="[
            'px-3 py-2 rounded-md text-sm font-medium',
            selectedDepartment === dept
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ dept }}
        </button>
      </nav>
    </div>

    <!-- Employees Table -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shift
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
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">
                  {{ employee.name }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.role }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.department }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.shift }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(employee)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ employee.available ? 'Available' : 'Assigned' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                @click="() => toggleAvailability(employee)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                {{ employee.available ? 'Set Unavailable' : 'Set Available' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Employee Modal -->
    <div v-if="showAddEmployeeForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Employee</h3>
          <form @submit.prevent="addEmployee">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input 
                v-model="newEmployee.name"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Role</label>
              <select 
                v-model="newEmployee.role"
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="">Select Role</option>
                <option value="Operator">Operator</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Department</label>
              <select 
                v-model="newEmployee.department"
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept.toLowerCase()">
                  {{ dept }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Shift</label>
              <select 
                v-model="newEmployee.shift"
                class="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="">Select Shift</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            <div class="flex justify-end gap-4">
              <button 
                type="button"
                @click="showAddEmployeeForm = false"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Employee
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
import { useHRStore } from '../../stores/hr';

const hr = useHRStore();
const showAddEmployeeForm = ref(false);
const selectedDepartment = ref('All');

const departments = ['All', 'Production', 'Inventory', 'Sales', 'Management'];

const newEmployee = ref({
  name: '',
  role: '',
  department: '',
  shift: '',
  available: true
});

const availableEmployees = computed(() => 
  hr.employees.filter(e => e.available)
);

const assignedEmployees = computed(() => 
  hr.employees.filter(e => !e.available)
);

const filteredEmployees = computed(() => {
  if (selectedDepartment.value === 'All') {
    return hr.employees;
  }
  return hr.employees.filter(e => 
    e.department.toLowerCase() === selectedDepartment.value.toLowerCase()
  );
});

const getStatusClass = (employee) => {
  return employee.available 
    ? 'bg-green-100 text-green-800'
    : 'bg-blue-100 text-blue-800';
};

const addEmployee = async () => {
  await hr.addEmployee(newEmployee.value);
  showAddEmployeeForm.value = false;
  newEmployee.value = {
    name: '',
    role: '',
    department: '',
    shift: '',
    available: true
  };
};

const toggleAvailability = async (employee) => {
  await hr.updateEmployeeStatus(
    employee.id,
    employee.available ? 'unavailable' : 'available'
  );
};

onMounted(async () => {
  await hr.fetchEmployees();
});
</script>
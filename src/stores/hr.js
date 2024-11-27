import { defineStore } from 'pinia';
import { useDatabaseStore } from './database';

export const useHRStore = defineStore('hr', {
  state: () => ({
    employees: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchEmployees() {
      this.loading = true;
      try {
        const db = useDatabaseStore();
        this.employees = await db.getData('employees');
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async findAvailableEmployee(department) {
      return this.employees.find(e => 
        e.department === department && 
        e.available === true
      );
    },

    async updateEmployeeStatus(employeeId, status) {
      const db = useDatabaseStore();
      const employee = this.employees.find(e => e.id === employeeId);
      
      if (employee) {
        employee.available = status === 'available';
        await db.updateData('employees', this.employees);
      }
    },

    async addEmployee(employeeData) {
      const db = useDatabaseStore();
      const newEmployee = {
        id: Date.now(),
        ...employeeData,
        available: true
      };
      
      this.employees.push(newEmployee);
      await db.updateData('employees', this.employees);
      return newEmployee;
    }
  }
});
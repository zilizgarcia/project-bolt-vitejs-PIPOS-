import { ref, onMounted, onUnmounted } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { useWorkflowStore } from '../stores/workflow';

export function useModuleSync(moduleName) {
  const db = useDatabaseStore();
  const workflow = useWorkflowStore();
  const loading = ref(false);
  const error = ref(null);
  const syncInterval = ref(null);

  const syncData = async () => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;

    try {
      await db.syncData();
      // Trigger any necessary workflows
      if (db.lastUpdate) {
        workflow.startWorkflow(`${moduleName}-sync`, {
          timestamp: db.lastUpdate
        });
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    syncData();
    // Set up periodic sync
    syncInterval.value = setInterval(syncData, 30000);
  });

  onUnmounted(() => {
    if (syncInterval.value) {
      clearInterval(syncInterval.value);
    }
  });

  return {
    loading,
    error,
    syncData
  };
}
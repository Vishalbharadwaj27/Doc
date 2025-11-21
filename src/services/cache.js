// Local caching utilities using localStorage and IndexedDB
// Provides offline-first caching for patients and appointments

const DB_NAME = 'doc-assist-db'
const STORES = {
  patients: 'patients',
  appointments: 'appointments',
  queue: 'offline-queue',
}

let db = null

const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains(STORES.patients)) {
        database.createObjectStore(STORES.patients, { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains(STORES.appointments)) {
        database.createObjectStore(STORES.appointments, { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains(STORES.queue)) {
        database.createObjectStore(STORES.queue, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

const getDB = async () => {
  if (!db) {
    await initDB()
  }
  return db
}

// Patients caching
export const cachePatients = async (patients) => {
  const database = await getDB()
  const tx = database.transaction([STORES.patients], 'readwrite')
  const store = tx.objectStore(STORES.patients)
  
  // Clear and re-add
  await store.clear()
  patients.slice(0, 100).forEach(patient => {
    store.add(patient)
  })

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export const getCachedPatients = async () => {
  const database = await getDB()
  const tx = database.transaction([STORES.patients], 'readonly')
  const store = tx.objectStore(STORES.patients)

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const getCachedPatient = async (id) => {
  const database = await getDB()
  const tx = database.transaction([STORES.patients], 'readonly')
  const store = tx.objectStore(STORES.patients)

  return new Promise((resolve, reject) => {
    const request = store.get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Offline queue for actions
export const queueAction = async (action) => {
  const database = await getDB()
  const tx = database.transaction([STORES.queue], 'readwrite')
  const store = tx.objectStore(STORES.queue)
  
  store.add({
    ...action,
    timestamp: Date.now(),
  })

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export const getQueuedActions = async () => {
  const database = await getDB()
  const tx = database.transaction([STORES.queue], 'readonly')
  const store = tx.objectStore(STORES.queue)

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const clearQueuedAction = async (id) => {
  const database = await getDB()
  const tx = database.transaction([STORES.queue], 'readwrite')
  const store = tx.objectStore(STORES.queue)
  
  store.delete(id)

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Check online status and sync
export const isOnline = () => navigator.onLine

export const setupOnlineSyncListener = (syncCallback) => {
  window.addEventListener('online', async () => {
    const queued = await getQueuedActions()
    if (queued.length > 0) {
      await syncCallback(queued)
    }
  })
}

export default {
  cachePatients,
  getCachedPatients,
  getCachedPatient,
  queueAction,
  getQueuedActions,
  clearQueuedAction,
  isOnline,
  setupOnlineSyncListener,
}

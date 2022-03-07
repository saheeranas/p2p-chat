// Create | Update
const storeToLocal = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

// Read
const readFromLocal = (key: string): any => {
  return localStorage.getItem(key);
};

// Delete
const deleteFromLocal = (key: string) => {
  localStorage.removeItem(key);
};

export { storeToLocal, readFromLocal, deleteFromLocal };

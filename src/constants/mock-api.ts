// Utility function for simulating async delays
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

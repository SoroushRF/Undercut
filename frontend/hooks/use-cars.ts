import { MOCK_CARS } from "@/lib/mock-data";
import { Car } from "@/lib/types";

// This hook serves as the "Dummy Gate"
// The Integrator uses this to build pages before the FastAPI backend is online.
export const useCars = () => {
  // Logic can be added here to simulate loading states or errors
  const isLoading = false;
  const error = null;
  const data: Car[] = MOCK_CARS;

  return { data, isLoading, error };
};

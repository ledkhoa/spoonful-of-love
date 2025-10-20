import { create } from 'zustand';

export interface SearchParams {
  q?: string;
  isVegan?: string;
  isVegetarian?: string;
  isGlutenFree?: string;
  isDairyFree?: string;
  isNutFree?: string;
  stage?: string;
  ageInMonths?: string;
}

interface SearchParamsStore {
  params: SearchParams;
  setParams: (params: SearchParams) => void;
  updateParam: (key: keyof SearchParams, value: string | undefined) => void;
  clearAll: () => void;
}

export const useSearchParamsStore = create<SearchParamsStore>((set) => ({
  params: {},
  setParams: (params) => set({ params }),
  updateParam: (key, value) =>
    set((state) => ({
      params:
        value === undefined
          ? (() => {
              const { [key]: _, ...rest } = state.params;
              return rest;
            })()
          : { ...state.params, [key]: value },
    })),
  clearAll: () => set({ params: {} }),
}));

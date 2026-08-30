"use client";

import { createContext, useContext } from "react";

const SearchContext = createContext("");

export function SearchProvider({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

/** The live query from the global search bar. */
export function useSearchQuery(): string {
  return useContext(SearchContext);
}

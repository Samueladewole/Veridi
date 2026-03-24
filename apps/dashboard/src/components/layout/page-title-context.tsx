"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

interface PageTitleContextValue {
  title: string;
  setTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextValue>({
  title: "Dashboard",
  setTitle: () => undefined,
});

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("Dashboard");
  const updateTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  return (
    <PageTitleContext.Provider value={{ title, setTitle: updateTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle(title: string) {
  const { setTitle } = useContext(PageTitleContext);
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
}

export function usePageTitleValue() {
  return useContext(PageTitleContext).title;
}

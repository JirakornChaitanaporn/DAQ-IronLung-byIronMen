"use client";
import { createContext, useContext, useState } from "react";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue>({ value: "", setValue: () => {} });

export function Tabs({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit mb-4">
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div>{children}</div>;
}

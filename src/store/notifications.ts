import { create } from "zustand";

export type Notification = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "info";
};

type State = {
  items: Notification[];
  notify: (n: Omit<Notification, "id">) => string;
  clear: (id?: string) => void;
};

let counter = 0;

export const useNotifications = create<State>((set) => ({
  items: [],
  notify: (n) => {
    counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
    const id = String(counter);
    const item: Notification = { id, ...n };
    set((s) => ({ items: [item, ...s.items] }));
    return id;
  },
  clear: (id) =>
    set((s) =>
      id ? { items: s.items.filter((i) => i.id !== id) } : { items: [] }
    ),
}));

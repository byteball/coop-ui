import { Store } from "@tanstack/store";

interface CoopState {
  status: "idle" | "loading" | "loaded";
  vars: Record<string, unknown>;
}

export const coopStore = new Store<CoopState>({
  status: "idle",
  vars: {},
});

export const setCoopLoading = () => {
  coopStore.setState((prev) => ({ ...prev, status: "loading" }));
};

export const setCoopVars = (vars: Record<string, unknown>) => {
  coopStore.setState(() => ({ status: "loaded", vars }));
};

export const updateCoopVars = (updates: Record<string, unknown>) => {
  coopStore.setState((prev) => {
    const vars = { ...prev.vars };
    for (const [key, value] of Object.entries(updates)) {
      if (value === false) {
        delete vars[key];
      } else {
        vars[key] = value;
      }
    }
    return { ...prev, vars };
  });
};

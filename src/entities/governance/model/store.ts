import { Store } from "@tanstack/store";

interface GovernanceState {
  status: "idle" | "loading" | "loaded";
  vars: Record<string, unknown>;
}

export const governanceStore = new Store<GovernanceState>({
  status: "idle",
  vars: {},
});

export const setGovernanceLoading = () => {
  governanceStore.setState((prev) => ({ ...prev, status: "loading" }));
};

export const setGovernanceVars = (vars: Record<string, unknown>) => {
  governanceStore.setState(() => ({ status: "loaded", vars }));
};

export const updateGovernanceVars = (updates: Record<string, unknown>) => {
  governanceStore.setState((prev) => {
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

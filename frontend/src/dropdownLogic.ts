// dropdownLogic.ts
import { useState } from "react";

// Hook for handling multi-select dropdowns
export function useMultiSelect(defaultValue: string[] = ["All"]) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);

    if (selected.includes("All")) {
      setSelectedValues(["All"]); // Reset to "All" if it's selected
    } else {
      // Remove "All" if other options are selected
      const updatedValues = selectedValues.includes("All")
        ? selected.filter((val) => val !== "All")
        : selected;

      // If all options are deselected, reset to "All"
      setSelectedValues(updatedValues.length > 0 ? updatedValues : ["All"]);
    }
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  return {
    selectedValues,
    handleChange,
    isSelected,
  };
}

// ✅ Function to handle selection logic
export const createHandleChange = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (value: string) => {
  setter((prev) => {
    if (value === "All") return ["All"]; // If "All" is selected, reset everything
    if (prev.includes(value)) {
      const updatedValues = prev.filter((v) => v !== value);
      return updatedValues.length > 0 ? updatedValues : ["All"]; // If all options are removed, reset to "All"
    } else {
      return prev.includes("All") ? [value] : [...prev, value]; // Remove "All" and add the new value
    }
  });
};

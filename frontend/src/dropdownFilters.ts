export const filterOptions = {
    fuelTypes: ["All", "Diesel", "Petrol", "Electric", "CNG", "LPG", "Ethanol", "Hydrogen"],
    transmissions: ["All", "Automatic", "Semi-Automatic", "Manual"],
    bodyTypes: ["All", "Sedan", "SUV", "Coupe", "Convertible", "Compact", "Van","Station Wagon"],
    seatCounts: ["All", ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())],
    doorCounts: ["All", "2", "3", "4", "5", "6"],
    exteriorColors: ["All", "Black", "Grey", "Silver", "White", "Blue", "Yellow", "Violet", "Red", "Orange", "Green", "Gold", "Brown", "Bronze", "Beige", "Metallic"],
    interiorColors: ["All","Blue", "Brown", "Yellow", "Grey", "Beige", "White", "Red", "Orange", "Green", "Black"],
    upholsteries: ["All","Alcantara", "Cloth", "Full leather", "Part leather", "Velour", "Other"]
  };
  
  export const createHandleChange =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) => (value: string) => {
      setter((prev: string[]) => {
        if (value === "All") return []; // If "All" is selected, reset selection
        if (prev.includes(value)) {
          return prev.filter((v) => v !== value); // Deselect option
        } else {
          return [...prev.filter((v) => v !== "All"), value]; // Add selection
        }
      });
    };
  
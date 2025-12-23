import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox.jsx";

const FilterSection = ({
  title,
  options,
  selected,
  onToggle,
  onCheck,
  isExpanded,
}) => (
  <div>
    <div
      className="flex justify-between items-center cursor-pointer hover:text-gray-600 transition border-b border-gray-400/50 px-8 sm:py-12 py-6"
      onClick={() => onToggle(title.toLowerCase().replace(" ", ""))}
    >
      <h3 className="font-normal text-black">{title}</h3>
      <span>{isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
    </div>

    {isExpanded && (
      <div className="flex flex-col gap-4 border-b border-gray-400/50 px-16 py-4 font-sans">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3">
            <Checkbox
              checked={selected.includes(option)}
              onCheckedChange={() => onCheck(option)}
              className="data-[state=checked]:text-black data-[state=checked]:border data-[state=checked]:border-black   h-5 w-5  bg-gradient-to-b from-gray-100 to-gray-200 border-gray-500 hover:border-gray-600/70 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition"
            />
            <span className="text-black text-base">{option}</span>
          </label>
        ))}
      </div>
    )}
  </div>
);

function FilterContainer({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selected, setSelected] = React.useState({
    fuel: [],
    chassis: [],
    transmission: [],
    seats: [],
  });
  const [expandedSections, setExpandedSections] = React.useState({
    fuel: false,
    chassis: false,
    transmission: false,
    seats: false,
  });

  const filters = {
    fuel: ["gasoline", "benzine", "diesel", "electric", "hybrid"],
    chassis: ["sedan", "suv", "hatchback", "convertible", "coupe"],
    transmission: ["manual", "automatic"],
    seats: [2, 4, 5, "5+"],
  };

  const updateFilters = (newSelected) => {
    onFilterChange({
      search: searchTerm,
      fuels: newSelected.fuel,
      chassis: newSelected.chassis,
      transmissions: newSelected.transmission,
      seats: newSelected.seats,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    updateFilters(selected);
  };

  const handleCheck = (type, option) => {
    const newSelected = {
      ...selected,
      [type]: selected[type].includes(option)
        ? selected[type].filter((item) => item !== option)
        : [...selected[type], option],
    };
    setSelected(newSelected);
    updateFilters(newSelected);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="text-black md:w-[18vw] w-full border border-l-0 border-gray-400/50">
      <div className="sm:sticky sm:top-0 sm:max-h-screen sm:overflow-y-auto overflow-y-auto">
        <div className="p-6">
          <input
            type="text"
            placeholder="Filter cars..."
            className="w-full p-4 rounded-lg"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>

        <div className="mt-6">
          {Object.entries(filters).map(([type, options]) => (
            <FilterSection
              key={type}
              title={type.charAt(0).toUpperCase() + type.slice(1)}
              options={options}
              selected={selected[type]}
              onToggle={toggleSection}
              onCheck={(option) => handleCheck(type, option)}
              isExpanded={expandedSections[type]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterContainer;

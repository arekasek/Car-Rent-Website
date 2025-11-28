import React from "react";

function FilterContainer({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFuels, setSelectedFuels] = React.useState([]);
  const [selectedChassis, setSelectedChassis] = React.useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = React.useState([]);
  const [selectedSeats, setSelectedSeats] = React.useState([]);

  const fuelTypes = ["gasoline", "benzine", "diesel", "electric", "hybrid"];
  const chassisTypes = ["sedan", "suv", "hatchback", "convertible", "coupe"];
  const transmissionTypes = ["manual", "automatic"];
  const seatOptions = [2, 4, 5, "5+"];

  const handleModelSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({
      search: value,
      fuels: selectedFuels,
      chassis: selectedChassis,
      transmissions: selectedTransmissions,
      seats: selectedSeats,
    });
  };

  const handleFuelChange = (fuel) => {
    const newFuels = selectedFuels.includes(fuel)
      ? selectedFuels.filter((f) => f !== fuel)
      : [...selectedFuels, fuel];
    setSelectedFuels(newFuels);
    onFilterChange({
      search: searchTerm,
      fuels: newFuels,
      chassis: selectedChassis,
      transmissions: selectedTransmissions,
      seats: selectedSeats,
    });
  };

  const handleChassisChange = (chassis) => {
    const newChassis = selectedChassis.includes(chassis)
      ? selectedChassis.filter((c) => c !== chassis)
      : [...selectedChassis, chassis];
    setSelectedChassis(newChassis);
    onFilterChange({
      search: searchTerm,
      fuels: selectedFuels,
      chassis: newChassis,
      transmissions: selectedTransmissions,
      seats: selectedSeats,
    });
  };

  const handleTransmissionChange = (transmission) => {
    const newTransmissions = selectedTransmissions.includes(transmission)
      ? selectedTransmissions.filter((t) => t !== transmission)
      : [...selectedTransmissions, transmission];
    setSelectedTransmissions(newTransmissions);
    onFilterChange({
      search: searchTerm,
      fuels: selectedFuels,
      chassis: selectedChassis,
      transmissions: newTransmissions,
      seats: selectedSeats,
    });
  };

  const handleSeatsChange = (seat) => {
    const newSeats = selectedSeats.includes(seat)
      ? selectedSeats.filter((s) => s !== seat)
      : [...selectedSeats, seat];
    setSelectedSeats(newSeats);
    onFilterChange({
      search: searchTerm,
      fuels: selectedFuels,
      chassis: selectedChassis,
      transmissions: selectedTransmissions,
      seats: newSeats,
    });
  };

  return (
    <div className="h-screen card-item-shadow text-black w-1/4 bg-slate-500/10 rounded-xl p-4 overflow-y-auto">
      <input
        type="text"
        placeholder="Filter cars..."
        className="w-full p-4 rounded-lg mb-6"
        onChange={handleModelSearch}
        value={searchTerm}
      />

      <div className="mt-6">
        <h3 className="font-semibold mb-4">Fuel Type</h3>
        <div className="flex flex-col gap-3">
          {fuelTypes.map((fuel) => (
            <label
              key={fuel}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedFuels.includes(fuel)}
                onChange={() => handleFuelChange(fuel)}
                className="w-4 h-4 rounded accent-red-500"
              />

              <span className="text-black">{fuel}</span>
            </label>
          ))}
        </div>

        <h3 className="text-black font-semibold mb-4 mt-6">Chassis Type</h3>

        <div className="flex flex-col gap-3">
          {chassisTypes.map((chassis) => (
            <label
              key={chassis}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedChassis.includes(chassis)}
                onChange={() => handleChassisChange(chassis)}
                className="w-4 h-4 rounded"
                name="chassis"
              />
              <span className="text-black">{chassis}</span>
            </label>
          ))}
        </div>

        <h3 className="text-black font-semibold mb-4 mt-6">Transmission</h3>

        <div className="flex flex-col gap-3">
          {transmissionTypes.map((transmission) => (
            <label
              key={transmission}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTransmissions.includes(transmission)}
                onChange={() => handleTransmissionChange(transmission)}
                className="w-4 h-4 rounded"
                name="transmission"
              />
              <span className="text-black">{transmission}</span>
            </label>
          ))}
        </div>

        <h3 className="text-black font-semibold mb-4 mt-6">Seats</h3>

        <div className="flex flex-col gap-3">
          {seatOptions.map((seat) => (
            <label
              key={seat}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSeats.includes(seat)}
                onChange={() => handleSeatsChange(seat)}
                className="w-4 h-4 rounded"
                name="seats"
              />
              <span className="text-black">{seat}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterContainer;

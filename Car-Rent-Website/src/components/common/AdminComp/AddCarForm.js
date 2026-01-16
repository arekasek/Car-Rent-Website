"use client";

import { FiPlus } from "react-icons/fi";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const AddCarForm = ({
  showForm,
  setShowForm,
  editingId,
  formData,
  onInputChange,
  onSubmit,
  onReset,
}) => {
  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            onReset();
          }}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          <FiPlus /> Add New Car
        </button>
      </div>
      {showForm && (
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Edit Car" : "Add New Car"}
          </h2>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormInput
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={onInputChange}
              required
            />
            <FormInput
              label="Model"
              name="model"
              value={formData.model}
              onChange={onInputChange}
              required
            />
            <FormInput
              label="Color"
              name="color"
              value={formData.color}
              onChange={onInputChange}
            />
            <FormInput
              label="Image Front URL"
              name="imagefront"
              value={formData.imagefront}
              onChange={onInputChange}
            />
            <FormInput
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={onInputChange}
            />
            <FormInput
              label="Price ($/day)"
              name="price"
              type="number"
              value={formData.price}
              onChange={onInputChange}
              required
            />

            <FormInput
              label="Fuel"
              name="data.fuel"
              value={formData.data.fuel}
              onChange={onInputChange}
              placeholder="e.g., gasoline, diesel"
            />
            <FormInput
              label="Year"
              name="data.year"
              value={formData.data.year}
              onChange={onInputChange}
            />
            <FormInput
              label="Doors"
              name="data.doors"
              value={formData.data.doors}
              onChange={onInputChange}
            />
            <FormInput
              label="Drive Type"
              name="data.drive"
              value={formData.data.drive}
              onChange={onInputChange}
              placeholder="e.g., RWD, AWD, FWD"
            />
            <FormInput
              label="Seats"
              name="data.seats"
              value={formData.data.seats}
              onChange={onInputChange}
            />
            <FormInput
              label="Engine"
              name="data.engine"
              value={formData.data.engine}
              onChange={onInputChange}
              placeholder="e.g., 5.4L V8 Engine"
            />
            <FormInput
              label="Chassis Type"
              name="data.chassis"
              value={formData.data.chassis}
              onChange={onInputChange}
              placeholder="e.g., Coupe, Sedan, SUV"
            />
            <FormInput
              label="Horse Power"
              name="data.horsePower"
              value={formData.data.horsePower}
              onChange={onInputChange}
              placeholder="e.g., 500 HP"
            />
            <FormSelect
              label="Transmission"
              name="data.transmission"
              value={formData.data.transmission}
              onChange={onInputChange}
              options={[
                { value: "manual", label: "Manual" },
                { value: "automatic", label: "Automatic" },
              ]}
            />

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="data.description"
                value={formData.data.description}
                onChange={onInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {editingId ? "Update Car" : "Create Car"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  onReset();
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

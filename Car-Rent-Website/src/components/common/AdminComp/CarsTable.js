"use client";

import { FiEdit, FiTrash2 } from "react-icons/fi";

export const CarsTable = ({ cars, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Brand
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Model
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Color
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Price ($/day)
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Fuel
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Chassis
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr
              key={car.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-gray-800">{car.brand}</td>
              <td className="px-6 py-4 text-gray-800">{car.model}</td>
              <td className="px-6 py-4 text-gray-800">{car.color}</td>
              <td className="px-6 py-4 text-gray-800">${car.price || 0}</td>
              <td className="px-6 py-4 text-gray-800 capitalize">
                {car.data?.fuel || "-"}
              </td>
              <td className="px-6 py-4 text-gray-800 capitalize">
                {car.data?.chassis || "-"}
              </td>
              <td className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => onEdit(car)}
                  className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => onDelete(car.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  <FiTrash2 /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

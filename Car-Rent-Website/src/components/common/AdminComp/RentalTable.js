"use client";

export const RentalTable = ({ rentals, formatDate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Rental Period
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Total Price
            </th>
            <th className="px-6 py-3 text-left text-gray-800 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental, idx) => (
            <tr
              key={rental.id || idx}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-gray-800">
                {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
              </td>
              <td className="px-6 py-4 text-gray-800">
                {formatDate(rental.start_date)}
              </td>
              <td className="px-6 py-4 text-gray-800">
                {formatDate(rental.end_date)}
              </td>
              <td className="px-6 py-4 text-gray-800 font-semibold">
                ${rental.total_price || 0}
              </td>
              <td className="px-6 py-4">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {rental.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

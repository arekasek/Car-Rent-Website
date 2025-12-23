"use client";

export const StatsCard = ({ icon: Icon, title, value, bgColor }) => {
  return (
    <div className="p-8 bg-slate-50 flex flex-col justify-center items-center gap-4 rounded-lg">
      <div className="flex flex-row items-center gap-6">
        <div className={`${bgColor} text-5xl p-3 rounded-full text-white`}>
          <Icon />
        </div>
        <span className="text-xl font-bold">{title}</span>
      </div>
      <p className="text-3xl text-gray-800 mt-4">{value}</p>
    </div>
  );
};

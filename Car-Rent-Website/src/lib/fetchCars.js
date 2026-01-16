const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function fetchCars() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/cars`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Failed to fetch cars");
    }

    const data = await res.json();
    console.log("Fetched cars:", data);

    const cars = Array.isArray(data) ? data : data.data || [];
    return cars;
  } catch (error) {
    console.error("Error in fetchCars():", error);
    return [];
  }
}

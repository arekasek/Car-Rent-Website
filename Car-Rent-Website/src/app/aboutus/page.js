"use client";
import Sidebar from "../Sidebar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="h-full px-6 py-20 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-thunder mb-8">About Us</h1>

      <div className="space-y-6 text-gray-600 leading-relaxed">
        <p>
          <strong>Rent Your Dream Car</strong> was created for people who expect
          more than just transportation. We believe that driving should be an
          experience — comfortable, stylish, and tailored to your needs.
        </p>

        <div className="my-10">
          <Image
            src="/img/about-exterior.jpg"
            alt="Luxury car rental showroom exterior"
            width={1200}
            height={700}
            className="rounded-xl object-cover"
          />
        </div>

        <p>
          Our mission is simple: to give you access to reliable, well-maintained
          vehicles that fit every lifestyle — from everyday city driving to
          luxury getaways and special occasions.
        </p>

        <p>We carefully select our fleet to ensure:</p>

        <ul className="list-disc list-inside space-y-2">
          <li>Comfort and safety</li>
          <li>Modern technology</li>
          <li>Competitive pricing</li>
          <li>Vehicles you can truly enjoy driving</li>
        </ul>

        <p>
          Whether you need a car for a weekend trip, a business meeting, or a
          longer journey, we make the rental process fast, transparent, and
          hassle-free.
        </p>

        <p className="text-gray-800 font-medium">
          With <strong>Rent Your Dream Car</strong>, you don’t just rent a
          vehicle — you choose freedom, confidence, and the joy of driving.
        </p>
      </div>
      <Sidebar />
    </div>
  );
}

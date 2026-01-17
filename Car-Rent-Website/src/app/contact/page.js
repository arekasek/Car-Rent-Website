"use client";
import Sidebar from "../Sidebar";
import Script from "next/script";
import { useState } from "react";

export default function ContactPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!window.grecaptcha) {
      alert("reCAPTCHA not loaded");
      return;
    }

    const captchaResponse = window.grecaptcha.getResponse();

    if (!captchaResponse) {
      setError("Please confirm you are not a robot.");
      return;
    }

    const fd = new FormData(e.target);

    fd.append("g-recaptcha-response", captchaResponse);

    try {
      const res = await fetch("https://formspree.io/f/mvzzpkgv", {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
        },
      });

      setSuccess(true);
      setError("");
      window.grecaptcha.reset();
      e.target.reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      <div className="h-full px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-thunder mb-4">Contact</h1>

        <p className="mb-10 text-gray-600">
          Have questions? Get in touch with us.
        </p>

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Your message has been sent successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-thunder">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-4 py-2"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-1 font-thunder">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-4 py-2"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-thunder">Message</label>
            <textarea
              name="message"
              rows="5"
              className="w-full border rounded px-4 py-2"
              placeholder="Your message"
            />
          </div>

          {error && (
            <div className="relative">
              <div className="absolute -top-14 left-0 bg-black text-white text-sm px-4 py-2 rounded shadow-lg">
                {error}
                <div className="absolute left-4 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black"></div>
              </div>
            </div>
          )}

          <div
            className="g-recaptcha"
            data-sitekey="6LfJlkQsAAAAAPMMXnXRinNOBZFwUXk01wx2K9t6"
          ></div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
          >
            Send
          </button>
        </form>

        <Sidebar />
      </div>
    </>
  );
}

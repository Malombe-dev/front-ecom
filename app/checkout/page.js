"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState(user?.phone || "");
  const [landmark, setLandmark] = useState("");
  const [coords, setCoords] = useState(null);
  const [notes, setNotes] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(null);

  // Uses the browser's geolocation + OpenStreetMap's free Nominatim reverse-geocoding API
  // to suggest a nearby landmark. The user can still edit it manually.
  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Location isn't supported on this device — please type your nearest landmark manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const suggestion =
            data.name || data.address?.suburb || data.address?.road || data.display_name?.split(",")[0];
          if (suggestion) setLandmark(suggestion);
        } catch {
          // silently ignore — user can still type manually
        }
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. Please enter your nearest landmark manually.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/orders", {
        method: "POST",
        auth: true,
        body: { phone, landmark, latitude: coords?.latitude, longitude: coords?.longitude, deliveryNotes: notes },
      });
      setPlaced(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-ink-900">Order placed!</h1>
        <p className="text-ink-500">We'll be in touch within 12 hours to confirm delivery details.</p>
        <button
          onClick={() => router.push("/account/orders")}
          className="mt-6 rounded-card bg-brand-900 px-6 py-2.5 font-semibold text-white hover:bg-brand-600"
        >
          View my orders
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Checkout</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-900">Phone number</label>
          <input
            required value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712 345 678"
            className="w-full rounded-card border border-ink-300/50 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-900">Nearest landmark</label>
          <input
            required value={landmark} onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Near Total Petrol Station, Ngong Road"
            className="w-full rounded-card border border-ink-300/50 px-3 py-2"
          />
          <button
            type="button" onClick={useMyLocation} disabled={locating}
            className="mt-2 text-sm text-brand-600 hover:underline disabled:opacity-50"
          >
            {locating ? "Locating..." : "📍 Use my current location"}
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-900">Delivery notes (optional)</label>
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            className="w-full rounded-card border border-ink-300/50 px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-danger-600">{error}</p>}

        <button className="rounded-card bg-accent-500 py-3 font-semibold text-brand-900 hover:bg-accent-600">
          Place order
        </button>
      </form>
    </div>
  );
}

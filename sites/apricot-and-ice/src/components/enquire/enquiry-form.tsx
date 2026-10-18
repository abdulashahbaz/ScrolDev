"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";

type Option = { slug: string; name: string; departures: string[] };

export function EnquiryForm({ journeys }: { journeys: Option[] }) {
  const params = useSearchParams();
  const initialJourney = journeys.some((j) => j.slug === params.get("journey")) ? params.get("journey")! : "";
  const [journey, setJourney] = useState(initialJourney);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const dates = journeys.find((j) => j.slug === journey)?.departures ?? [];
  const initialDate = params.get("date") ?? "";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
    setSentTo(name.split(" ")[0] || "there");
  };

  if (sentTo) {
    return (
      <div className="form-done" role="status">
        <p className="eyebrow">Thank you</p>
        <h2 className="display">Thanks, {sentTo}.</h2>
        <p className="lede">
          This is a concept site by ScrolDev, so nothing was sent. On a live site, your enquiry would now be with the team in Karimabad.
        </p>
        <button type="button" className="button button-dark" onClick={() => setSentTo(null)}>
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={onSubmit}>
      <div className="field-row">
        <label className="field">
          <span>Your name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Journey</span>
          <select name="journey" value={journey} onChange={(e) => setJourney(e.target.value)}>
            <option value="">Not sure yet</option>
            {journeys.map((j) => (
              <option key={j.slug} value={j.slug}>
                {j.name}
              </option>
            ))}
            <option value="private">A private journey</option>
          </select>
        </label>
        <label className="field">
          <span>Departure</span>
          <select name="date" defaultValue={dates.includes(initialDate) ? initialDate : ""} key={journey}>
            <option value="">{dates.length ? "Any date" : "Flexible"}</option>
            {dates.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="field">
        <legend>Travellers</legend>
        <div className="segmented">
          {["1", "2", "3–4", "5–8"].map((n, i) => (
            <label key={n}>
              <input type="radio" name="travellers" value={n} defaultChecked={i === 1} />
              <span>{n}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field">
        <span>Anything we should know?</span>
        <textarea name="message" rows={5} placeholder="Interests, pace, dietary needs, the one thing you don't want to miss…" />
      </label>
      <button type="submit" className="button button-dark button-large">
        Send enquiry <Icon name="arrow" size={18} />
      </button>
      <p className="fine-print">Concept site: this form doesn&apos;t send anything.</p>
    </form>
  );
}

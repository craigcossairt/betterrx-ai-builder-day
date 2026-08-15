export type PitchPacket = {
  ai: {
    costUsdPerOrder: 0;
    baseline: string;
    whySkip: string;
    safety: string;
  };
  differentiation: {
    today: string;
    us: string;
  };
  integration: {
    emr: "HCHB";
    inn: readonly [string, string];
    out: string;
    diagram: string;
    wellsky: string;
  };
};

export const pitchPacket = {
  ai: {
    costUsdPerOrder: 0,
    baseline:
      "eta > deadline. Rank beats the discharge window, then price, then known stock.",
    whySkip:
      "A model writing the why sentence loses to this template. Six synthetic rows are not a history.",
    safety:
      "Statuses and patient facts are stored state. High-stakes actions stay a human tap. No model runs.",
  },
  differentiation: {
    today:
      "Phone, fax, or a vendor portal. No shared ETA. Pickup starts with another call.",
    us: "Three-factor cards (stock, ETA, price). At-risk before late, in words. SMS confirm with no login. DON cost PPD vs a labeled target.",
  },
  integration: {
    emr: "HCHB",
    inn: [
      "newOrUpdatePatient (demographics, ICD-10, allergies)",
      "newMedications (NDC, SIG, prescriber NPI)",
    ],
    out: "DME status events keyed by patient.identifiers",
    diagram: `flowchart LR
  adt[ADT newOrUpdatePatient] --> board[This board]
  meds[newMedications] --> board
  board --> dme[DME status events]
  dme --> hchb[HCHB partner layer]`,
    wellsky:
      "WellSky bought DME software in 2024, so some agencies may already have bundled tooling.",
  },
} as const satisfies PitchPacket;

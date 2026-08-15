export type PitchScenario = {
  id: "discharge" | "pickup" | "ppd";
  title: string;
  who: string;
  href: string;
  tap: string;
};

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
  scenarios: readonly [PitchScenario, PitchScenario, PitchScenario];
  flow: readonly [
    { title: string; detail: string },
    { title: string; detail: string },
    { title: string; detail: string },
    { title: string; detail: string },
  ];
  assumptions: readonly [string, string, string];
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
  scenarios: [
    {
      id: "discharge",
      title: "Discharge-ready miss",
      who: "Margaret Holt",
      href: "/?role=admissions&patient=PT-88502&tab=dme",
      tap: "Open Margaret. The oxygen misses the 4:30 discharge. At-risk says why.",
    },
    {
      id: "pickup",
      title: "Post-death pickup",
      who: "Ray Delgado",
      href: "/?role=case_manager&patient=PT-87411&tab=dme",
      tap: "Ray is four days late. Helen Vargas is the EMR death fallback. Chrome fires that event.",
    },
    {
      id: "ppd",
      title: "Prevent a miss",
      who: "Director of nursing",
      href: "/?role=don&surface=desktop&panel=oversight",
      tap: "DME cost PPD vs the $1.85 fixture target. Idle pickup days on Ray.",
    },
  ],
  flow: [
    {
      title: "Hospice ADT",
      detail: "newOrUpdatePatient. Demographics, ICD-10, allergies.",
    },
    {
      title: "BetterRX eRx",
      detail: "newMedications. NDC, SIG, prescriber NPI.",
    },
    {
      title: "This board",
      detail:
        "DME lines with HCPCS E-codes on the same patient.identifiers. Eleanor Bishop is the FAQ payload.",
    },
    {
      title: "HCHB partner layer",
      detail: "DME status events out. No live EMR this weekend.",
    },
  ],
  assumptions: [
    "ETAs and stock are fixture, not a live vendor API.",
    "Vendor confirm is a simulated text. No live SMS.",
    "DME PPD dollars are synthetic except CMS-shaped E0250 and E1390 rates.",
  ],
} as const satisfies PitchPacket;

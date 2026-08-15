export type OrderPatient = {
  id: string;
  hospice: string;
  displayName: string;
};

export function PatientChips({
  patients,
  selectedId,
  onPick,
}: {
  patients: readonly OrderPatient[];
  selectedId: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="patient-chips" role="listbox" aria-label="Patient">
      {patients.map((patient) => (
        <button
          key={patient.id}
          type="button"
          role="option"
          aria-selected={selectedId === patient.id}
          className={
            selectedId === patient.id
              ? "patient-chip patient-chip--on"
              : "patient-chip"
          }
          onClick={() => onPick(patient.id)}
        >
          {patient.displayName}
        </button>
      ))}
    </div>
  );
}

interface OnboardingStepperProps {
  step: 2 | 3;
  label: string;
}

const TOTAL_STEPS = 3;

export default function OnboardingStepper({ step, label }: OnboardingStepperProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-4 pt-4">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((segment) => (
          <div
            key={segment}
            className={
              segment <= step
                ? "h-1 flex-1 rounded-full bg-emerald-600"
                : "h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"
            }
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
        {step}/{TOTAL_STEPS} · {label}
      </span>
    </div>
  );
}

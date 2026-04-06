import { Check } from "lucide-react";

interface DayActivity {
  label: string;
  completed: boolean;
}

interface DayDashboardProps {
  dayNumber: number;
  activities?: DayActivity[];
}

const DayDashboard = ({ dayNumber, activities = [] }: DayDashboardProps) => {
  const completedCount = activities.filter((a) => a.completed).length;

  return (
    <div className="space-y-4">
      {/* Activities checklist */}
      <div className="levvia-card p-4">
        <h3 className="text-[14px] font-heading font-semibold text-levvia-fg mb-3">
          Atividades Completadas
        </h3>
        {activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                    act.completed ? "border-levvia-success" : "border-white/[0.12]"
                  }`}
                >
                  {act.completed && (
                    <Check size={13} strokeWidth={2.5} className="text-levvia-success" />
                  )}
                </div>
                <span
                  className={`text-[13px] font-body ${
                    act.completed
                      ? "line-through text-levvia-muted"
                      : "text-levvia-fg"
                  }`}
                >
                  {act.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-levvia-muted font-body">
            Nenhuma atividade registrada.
          </p>
        )}

        {activities.length > 0 && (
          <p className="text-[11px] text-levvia-muted font-body mt-3">
            {completedCount}/{activities.length} atividades completadas
          </p>
        )}
      </div>

      {/* Placeholder cards for future features */}
      <div className="levvia-card p-4 text-center">
        <h3 className="text-[14px] font-heading font-semibold text-levvia-fg mb-2">
          🔥 Fogo Interno
        </h3>
        <p className="text-[12px] text-levvia-muted font-body">
          Score será calculado com dados acumulados
        </p>
      </div>
    </div>
  );
};

export default DayDashboard;

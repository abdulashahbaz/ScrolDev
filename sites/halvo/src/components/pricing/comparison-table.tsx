import { Check, Minus } from "lucide-react";
import { comparison, plans } from "@/content/pricing";
import { cn } from "@/lib/cn";

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto size-4 text-ember" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto size-4 text-white/20" aria-label="Not included" />;
  return <span className="text-[14px] text-bone/90">{value}</span>;
}

export function ComparisonTable() {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left">
        <caption className="sr-only">Compare Halvo plans</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[40%] pb-6 text-sm font-normal text-dim">
              Features
            </th>
            {plans.map((p) => (
              <th
                key={p.id}
                scope="col"
                className={cn("pb-6 text-center text-[15px] font-medium", p.featured ? "text-ember" : "text-bone")}
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        {comparison.map((group) => (
          <tbody key={group.group}>
            <tr>
              <th colSpan={4} scope="colgroup" className="border-b border-white/[0.08] pb-3 pt-10 text-left">
                <span className="eyebrow text-mute">{group.group}</span>
              </th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.label} className="group">
                <th
                  scope="row"
                  className="border-b border-white/[0.05] py-4 pr-4 text-[14px] font-normal text-mute group-hover:text-bone"
                >
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className={cn(
                      "border-b border-white/[0.05] px-4 py-4 text-center",
                      plans[i].featured && "bg-ember/[0.03]",
                    )}
                  >
                    <Cell value={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

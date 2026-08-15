import { CATALOG } from "@/domain/catalog";
import type { Hcpcs } from "@/domain/order";
import { skuLabel } from "@/project/order-copy";

export function SkuRow({
  selected,
  onPick,
}: {
  selected: Hcpcs;
  onPick: (hcpcs: Hcpcs) => void;
}) {
  return (
    <div className="sku-row">
      {CATALOG.map((sku) => (
        <button
          key={sku.hcpcs}
          type="button"
          className={
            selected === sku.hcpcs ? "sku-tile sku-tile--on" : "sku-tile"
          }
          onClick={() => onPick(sku.hcpcs)}
        >
          {skuLabel(sku.hcpcs)}
          <span>${sku.dailyRateUsd.toFixed(2)}/day</span>
        </button>
      ))}
    </div>
  );
}

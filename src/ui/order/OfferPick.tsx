import type { Instant } from "@/domain/clock";
import type { OfferCard } from "@/domain/offers";
import { offerStory } from "@/project/order-copy";
import { formatVendor } from "@/ui/format";

export function OfferPick({
  cards,
  selectedId,
  deadline,
  onPick,
}: {
  cards: readonly OfferCard[];
  selectedId: string;
  deadline: Instant;
  onPick: (vendorId: OfferCard["vendorId"]) => void;
}) {
  return (
    <div className="offer-stack">
      {cards.map((card) => {
        const story = offerStory(card, deadline);
        const on = selectedId === card.vendorId;
        return (
          <button
            key={card.vendorId}
            type="button"
            className={
              on
                ? card.preferred
                  ? "offer-card offer-card--best offer-card--on"
                  : "offer-card offer-card--on"
                : card.preferred
                  ? "offer-card offer-card--best"
                  : "offer-card"
            }
            onClick={() => onPick(card.vendorId)}
          >
            <div className="offer-card-top">
              <b>{formatVendor(card.vendorId)}</b>
              <span className="offer-mark">{story.mark}</span>
            </div>
            <p className="offer-headline">{story.headline}</p>
            <p className="offer-detail">{story.detail}</p>
          </button>
        );
      })}
    </div>
  );
}

import { useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import doorL from "@/assets/door-left.webp.asset.json";
import doorR from "@/assets/door-right.webp.asset.json";
import wallpaper from "@/assets/damask-wallpaper.webp.asset.json";
import monogram from "@/assets/monogram.png.asset.json";
import openBtn from "@/assets/open-btn.png.asset.json";
import gardenPath from "@/assets/garden-path.webp.asset.json";
import bouquet from "@/assets/flower-burgundy.webp.asset.json";
import { Twinkles } from "./LiveOrnaments";
import { WEDDING } from "@/lib/wedding";

const EASE = [0.65, 0, 0.35, 1] as const;

/** A glowing brass sconce mounted on the wall beside the door. */
function Sconce({ side }: { side: "left" | "right" }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute top-[30%] w-[16%] ${side === "left" ? "-left-[22%]" : "-right-[22%]"}`}>
      <div className="wall-sconce glow-pulse absolute left-1/2 top-0 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2" />
      <div className="wall-sconce-cup relative mx-auto aspect-[3/2] w-[55%]" />
      <div className="mx-auto h-[clamp(14px,4vw,24px)] w-[3px] bg-gold-grad" />
    </div>
  );
}

/**
 * Scene 1–2: a palace wall papered in navy-and-gold damask, with a wide carved double door.
 * Tapping the door swings both leaves inward while the camera eases forward and a light
 * opening from the doorway reveals the garden film beneath.
 */
export function Cover({ guest, onOpenStart, onOpened }: { guest: string; onOpenStart: () => void; onOpened: () => void }) {
  const reduce = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const doorRef = useRef<HTMLDivElement>(null);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const r = useMotionValue(-120);
  const r2 = useTransform(r, (v) => v + 120);
  const mask = useMotionTemplate`radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, black ${r2}px)`;
  const origin = useMotionTemplate`${cx}px ${cy}px`;

  const DOOR = reduce ? 0.6 : 2.6;

  const open = () => {
    if (opening) return;
    const rect = doorRef.current?.getBoundingClientRect();
    if (rect) {
      cx.set(rect.left + rect.width / 2);
      cy.set(rect.top + rect.height / 2);
    }
    setOpening(true);
    onOpenStart();
    const max = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;
    animate(r, max, { duration: reduce ? 0.8 : 2.2, delay: reduce ? 0 : 1.3, ease: [0.5, 0, 0.3, 1] });
    window.setTimeout(onOpened, (reduce ? 0.9 : DOOR + 1.1) * 1000);
  };

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <motion.div className="absolute inset-0" style={opening ? { WebkitMaskImage: mask, maskImage: mask } : {}}>
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: origin }}
          animate={opening && !reduce ? { scale: 1.22 } : { scale: 1 }}
          transition={{ duration: DOOR + 1, ease: EASE }}
        >
          {/* the papered wall */}
          <div className="wall-damask absolute inset-0" style={{ backgroundImage: `url(${wallpaper.url})` }} />
          <div className="wall-shade absolute inset-0" />
          <div className="wall-crown absolute inset-x-0 top-0 h-3" />
          <div className="wall-wainscot absolute inset-x-0 bottom-[6%] h-[15%]" />
          <div className="wall-floor absolute inset-x-0 bottom-0 h-[6%]" />
          <Twinkles count={10} seed={7} />

          <div className="relative z-10 flex h-full flex-col items-center px-5 pb-[6dvh] pt-[max(4.5dvh,22px)] text-center">
            {/* framed plaque with the names */}
            <motion.div
              className="wall-plaque flex w-full max-w-sm flex-col items-center rounded-sm sm:max-w-lg px-5 py-4 sm:py-5"
              animate={opening ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-[0.45em] text-cream/80 sm:text-[11px]">The Wedding of</p>
              <h1 className="mt-1 font-script text-[clamp(2.3rem,11vw,3.6rem)] leading-tight text-gold-grad">
                {WEDDING.bride} & {WEDDING.groom}
              </h1>
              <p className="font-display text-base italic text-cream/85 sm:text-lg">18 & 20 Desember 2026</p>
              <div className="mt-3 h-px w-24 bg-gold-grad opacity-60" />
              <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-cream/70">Kepada Yth.</p>
              <p className="max-w-full truncate font-display text-xl font-semibold text-ivory">{guest}</p>
            </motion.div>

            {/* the wide double door set into the wall */}
            <div ref={doorRef} className="relative mt-auto w-[min(84vw,calc(47dvh*0.74),520px)]">
              <Sconce side="left" />
              <Sconce side="right" />

              {/* pediment with the monogram, then the gilded cornice */}
              <div className="relative mx-auto h-[clamp(34px,10vw,54px)] w-[64%]">
                <div className="door-pediment absolute inset-0" />
                <div className="door-pediment-inner absolute bottom-0 left-[7%] right-[7%] top-[16%]" />
                <motion.img
                  src={monogram.url}
                  alt="Monogram S&L"
                  className="absolute bottom-[4%] left-1/2 h-[72%] -translate-x-1/2 object-contain"
                  animate={opening ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="door-cornice relative -mx-[5%] h-[clamp(10px,2.6vw,16px)] rounded-[2px]" />

              <div className="door-casing p-[clamp(7px,2vw,12px)]">
                <button
                  type="button"
                  onClick={open}
                  aria-label="Buka pintu undangan"
                  className="door-opening group relative block aspect-[37/50] w-full cursor-pointer overflow-hidden"
                  style={{ perspective: 1300 }}
                >
                  {/* the garden waiting behind the door */}
                  <img src={gardenPath.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <motion.div
                    className="door-light absolute inset-0"
                    initial={{ opacity: 0.25 }}
                    animate={opening ? { opacity: 1, scale: 1.2 } : { opacity: 0.25 }}
                    transition={{ duration: 1.8 }}
                  />
                  <motion.img
                    src={doorL.url}
                    alt=""
                    className="door-leaf-shadow absolute left-0 top-0 h-full w-1/2 object-fill transition-[filter] duration-500 group-hover:brightness-110"
                    style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
                    animate={opening ? { rotateY: 84 } : { rotateY: 0 }}
                    transition={{ duration: DOOR, ease: EASE }}
                  />
                  <motion.img
                    src={doorR.url}
                    alt=""
                    className="door-leaf-shadow absolute right-0 top-0 h-full w-1/2 object-fill transition-[filter] duration-500 group-hover:brightness-110"
                    style={{ transformOrigin: "right center", backfaceVisibility: "hidden" }}
                    animate={opening ? { rotateY: -84 } : { rotateY: 0 }}
                    transition={{ duration: DOOR, ease: EASE }}
                  />
                  {/* wax seal over the seam: "Buka Undangan" */}
                  <motion.img
                    src={openBtn.url}
                    alt="Buka Undangan"
                    className="floaty absolute left-1/2 top-[58%] w-[28%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_6px_10px_oklch(0.08_0.03_262/0.7)]"
                    animate={opening ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </button>
              </div>
              <div className="door-step relative -mx-[7%] h-[clamp(8px,2vw,14px)] rounded-sm" />

              {/* bouquets standing at the foot of the door */}
              <img src={bouquet.url} alt="" className="bloom-shadow pointer-events-none absolute -bottom-[4%] -left-[18%] w-[44%]" />
              <img src={bouquet.url} alt="" className="bloom-shadow pointer-events-none absolute -bottom-[4%] -right-[18%] w-[44%] -scale-x-100" />
            </div>
          </div>

          <motion.p
            className="absolute inset-x-0 bottom-[1.6dvh] z-10 text-center text-[10px] uppercase tracking-[0.3em] text-ivory/80"
            animate={opening ? { opacity: 0 } : { opacity: 1 }}
          >
            Sentuh pintu untuk masuk
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

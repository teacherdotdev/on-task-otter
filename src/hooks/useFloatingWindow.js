import { useCallback, useEffect, useState } from "react";
import { setClockWindow } from "../utils/clock";

/**
 * Floats the otter's room in a small window that stays on top of every other
 * tab and app, using the browser's Document Picture-in-Picture. A teacher can
 * then show a slideshow or another site while the class still sees the otter.
 *
 * Only Chrome and Edge on a computer can do this, and only from a page in its
 * own tab: a page embedded inside another site is never allowed to float.
 *
 * Ported from Geometric Solids (3d-surface-area-volume/src/routes/+page.svelte).
 */

const pictureInPicture = () => window.documentPictureInPicture ?? null;
const isEmbedded = () => {
  try { return window.self !== window.top; } catch { return true; }
};

/**
 * A floating window starts with an empty document, so every stylesheet is
 * copied in to make it look the same as the tab. A stylesheet from another
 * site (the Google font) keeps its rules private, so it is linked instead.
 */
const copyStyles = (source, target) => {
  for (const sheet of source.styleSheets) {
    try {
      const style = target.createElement("style");
      style.textContent = Array.from(sheet.cssRules, (rule) => rule.cssText).join("\n");
      target.head.append(style);
    } catch {
      if (!sheet.href) continue;
      const link = target.createElement("link");
      link.rel = "stylesheet";
      link.href = sheet.href;
      target.head.append(link);
    }
  }
};

export const useFloatingWindow = () => {
  const [floatingWindow, setFloatingWindow] = useState(null);

  useEffect(() => {
    setClockWindow(floatingWindow);
    if (!floatingWindow) return;
    // The browser's own back-to-tab button, or closing the window, brings the
    // room home.
    const returnHome = () => setFloatingWindow(null);
    floatingWindow.addEventListener("pagehide", returnHome, { once: true });
    return () => {
      floatingWindow.removeEventListener("pagehide", returnHome);
      floatingWindow.close();
      setClockWindow(null);
    };
  }, [floatingWindow]);

  const open = useCallback(async ({ width, height, title }) => {
    const floating = await pictureInPicture().requestWindow({ width, height });
    const target = floating.document;
    // Pictures in the room are linked from the app's own address.
    const base = target.createElement("base");
    base.href = document.baseURI;
    target.head.append(base);
    target.title = title;
    target.documentElement.lang = document.documentElement.lang;
    target.documentElement.dir = document.documentElement.dir;
    copyStyles(document, target);
    setFloatingWindow(floating);
  }, []);

  const close = useCallback(() => setFloatingWindow(null), []);

  return {
    isSupported: Boolean(pictureInPicture()) && !isEmbedded(),
    window: floatingWindow,
    open,
    close,
  };
};

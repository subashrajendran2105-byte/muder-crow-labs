/* Murder Crow — real crow interaction sound.
   Source: American Crow.ogg by G McGrane, Wikimedia Commons, public domain.
   https://commons.wikimedia.org/wiki/File:American_Crow.ogg
*/
(() => {
  if (window.__murderCrowRealSound) return;
  window.__murderCrowRealSound = true;

  const SOURCE = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/American_Crow.ogg';
  const clip = new Audio(SOURCE);
  clip.preload = 'auto';
  clip.volume = 0.22;

  let flightPlayed = false;
  let clickBusy = false;

  const playOne = (duration = 1050) => {
    try {
      clip.pause();
      clip.currentTime = 0;
      const p = clip.play();
      if (p && p.catch) p.catch(() => {});
      window.setTimeout(() => {
        try { clip.pause(); } catch (_) {}
      }, duration);
    } catch (_) {}
  };

  // Normal site buttons/links: three short real-crow calls.
  const playThree = () => {
    if (clickBusy) return;
    clickBusy = true;
    playOne();
    window.setTimeout(() => playOne(), 1250);
    window.setTimeout(() => {
      playOne();
      window.setTimeout(() => { clickBusy = false; }, 1050);
    }, 2500);
  };

  // Crow itself: one signature flight caw only once per page.
  const playFlightOnce = () => {
    if (flightPlayed) return;
    flightPlayed = true;
    playOne(1250);
  };

  document.addEventListener('click', (event) => {
    const crow = event.target.closest?.('.crow3d');
    if (crow) {
      playFlightOnce();
      return;
    }

    const interactive = event.target.closest?.('a, button, .btn, .navcta, [role="button"]');
    if (interactive) playThree();
  }, true);
})();

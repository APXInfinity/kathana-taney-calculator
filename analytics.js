(() => {
  'use strict';

  // After creating the GoatCounter site, put only your site code here.
  // Example: if your dashboard is https://kathana-tools.goatcounter.com
  // then use: const GOATCOUNTER_CODE = 'kathana-tools';
  const GOATCOUNTER_CODE = '';

  const OPT_OUT_KEY = 'kathana.analytics.ownerOptOut';

  function isOwnerExcluded() {
    try { return localStorage.getItem(OPT_OUT_KEY) === '1'; }
    catch { return false; }
  }

  window.KathanaAnalytics = {
    isOwnerExcluded,
    excludeThisBrowser() {
      try { localStorage.setItem(OPT_OUT_KEY, '1'); } catch {}
      return true;
    },
    includeThisBrowser() {
      try { localStorage.removeItem(OPT_OUT_KEY); } catch {}
      return true;
    }
  };

  // Never load analytics on a browser marked as the site owner.
  if (isOwnerExcluded()) return;

  // Analytics remains safely disabled until a real GoatCounter site code is added.
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(GOATCOUNTER_CODE)) return;

  const endpoint = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = endpoint;
  document.head.appendChild(script);
})();
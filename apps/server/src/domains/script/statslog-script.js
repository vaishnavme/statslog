class StatsLog {
  #appId;
  #sessionId;
  #visitorId;
  #apiHost;

  #pathVisitTimestamps = new Map();
  #pathCooldown = 10000; // 10 seconds

  static instance;

  constructor() {
    if (StatsLog.instance) {
      return StatsLog.instance;
    }

    this.#sessionId = this.#getSessionId();
    this.#visitorId = this.#getVisitorId();

    this.#appId = this.#getConfigAttributeValue("data-appid");
    this.#apiHost = this.#getConfigAttributeValue("data-apihost");

    StatsLog.instance = this;
  }

  #getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^|;\\s*)" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  #getConfigAttributeValue(attrName) {
    const currentScript = document.currentScript;
    if (!currentScript) return null;

    const value = currentScript.getAttribute(attrName);
    if (value) {
      currentScript.removeAttribute(attrName);
    }
    return value;
  }

  #getSessionId() {
    let id = sessionStorage.getItem("sl_sid");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("sl_sid", id);
    }
    return id;
  }

  #getVisitorId() {
    let id = this.#getCookie("sl_vid");
    if (!id) {
      id = crypto.randomUUID();
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      document.cookie = `sl_vid=${id}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax; Secure;`;
    }
    return id;
  }

  #sendPageView() {
    const now = Date.now();
    const path = location.pathname + location.search;

    // ---- per-path cooldown (core requirement) ----
    const lastVisit = this.#pathVisitTimestamps.get(path);
    if (lastVisit && now - lastVisit < this.#pathCooldown) {
      return;
    }
    this.#pathVisitTimestamps.set(path, now);

    const payload = {
      appId: this.#appId,
      sessionId: this.#sessionId,
      visitorId: this.#visitorId,
      path,
      referrer: document.referrer || null,
      ts: now,
      title: document.title || null,
    };

    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "text/plain",
      });

      navigator.sendBeacon(`${this.#apiHost}/stats/pageview`, blob);
    } catch (err) {
      console.error("[StatsLog] beacon failed", err);
    }
  }

  #trackNavigation() {
    let lastPath = location.pathname + location.search;

    const onChange = () => {
      const currentPath = location.pathname + location.search;
      if (currentPath !== lastPath) {
        lastPath = currentPath;
        this.#sendPageView();
      }
    };

    try {
      const originalPushState = history.pushState;
      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        onChange();
      };

      const originalReplaceState = history.replaceState;
      history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        onChange();
      };
    } catch (_) {
      //
    }

    window.addEventListener("popstate", onChange);

    let lastVisibilityState = document.visibilityState;
    document.addEventListener("visibilitychange", () => {
      const currentVisibilityState = document.visibilityState;
      if (
        currentVisibilityState === "visible" &&
        lastVisibilityState !== "visible"
      ) {
        onChange();
      }
      lastVisibilityState = currentVisibilityState;
    });
  }

  init() {
    if (!this.#appId || !this.#apiHost) return;

    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      this.#sendPageView();
    } else {
      window.addEventListener("load", () => this.#sendPageView(), {
        once: true,
      });
    }

    this.#trackNavigation();
  }
}

const statsLog = new StatsLog();
statsLog.init();

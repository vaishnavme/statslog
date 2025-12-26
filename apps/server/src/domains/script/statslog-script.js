class StatsLog {
  #appId;
  #sessionId;
  #visitorId;
  #apiHost;

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
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  #getConfigAttributeValue(attrName) {
    const currentScript = document.currentScript;
    const attrValue = currentScript.getAttribute(attrName);

    if (!attrValue) {
      currentScript.removeAttribute(attrName);
    }

    return attrValue;
  }

  #getSessionId() {
    let storedSessionId = sessionStorage.getItem("sl_id");

    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      sessionStorage.setItem("sl_id", storedSessionId);
    }

    return storedSessionId;
  }

  #getVisitorId() {
    let storedVisitorId = this.#getCookie("sl_vid");

    if (!storedVisitorId) {
      storedVisitorId = crypto.randomUUID();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `sl_vid=${storedVisitorId}; expires=${expiryDate.toUTCString()}; path=/`;
    }

    return storedVisitorId;
  }

  #sendPageView() {
    const payload = {
      appId: this.#appId,
      sessionId: this.#sessionId,
      visitorId: this.#visitorId,
      url: window.location.href,
      referrer: document.referrer,
    };

    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "text/plain",
      });
      navigator.sendBeacon(`${this.#apiHost}/stats/pageview`, blob);
    } catch (error) {
      console.error("Failed to send pageview data:", error);
    }
  }

  init() {
    if (!this.#appId || !this.#apiHost) {
      return;
    }

    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      this.#sendPageView();
    } else {
      window.addEventListener(
        "load",
        () => {
          this.#sendPageView();
        },
        { once: true }
      );
    }
  }
}

const statsLog = new StatsLog();
statsLog.init();

pc.script.createLoadingScreen(function (app) {
  var showSplash = function () {
    // splash wrapper
    var wrapper = document.createElement("div");
    wrapper.id = "application-splash-wrapper";
    document.body.appendChild(wrapper);

    // splash
    var splash = document.createElement("div");
    splash.id = "application-splash";
    wrapper.appendChild(splash);
    splash.style.display = "block";

    // CeylonXR text title
    var title = document.createElement("div");
    title.id = "splash-title";
    title.innerText = "CeylonXR";
    splash.appendChild(title);

    // progress bar container
    var container = document.createElement("div");
    container.id = "progress-bar-container";
    splash.appendChild(container);

    // progress bar
    var bar = document.createElement("div");
    bar.id = "progress-bar";
    container.appendChild(bar);
  };

  var hideSplash = function () {
    var splash = document.getElementById("application-splash-wrapper");
    splash.parentElement.removeChild(splash);
  };

  var setProgress = function (value) {
    var bar = document.getElementById("progress-bar");
    if (bar) {
      value = Math.min(1, Math.max(0, value));
      bar.style.width = value * 100 + "%";
    }
  };

  var createCss = function () {
    var css = [
      "body {",
      "    background-color: #283538;",
      "    margin: 0;",
      "    padding: 0;",
      "    overflow: hidden;",
      "}",

      "#application-splash-wrapper {",
      "    position: absolute;",
      "    top: 0;",
      "    left: 0;",
      "    height: 100%;",
      "    width: 100%;",
      "    background-color: #283538;",
      "    display: flex;",
      "    justify-content: center;",
      "    align-items: center;",
      "}",

      "#application-splash {",
      "    text-align: center;",
      "}",

      "#splash-title {",
      "    color: #ffffff;",
      "    font-family: sans-serif;",
      "    font-size: 24px;",
      "    margin-bottom: 20px;",
      "}",

      "#progress-bar-container {",
      "    height: 2px;",
      "    width: 264px;",
      "    background-color: #1d292c;",
      "    margin: 0 auto;",
      "}",

      "#progress-bar {",
      "    width: 0%;",
      "    height: 100%;",
      "    background-color: #f60;",
      "}",

      "@media (max-width: 480px) {",
      "    #progress-bar-container {",
      "        width: 170px;",
      "    }",
      "}",
    ].join("\n");

    var style = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(style);
  };

  createCss();
  showSplash();

  app.on("preload:end", function () {
    app.off("preload:progress");
  });
  app.on("preload:progress", setProgress);
  app.on("start", hideSplash);
});

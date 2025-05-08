var PreviewButton = pc.createScript("previewButton");
PreviewButton.attributes.add("menuUI", { type: "entity" }),
  PreviewButton.attributes.add("uiCamera", { type: "entity" }),
  PreviewButton.attributes.add("camera3D", { type: "entity" }),
  (PreviewButton.prototype.initialize = function () {
    this.entity.button.on(
      "click",
      function () {
        console.log("Preview 3D Scene clicked"),
          this.menuUI && (this.menuUI.enabled = !1),
          this.uiCamera && (this.uiCamera.enabled = !1),
          this.camera3D && (this.camera3D.enabled = !0);
      },
      this
    );
  });
var GetUserData = pc.createScript("getUserData");
GetUserData.attributes.add("usernameTextEntity", { type: "entity" }),
  (GetUserData.prototype.initialize = function () {
    var t = this;
    fetch("http://localhost:5103/api/AuthApi/user/lahiru")
      .then(function (t) {
        if (!t.ok) throw new Error("Network response was not ok");
        return t.json();
      })
      .then(function (e) {
        e.username
          ? (t.usernameTextEntity.element.text = e.username)
          : (t.usernameTextEntity.element.text = "Unknown");
      })
      .catch(function (e) {
        console.error("Fetch error:", e),
          (t.usernameTextEntity.element.text = "Error");
      });
  }),
  (GetUserData.prototype.update = function (t) {});
var ObjectLoader = pc.createScript("objectLoader");
ObjectLoader.attributes.add("apiUrl", { type: "string" }),
  ObjectLoader.attributes.add("buttonEntity", { type: "entity" }),
  (ObjectLoader.prototype.initialize = function () {
    var t = this;
    this.buttonEntity.button.on("click", function () {
      console.log("Preview 3D Scene button clicked"),
        fetch(t.apiUrl)
          .then(function (t) {
            return t.json();
          })
          .then(function (o) {
            o.url
              ? t.loadGsplatFromUrl(o.url)
              : console.error("No URL in API response.");
          })
          .catch(function (t) {
            console.error("Failed to fetch 3D model URL:", t);
          });
    });
  }),
  (ObjectLoader.prototype.loadGsplatFromUrl = function (t) {
    var o = this;
    const e = new pc.Asset("gsplatObject", "gsplat", { url: t });
    this.app.assets.add(e),
      e.ready(function () {
        console.log("3D model (gsplat) loaded successfully");
        const t = new pc.Entity("3DModel");
        t.addComponent("gsplat", { asset: e }),
          t.setLocalPosition(0, 0.05, 0),
          t.setLocalEulerAngles(180, 90, 0),
          t.setLocalScale(0.7, 0.7, 0.7),
          o.app.root.addChild(t);
      }),
      e.on("error", function (t) {
        console.error("Error loading 3D model:", t);
      }),
      this.app.assets.load(e);
  });
var MenuUi = pc.createScript("menuUi");
MenuUi.attributes.add("fontAsset", { type: "asset", assetType: "font" }),
  MenuUi.attributes.add("defaultImage", {
    type: "asset",
    assetType: "texture",
  }),
  MenuUi.attributes.add("primaryColor", {
    type: "rgb",
    default: [0.2, 0.6, 0.9],
    title: "Primary Color",
  }),
  MenuUi.attributes.add("accentColor", {
    type: "rgb",
    default: [0.9, 0.3, 0.3],
    title: "Accent Color",
  }),
  MenuUi.attributes.add("backgroundImage", {
    type: "asset",
    assetType: "texture",
    title: "Background Image",
  }),
  (MenuUi.prototype.initialize = function () {
    this.defaultImage
      ? (console.log("Default image asset:", this.defaultImage),
        this.defaultImage.loaded
          ? console.log("Default image already loaded")
          : (this.defaultImage.ready(() => {
              console.log("Default image loaded successfully");
            }),
            this.defaultImage.on("error", (e) => {
              console.error("Default image failed to load:", e);
            })))
      : console.warn("No default image assigned in attributes"),
      this.createUI(),
      this.fetchUserData();
  }),
  (MenuUi.prototype.createUI = function () {
    const e = new pc.Entity("UIScreen");
    e.addComponent("screen", {
      screenSpace: !0,
      referenceResolution: new pc.Vec2(1280, 720),
      scaleBlend: 0.5,
      scaleMode: "blend",
    }),
      (e.layers = [pc.LAYERID_UI]),
      this.app.root.addChild(e),
      (this.screen = e),
      this.createModernBackground(),
      this.createHeader();
    const t = this.createMenuContainer();
    this.createModernButton(
      "CREATE ROOM",
      new pc.Vec2(0, 60),
      () => {
        console.log("Create Room clicked"), this.animateButtonClick(t);
      },
      t
    ),
      this.createModernButton(
        "JOIN ROOM",
        new pc.Vec2(0, -20),
        () => {
          console.log("Join Room clicked"), this.animateButtonClick(t);
        },
        t
      ),
      this.createFooter(),
      this.createUserDisplay(),
      this.animateUIEntrance();
  }),
  (MenuUi.prototype.createModernBackground = function () {
    const e = new pc.Entity("Background");
    this.backgroundImage && this.backgroundImage.loaded
      ? e.addComponent("element", {
          type: "image",
          textureAsset: this.backgroundImage.id,
          anchor: [0, 0, 1, 1],
          pivot: [0.5, 0.5],
          opacity: 0.7,
        })
      : e.addComponent("element", {
          type: "image",
          color: new pc.Color(0.08, 0.1, 0.15),
          anchor: [0, 0, 1, 1],
          pivot: [0, 0],
        }),
      this.screen.addChild(e);
    const t = new pc.Entity("Overlay");
    t.addComponent("element", {
      type: "image",
      anchor: [0, 0, 1, 1],
      pivot: [0.5, 0.5],
      color: new pc.Color(0.1, 0.2, 0.3, 0.3),
    }),
      this.screen.addChild(t),
      this.createParticleEffect();
  }),
  (MenuUi.prototype.createParticleEffect = function () {
    for (let e = 0; e < 10; e++) {
      const t = new pc.Entity("Particle" + e);
      t.addComponent("element", {
        type: "image",
        width: 5 + 10 * Math.random(),
        height: 5 + 10 * Math.random(),
        color: new pc.Color(
          this.primaryColor.r,
          this.primaryColor.g,
          this.primaryColor.b,
          0.1 + 0.2 * Math.random()
        ),
        anchor: [0.5, 0.5, 0.5, 0.5],
        pivot: [0.5, 0.5],
      });
      const o = 1200 * Math.random() - 600,
        n = 600 * Math.random() - 300;
      t.setLocalPosition(o, n, 0),
        this.screen.addChild(t),
        this.animateParticle(t);
    }
  }),
  (MenuUi.prototype.animateParticle = function (e) {
    const t = 10 + 15 * Math.random(),
      o = e.getLocalPosition().y,
      n = 20 + 40 * Math.random();
    this.app.on("update", () => {
      const a = ((performance.now() / 1e3) % t) / t,
        i = o + Math.sin(a * Math.PI * 2) * n,
        r = e.getLocalPosition();
      e.setLocalPosition(r.x, i, r.z);
    });
  }),
  (MenuUi.prototype.createHeader = function () {
    const e = new pc.Entity("Header");
    e.addComponent("element", {
      type: "image",
      color: new pc.Color(0.1, 0.15, 0.2, 0.8),
      anchor: [0, 1, 1, 1],
      pivot: [0.5, 1],
      height: 80,
    }),
      e.setLocalPosition(0, 0, 0),
      this.screen.addChild(e);
    const t = new pc.Entity("GameTitle");
    t.addComponent("element", {
      type: "text",
      text: "CeylonXR",
      fontAsset: this.fontAsset.id,
      fontSize: 34,
      color: new pc.Color(1, 1, 1, 0.9),
      anchor: [0, 0.5, 0, 0.5],
      pivot: [0, 0.5],
      alignment: pc.ALIGN_LEFT,
    }),
      t.setLocalPosition(40, 0, 0),
      e.addChild(t);
  }),
  (MenuUi.prototype.createMenuContainer = function () {
    const e = new pc.Entity("MenuContainer");
    e.addComponent("element", {
      type: "image",
      color: new pc.Color(0.1, 0.15, 0.2, 0.7),
      anchor: [0.5, 0.5, 0.5, 0.5],
      pivot: [0.5, 0.5],
      width: 350,
      height: 300,
      margin: [0, 0, 0, 0],
    }),
      this.screen.addChild(e);
    const t = new pc.Entity("MenuHeader");
    return (
      t.addComponent("element", {
        type: "text",
        text: "MAIN MENU",
        fontAsset: this.fontAsset.id,
        fontSize: 22,
        color: new pc.Color(
          this.primaryColor.r,
          this.primaryColor.g,
          this.primaryColor.b
        ),
        anchor: [0.5, 1, 0.5, 1],
        pivot: [0.5, 1],
      }),
      t.setLocalPosition(0, 120, 0),
      e.addChild(t),
      e
    );
  }),
  (MenuUi.prototype.createModernButton = function (e, t, o, n) {
    const a = new pc.Entity("Button_" + e);
    a.addComponent("element", {
      type: "image",
      color: new pc.Color(
        0.7 * this.primaryColor.r,
        0.7 * this.primaryColor.g,
        0.7 * this.primaryColor.b
      ),
      anchor: [0.5, 0.5, 0.5, 0.5],
      pivot: [0.5, 0.5],
      width: 280,
      height: 50,
      margin: [0, 0, 0, 0],
    }),
      a.setLocalPosition(t.x, t.y, 0),
      n.addChild(a);
    const i = new pc.Entity("Text_" + e);
    return (
      i.addComponent("element", {
        type: "text",
        text: e,
        fontAsset: this.fontAsset.id,
        fontSize: 22,
        color: new pc.Color(1, 1, 1),
        anchor: [0.5, 0.5, 0.5, 0.5],
        pivot: [0.5, 0.5],
      }),
      a.addChild(i),
      a.addComponent("button"),
      a.button.on("mouseenter", () => {
        (a.element.color = new pc.Color(
          this.primaryColor.r,
          this.primaryColor.g,
          this.primaryColor.b
        )),
          i.setLocalScale(1.05, 1.05, 1.05);
      }),
      a.button.on("mouseleave", () => {
        (a.element.color = new pc.Color(
          0.7 * this.primaryColor.r,
          0.7 * this.primaryColor.g,
          0.7 * this.primaryColor.b
        )),
          i.setLocalScale(1, 1, 1);
      }),
      a.button.on("click", () => {
        o();
      }),
      a
    );
  }),
  (MenuUi.prototype.createFooter = function () {
    const e = new pc.Entity("Footer");
    e.addComponent("element", {
      type: "text",
      text: "Version 1.0.0 | © 2025",
      fontAsset: this.fontAsset.id,
      fontSize: 14,
      color: new pc.Color(0.7, 0.7, 0.7, 0.5),
      anchor: [1, 0, 1, 0],
      pivot: [1, 0],
    }),
      e.setLocalPosition(-20, 20, 0),
      this.screen.addChild(e);
  }),
  (MenuUi.prototype.createUserDisplay = function () {
    const e = new pc.Entity("UserPanel");
    e.addComponent("element", {
      type: "image",
      color: new pc.Color(0.15, 0.2, 0.25, 0.8),
      anchor: [1, 1, 1, 1],
      pivot: [1, 1],
      width: 200,
      height: 60,
      margin: [0, 0, 20, 20],
    }),
      e.setLocalPosition(-20, -20, 0),
      this.screen.addChild(e);
    const t = new pc.Entity("AvatarBorder");
    t.addComponent("element", {
      type: "image",
      color: new pc.Color(
        this.primaryColor.r,
        this.primaryColor.g,
        this.primaryColor.b
      ),
      anchor: [0, 0.5, 0, 0.5],
      pivot: [0, 0.5],
      width: 50,
      height: 50,
      margin: [0, 0, 0, 10],
    }),
      t.setLocalPosition(10, 0, 0),
      e.addChild(t);
    const o = new pc.Entity("UserAvatar");
    o.addComponent("element", {
      type: "image",
      width: 46,
      height: 46,
      anchor: [0.5, 0.5, 0.5, 0.5],
      pivot: [0.5, 0.5],
      mask: !1,
      color: new pc.Color(1, 1, 1),
    }),
      t.addChild(o),
      (this.avatarImage = o);
    const n = new pc.Entity("TokenContainer");
    n.addComponent("element", {
      type: "element",
      anchor: [0, 0.5, 1, 0.5],
      pivot: [0, 0.5],
      width: 100,
      height: 30,
    }),
      n.setLocalPosition(70, 0, 0),
      e.addChild(n);
    const a = new pc.Entity("TokenIcon");
    a.addComponent("element", {
      type: "image",
      color: new pc.Color(1, 0.85, 0.2),
      anchor: [0, 0.5, 0, 0.5],
      pivot: [0, 0.5],
      width: 20,
      height: 20,
    }),
      n.addChild(a);
    const i = new pc.Entity("TokenText");
    i.addComponent("element", {
      type: "text",
      fontAsset: this.fontAsset.id,
      fontSize: 18,
      color: new pc.Color(1, 1, 1),
      anchor: [0, 0.5, 0, 0.5],
      pivot: [0, 0.5],
      text: "0",
      alignment: pc.ALIGN_LEFT,
    }),
      i.setLocalPosition(25, 0, 0),
      n.addChild(i),
      (this.tokenText = i),
      this.applyDefaultTexture();
  }),
  (MenuUi.prototype.animateUIEntrance = function () {
    const e = this.screen.findByName("MenuContainer");
    e &&
      (e.setLocalPosition(0, -50, 0),
      (e.element.opacity = 0),
      this.animateProperty(e, "y", -50, 0, 0.7, 0.1),
      this.animateProperty(e, "opacity", 0, 1, 0.5, 0));
    const t = this.screen.findByName("UserPanel");
    t &&
      (t.setLocalPosition(50, -20, 0),
      (t.element.opacity = 0),
      this.animateProperty(t, "x", 50, -20, 0.5, 0.2),
      this.animateProperty(t, "opacity", 0, 1, 0.4, 0.2));
  }),
  (MenuUi.prototype.animateButtonClick = function (e) {
    e.setLocalScale(0.95, 0.95, 0.95),
      setTimeout(() => {
        e.setLocalScale(1, 1, 1);
      }, 100);
  }),
  (MenuUi.prototype.animateProperty = function (e, t, o, n, a, i) {
    const r = performance.now() + 1e3 * i,
      s = r + 1e3 * a,
      update = () => {
        (() => {
          const a = performance.now();
          if (a < r) return !0;
          let i = (a - r) / (s - r);
          i = Math.max(0, Math.min(i, 1));
          const c = 1 - Math.pow(1 - i, 3),
            l = o + (n - o) * c;
          if ("opacity" === t && e.element) e.element.opacity = l;
          else if ("x" === t || "y" === t || "z" === t) {
            const o = e.getLocalPosition();
            "x" === t && (o.x = l),
              "y" === t && (o.y = l),
              "z" === t && (o.z = l),
              e.setLocalPosition(o);
          }
          return i < 1;
        })() && this.app.once("update", update);
      };
    this.app.once("update", update);
  }),
  (MenuUi.prototype.applyDefaultTexture = function () {
    if (this.avatarImage)
      if (this.defaultImage && this.defaultImage.loaded) {
        console.log("Applying default texture..."),
          (this.avatarImage.element.opacity = 1),
          (this.avatarImage.element.useInput = !0),
          (this.avatarImage.element.textureAsset = this.defaultImage.id),
          console.log(
            "Default image dimensions:",
            this.defaultImage.resource
              ? `${this.defaultImage.resource.width}x${this.defaultImage.resource.height}`
              : "Unknown"
          );
        const e = new pc.Entity("ImageLoaded");
        e.addComponent("element", {
          type: "text",
          text: "IMG",
          fontAsset: this.fontAsset.id,
          fontSize: 10,
          color: pc.Color.GREEN,
        }),
          e.setLocalPosition(0, 0, 1),
          this.avatarImage.addChild(e);
      } else
        this.defaultImage
          ? (console.log("Default image not loaded yet, waiting..."),
            this.defaultImage.ready(() => {
              (this.avatarImage.element.textureAsset = this.defaultImage.id),
                console.log("Default image loaded and applied");
            }))
          : console.warn("No default image available");
  }),
  (MenuUi.prototype.fetchUserData = function () {
    var e = this;
    fetch("https://ceylonxr.azurewebsites.net/api/User/me", {
      credentials: "include",
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((e) => e.json())
      .then((t) => {
        if (e.tokenText) {
          const o = parseInt(e.tokenText.element.text) || 0,
            n = parseInt(t.tokens) || 0;
          console.log("Updating tokens from", o, "to", n),
            e.animateTokenValue(o, n);
        }
        if (e.avatarImage && t.profilePicture) {
          const o = new Image();
          (o.crossOrigin = "anonymous"),
            (o.onload = function () {
              console.log(
                "Profile image loaded, dimensions:",
                o.width,
                "x",
                o.height
              );
              const t = new pc.Texture(e.app.graphicsDevice);
              t.setSource(o),
                (t.minFilter = pc.FILTER_LINEAR),
                (t.magFilter = pc.FILTER_LINEAR),
                (e.avatarImage.element.texture = t),
                (e.avatarImage.element.opacity = 1),
                console.log("Applied user profile image");
            }),
            (o.onerror = function (t) {
              console.error("Failed to load profile image:", t),
                e.applyDefaultTexture();
            });
          const n = "data:image/jpeg;base64,";
          o.src = t.profilePicture.startsWith(n)
            ? t.profilePicture
            : n + t.profilePicture;
        } else e.applyDefaultTexture();
      })
      .catch((t) => {
        console.error("Failed to load user data:", t), e.applyDefaultTexture();
      });
  }),
  (MenuUi.prototype.animateTokenValue = function (e, t) {
    if (!this.tokenText || !this.tokenText.element)
      return void console.error("Token text element not found");
    const o = performance.now(),
      n = o + 1e3,
      updateTokenValue = () => {
        let a = (performance.now() - o) / (n - o);
        a = Math.max(0, Math.min(a, 1));
        const i = 1 - Math.pow(1 - a, 2),
          r = Math.round(e + (t - e) * i);
        (this.tokenText.element.text = r.toString()),
          a < 1 && this.app.once("update", updateTokenValue);
      };
    this.app.once("update", updateTokenValue);
  });

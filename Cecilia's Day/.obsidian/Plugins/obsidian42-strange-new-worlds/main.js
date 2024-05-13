"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SNWPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian14 = require("obsidian");

// src/indexer.ts
var import_obsidian = require("obsidian");
var references;
var allLinkResolutions;
var lastUpdateToReferences = 0;
var thePlugin;
function setPluginVariableForIndexer(plugin) {
  thePlugin = plugin;
}
function getReferencesCache() {
  return references;
}
function getSnwAllLinksResolutions() {
  return allLinkResolutions;
}
function buildLinksAndReferences() {
  var _a, _b, _c, _d;
  if (thePlugin.showCountsActive != true)
    return;
  allLinkResolutions = [];
  thePlugin.app.metadataCache.iterateReferences((src, refs2) => {
    var _a2, _b2;
    const resolvedFilePath = (0, import_obsidian.parseLinktext)(refs2.link);
    if (resolvedFilePath.path === "")
      resolvedFilePath.path = src.replace(".md", "");
    if (resolvedFilePath == null ? void 0 : resolvedFilePath.path) {
      const resolvedTFile = thePlugin.app.metadataCache.getFirstLinkpathDest(
        resolvedFilePath.path,
        "/"
      );
      const fileLink = resolvedTFile === null ? "" : resolvedTFile.path.replace(".md", "") + (0, import_obsidian.stripHeading)(resolvedFilePath.subpath);
      const ghlink = resolvedTFile === null ? resolvedFilePath.path : "";
      const sourceFile = thePlugin.app.metadataCache.getFirstLinkpathDest(src, "/");
      if (thePlugin.settings.enableIgnoreObsExcludeFoldersLinksFrom) {
        if (thePlugin.app.metadataCache.isUserIgnored((_a2 = sourceFile == null ? void 0 : sourceFile.path) != null ? _a2 : ""))
          return;
      }
      if (thePlugin.settings.enableIgnoreObsExcludeFoldersLinksTo) {
        if (thePlugin.app.metadataCache.isUserIgnored(fileLink))
          return;
      }
      allLinkResolutions.push({
        reference: {
          displayText: (_b2 = refs2.displayText) != null ? _b2 : "",
          // link: refs.link, // old approach
          link: fileLink != "" ? fileLink : ghlink,
          position: refs2.position
        },
        resolvedFile: resolvedTFile,
        ghostLink: ghlink,
        realLink: refs2.link,
        sourceFile,
        excludedFile: false
      });
    }
  });
  const snwIndexExceptionsList = Object.entries(app.metadataCache.metadataCache).filter(
    (e) => {
      var _a2, _b2;
      return (_b2 = (_a2 = e[1]) == null ? void 0 : _a2.frontmatter) == null ? void 0 : _b2["snw-index-exclude"];
    }
  );
  const snwIndexExceptions = Object.entries(app.metadataCache.fileCache).filter((e) => {
    return snwIndexExceptionsList.find((f) => f[0] === e[1].hash);
  });
  for (let i = 0; i < allLinkResolutions.length; i++) {
    allLinkResolutions[i].excludedFile = false;
    if ((_b = (_a = allLinkResolutions[i]) == null ? void 0 : _a.resolvedFile) == null ? void 0 : _b.path) {
      const fileName = (_d = (_c = allLinkResolutions[i].resolvedFile) == null ? void 0 : _c.path) != null ? _d : "";
      for (let e = 0; e < snwIndexExceptions.length; e++) {
        if (fileName == snwIndexExceptions[e][0]) {
          allLinkResolutions[i].excludedFile = true;
          break;
        }
      }
    }
  }
  const refs = allLinkResolutions.reduce(
    (acc, link) => {
      let keyBasedOnLink = "";
      keyBasedOnLink = link.reference.link;
      if (!acc[keyBasedOnLink]) {
        acc[keyBasedOnLink] = [];
      }
      acc[keyBasedOnLink].push(link);
      return acc;
    },
    {}
  );
  references = refs;
  window.snwAPI.references = references;
  lastUpdateToReferences = Date.now();
}
var cacheCurrentPages = /* @__PURE__ */ new Map();
function getSNWCacheByFile(file) {
  var _a;
  if (cacheCurrentPages.has(file.path)) {
    const cachedPage = cacheCurrentPages.get(file.path);
    if (cachedPage) {
      const cachedPageCreateDate = (_a = cachedPage.createDate) != null ? _a : 0;
      if (lastUpdateToReferences < cachedPageCreateDate && cachedPageCreateDate + thePlugin.settings.cacheUpdateInMilliseconds > Date.now()) {
        return cachedPage;
      }
    }
  }
  if (thePlugin.showCountsActive != true)
    return {};
  const transformedCache = {};
  const cachedMetaData = thePlugin.app.metadataCache.getFileCache(file);
  if (!cachedMetaData) {
    return transformedCache;
  }
  if (!references) {
    buildLinksAndReferences();
  }
  const headings = Object.values(
    thePlugin.app.metadataCache.metadataCache
  ).reduce((acc, file2) => {
    const headings2 = file2.headings;
    if (headings2) {
      headings2.forEach((heading) => {
        acc.push(heading.heading);
      });
    }
    return acc;
  }, []);
  if (cachedMetaData == null ? void 0 : cachedMetaData.blocks) {
    const filePath = file.path.replace(".md", "");
    transformedCache.blocks = Object.values(cachedMetaData.blocks).map((block) => ({
      key: filePath + block.id,
      pos: block.position,
      page: file.basename,
      type: "block",
      references: references[filePath + block.id] || []
    }));
  }
  if (cachedMetaData == null ? void 0 : cachedMetaData.headings) {
    transformedCache.headings = cachedMetaData.headings.map(
      (header) => ({
        original: "#".repeat(header.level) + " " + header.heading,
        key: `${file.path.replace(".md", "")}${(0, import_obsidian.stripHeading)(header.heading)}`,
        headerMatch: header.heading,
        headerMatch2: file.basename + "#" + header.heading,
        pos: header.position,
        page: file.basename,
        type: "heading",
        references: references[`${file.path.replace(".md", "")}${(0, import_obsidian.stripHeading)(header.heading)}`] || []
      })
    );
  }
  if (cachedMetaData == null ? void 0 : cachedMetaData.links) {
    transformedCache.links = cachedMetaData.links.map((link) => {
      let newLinkPath = parseLinkTextToFullPath(link.link);
      if (newLinkPath === "") {
        newLinkPath = link.link;
      }
      if (newLinkPath.startsWith("#^") || newLinkPath.startsWith("#")) {
        newLinkPath = file.path.replace(".md", "") + (0, import_obsidian.stripHeading)(newLinkPath);
      }
      return {
        key: newLinkPath,
        original: link.original,
        type: "link",
        pos: link.position,
        page: file.basename,
        references: references[newLinkPath] || []
      };
    });
    if (transformedCache.links) {
      transformedCache.links = transformedCache.links.map((link) => {
        if (link.key.includes("#") && !link.key.includes("#^")) {
          const heading = headings.filter(
            (heading2) => (0, import_obsidian.stripHeading)(heading2) === link.key.split("#")[1]
          )[0];
          link.original = heading ? heading : void 0;
        }
        return link;
      });
    }
  }
  if (cachedMetaData == null ? void 0 : cachedMetaData.embeds) {
    transformedCache.embeds = cachedMetaData.embeds.map((embed) => {
      let newEmbedPath = parseLinkTextToFullPath(embed.link);
      if (newEmbedPath === "" && (embed.link.startsWith("#^") || embed.link.startsWith("#"))) {
        newEmbedPath = file.path.replace(".md", "") + (0, import_obsidian.stripHeading)(embed.link);
      }
      const output = {
        key: newEmbedPath,
        page: file.basename,
        type: "embed",
        pos: embed.position,
        references: references[newEmbedPath] || []
      };
      return output;
    });
    if (transformedCache.embeds) {
      transformedCache.embeds = transformedCache.embeds.map((embed) => {
        if (embed.key.includes("#") && !embed.key.includes("#^") && transformedCache.headings) {
          const heading = headings.filter(
            (heading2) => heading2.includes(embed.key.split("#")[1])
          )[0];
          embed.original = heading ? heading : void 0;
        }
        if (embed.key.startsWith("#^") || embed.key.startsWith("#")) {
          embed.key = `${file.basename}${embed.key}`;
          embed.references = references[embed.key] || [];
        }
        return embed;
      });
    }
  }
  transformedCache.cacheMetaData = cachedMetaData;
  transformedCache.createDate = Date.now();
  cacheCurrentPages.set(file.path, transformedCache);
  return transformedCache;
}
function parseLinkTextToFullPath(link) {
  const resolvedFilePath = (0, import_obsidian.parseLinktext)(link);
  const resolvedTFile = thePlugin.app.metadataCache.getFirstLinkpathDest(
    resolvedFilePath.path,
    "/"
  );
  if (resolvedTFile === null)
    return "";
  else
    return resolvedTFile.path.replace(".md", "") + (0, import_obsidian.stripHeading)(resolvedFilePath.subpath);
}

// src/view-extensions/references-cm6.ts
var import_view = require("@codemirror/view");
var import_obsidian7 = require("obsidian");

// node_modules/@popperjs/core/lib/enums.js
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

// node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}

// node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}

// node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
  return placement.split("-")[0];
}

// node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round = Math.round;

// node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}

// node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}

// node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}

// node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}

// node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}

// node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}

// node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle2(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle2(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle2(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}

// node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}

// node_modules/@popperjs/core/lib/utils/within.js
function within(min2, value, max2) {
  return max(min2, min(value, max2));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}

// node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

// node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

// node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

// node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect2(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow_default = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};

// node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split("-")[1];
}

// node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x, y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }, getWindow(popper2)) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};

// node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = {
  passive: true
};
function effect3(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect: effect3,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}

// node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash2 = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash2[matched];
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

// node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle2(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

// node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}

// node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  );
}

// node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

// node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }
  return offsets;
}

// node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}

// node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements2.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements2;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}

// node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip_default = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};

// node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide_default = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};

// node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};

// node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}

// node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min2 = offset2 + overflow[mainSide];
    var max2 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min2, tetherMin) : min2, offset2, tether ? max(max2, tetherMax) : max2);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow_default = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};

// node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

// node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}

// node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}

// node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref) {
        var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect5 = _ref.effect;
        if (typeof effect5 === "function") {
          var cleanupFn = effect5({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});

// node_modules/tippy.js/dist/tippy.esm.js
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO2() {
  return document.body;
};
function hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }
  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === "function" ? value.apply(void 0, args) : value;
}
function debounce2(fn2, ms) {
  if (ms === 0) {
    return fn2;
  }
  var timeout;
  return function(arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      fn2(arg);
    }, ms);
  };
}
function removeProperties(obj, keys) {
  var clone = Object.assign({}, obj);
  keys.forEach(function(key) {
    delete clone[key];
  });
  return clone;
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function(item, index) {
    return arr.indexOf(item) === index;
  });
}
function getBasePlacement2(placement) {
  return placement.split("-")[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (obj[key] !== void 0) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
function div() {
  return document.createElement("div");
}
function isElement2(value) {
  return ["Element", "Fragment"].some(function(type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, "NodeList");
}
function isMouseEvent(value) {
  return isType(value, "MouseEvent");
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement2(value)) {
    return [value];
  }
  if (isNodeList(value)) {
    return arrayFrom(value);
  }
  if (Array.isArray(value)) {
    return value;
  }
  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function(el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function(el) {
    if (el) {
      el.setAttribute("data-state", state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;
  var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX, clientY = event.clientY;
  return popperTreeData.every(function(_ref) {
    var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement2(popperState.placement);
    var offsetData = popperState.modifiersData.offset;
    if (!offsetData) {
      return true;
    }
    var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
    var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(event) {
    box[method](event, listener);
  });
}
function actualContains(parent, child) {
  var target = child;
  while (target) {
    var _target$getRootNode;
    if (parent.contains(target)) {
      return true;
    }
    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }
  return false;
}
var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }
  currentInput.isTouch = true;
  if (window.performance) {
    document.addEventListener("mousemove", onDocumentMouseMove);
  }
}
function onDocumentMouseMove() {
  var now = performance.now();
  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener("mousemove", onDocumentMouseMove);
  }
  lastMouseMoveTime = now;
}
function onWindowBlur() {
  var activeElement = document.activeElement;
  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;
    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener("blur", onWindowBlur);
}
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
var isIE11 = isBrowser ? (
  // @ts-ignore
  !!window.msCrypto
) : false;
function createMemoryLeakWarning(method) {
  var txt = method === "destroy" ? "n already-" : " ";
  return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function clean(value) {
  var spacesAndTabs = /[ \t]{2,}/g;
  var lineStartWithSpaces = /^[ \t]*/gm;
  return value.replace(spacesAndTabs, " ").replace(lineStartWithSpaces, "").trim();
}
function getDevMessage(message) {
  return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\u{1F477}\u200D This is a development-only message. It will be removed in production.\n  ");
}
function getFormattedMessage(message) {
  return [
    getDevMessage(message),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var visitedMessages;
if (true) {
  resetVisitedMessages();
}
function resetVisitedMessages() {
  visitedMessages = /* @__PURE__ */ new Set();
}
function warnWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console;
    visitedMessages.add(message);
    (_console = console).warn.apply(_console, getFormattedMessage(message));
  }
}
function errorWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console2;
    visitedMessages.add(message);
    (_console2 = console).error.apply(_console2, getFormattedMessage(message));
  }
}
function validateTargets(targets) {
  var didPassFalsyValue = !targets;
  var didPassPlainObject = Object.prototype.toString.call(targets) === "[object Object]" && !targets.addEventListener;
  errorWhen(didPassFalsyValue, ["tippy() was passed", "`" + String(targets) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" "));
  errorWhen(didPassPlainObject, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: "fade",
  arrow: true,
  content: "",
  inertia: false,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {
  },
  onBeforeUpdate: function onBeforeUpdate() {
  },
  onCreate: function onCreate() {
  },
  onDestroy: function onDestroy() {
  },
  onHidden: function onHidden() {
  },
  onHide: function onHide() {
  },
  onMount: function onMount() {
  },
  onShow: function onShow() {
  },
  onShown: function onShown() {
  },
  onTrigger: function onTrigger() {
  },
  onUntrigger: function onUntrigger() {
  },
  onClickOutside: function onClickOutside() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: "mouseenter focus",
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps2(partialProps) {
  if (true) {
    validateProps(partialProps, []);
  }
  var keys = Object.keys(partialProps);
  keys.forEach(function(key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps2 = plugins.reduce(function(acc, plugin) {
    var name = plugin.name, defaultValue = plugin.defaultValue;
    if (name) {
      var _name;
      acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }
    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps2);
}
function getDataAttributeProps(reference2, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function(acc, key) {
    var valueAsString = (reference2.getAttribute("data-tippy-" + key) || "").trim();
    if (!valueAsString) {
      return acc;
    }
    if (key === "content") {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }
    return acc;
  }, {});
  return props;
}
function evaluateProps(reference2, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference2])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference2, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
    content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
  };
  return out;
}
function validateProps(partialProps, plugins) {
  if (partialProps === void 0) {
    partialProps = {};
  }
  if (plugins === void 0) {
    plugins = [];
  }
  var keys = Object.keys(partialProps);
  keys.forEach(function(prop) {
    var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
    var didPassUnknownProp = !hasOwnProperty(nonPluginProps, prop);
    if (didPassUnknownProp) {
      didPassUnknownProp = plugins.filter(function(plugin) {
        return plugin.name === prop;
      }).length === 0;
    }
    warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", "\n\n", "All props: https://atomiks.github.io/tippyjs/v6/all-props/\n", "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var innerHTML = function innerHTML2() {
  return "innerHTML";
};
function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}
function createArrowElement(value) {
  var arrow2 = div();
  if (value === true) {
    arrow2.className = ARROW_CLASS;
  } else {
    arrow2.className = SVG_ARROW_CLASS;
    if (isElement2(value)) {
      arrow2.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow2, value);
    }
  }
  return arrow2;
}
function setContent(content, props) {
  if (isElement2(props.content)) {
    dangerouslySetInnerHTML(content, "");
    content.appendChild(props.content);
  } else if (typeof props.content !== "function") {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper2) {
  var box = popper2.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box,
    content: boxChildren.find(function(node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function(node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function(node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper2 = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute("data-state", "hidden");
  box.setAttribute("tabindex", "-1");
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute("data-state", "hidden");
  setContent(content, instance.props);
  popper2.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);
  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper2), box2 = _getChildren.box, content2 = _getChildren.content, arrow2 = _getChildren.arrow;
    if (nextProps.theme) {
      box2.setAttribute("data-theme", nextProps.theme);
    } else {
      box2.removeAttribute("data-theme");
    }
    if (typeof nextProps.animation === "string") {
      box2.setAttribute("data-animation", nextProps.animation);
    } else {
      box2.removeAttribute("data-animation");
    }
    if (nextProps.inertia) {
      box2.setAttribute("data-inertia", "");
    } else {
      box2.removeAttribute("data-inertia");
    }
    box2.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
    if (nextProps.role) {
      box2.setAttribute("role", nextProps.role);
    } else {
      box2.removeAttribute("role");
    }
    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content2, instance.props);
    }
    if (nextProps.arrow) {
      if (!arrow2) {
        box2.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box2.removeChild(arrow2);
        box2.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow2) {
      box2.removeChild(arrow2);
    }
  }
  return {
    popper: popper2,
    onUpdate
  };
}
render.$$tippy = true;
var idCounter = 1;
var mouseMoveListeners = [];
var mountedInstances = [];
function createTippy(reference2, passedProps) {
  var props = evaluateProps(reference2, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce2(onMouseMove, props.interactiveDebounce);
  var currentTarget;
  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id,
    reference: reference2,
    popper: div(),
    popperInstance,
    props,
    state,
    plugins,
    // methods
    clearDelayTimeouts,
    setProps,
    setContent: setContent2,
    show,
    hide: hide2,
    hideWithInteractivity,
    enable,
    disable,
    unmount,
    destroy
  };
  if (!props.render) {
    if (true) {
      errorWhen(true, "render() function has not been supplied.");
    }
    return instance;
  }
  var _props$render = props.render(instance), popper2 = _props$render.popper, onUpdate = _props$render.onUpdate;
  popper2.setAttribute("data-tippy-root", "");
  popper2.id = "tippy-" + instance.id;
  instance.popper = popper2;
  reference2._tippy = instance;
  popper2._tippy = instance;
  var pluginsHooks = plugins.map(function(plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference2.hasAttribute("aria-expanded");
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook("onCreate", [instance]);
  if (props.showOnCreate) {
    scheduleShow();
  }
  popper2.addEventListener("mouseenter", function() {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper2.addEventListener("mouseleave", function() {
    if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) {
      getDocument().addEventListener("mousemove", debouncedOnMouseMove);
    }
  });
  return instance;
  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }
  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === "hold";
  }
  function getIsDefaultRenderFn() {
    var _instance$props$rende;
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }
  function getCurrentTarget() {
    return currentTarget || reference2;
  }
  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }
  function getDefaultTemplateChildren() {
    return getChildren(popper2);
  }
  function getDelay(isShow) {
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") {
      return 0;
    }
    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }
  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }
    popper2.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
    popper2.style.zIndex = "" + instance.props.zIndex;
  }
  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }
    pluginsHooks.forEach(function(pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });
    if (shouldInvokePropsHook) {
      var _instance$props;
      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }
  function handleAriaContentAttribute() {
    var aria = instance.props.aria;
    if (!aria.content) {
      return;
    }
    var attr = "aria-" + aria.content;
    var id2 = popper2.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
    nodes.forEach(function(node) {
      var currentValue = node.getAttribute(attr);
      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id2 : id2);
      } else {
        var nextValue = currentValue && currentValue.replace(id2, "").trim();
        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }
  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }
    var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
    nodes.forEach(function(node) {
      if (instance.props.interactive) {
        node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false");
      } else {
        node.removeAttribute("aria-expanded");
      }
    });
  }
  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function(listener) {
      return listener !== debouncedOnMouseMove;
    });
  }
  function onDocumentPress(event) {
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === "mousedown") {
        return;
      }
    }
    var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
    if (instance.props.interactive && actualContains(popper2, actualTarget)) {
      return;
    }
    if (normalizeToArray(instance.props.triggerTarget || reference2).some(function(el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }
      if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) {
        return;
      }
    } else {
      invokeHook("onClickOutside", [instance, event]);
    }
    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide();
      didHideDueToDocumentMouseDown = true;
      setTimeout(function() {
        didHideDueToDocumentMouseDown = false;
      });
      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }
  function onTouchMove() {
    didTouchMove = true;
  }
  function onTouchStart() {
    didTouchMove = false;
  }
  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener("mousedown", onDocumentPress, true);
    doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
  }
  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener("mousedown", onDocumentPress, true);
    doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
  }
  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function() {
      if (!instance.state.isVisible && popper2.parentNode && popper2.parentNode.contains(popper2)) {
        callback();
      }
    });
  }
  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }
  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;
    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, "remove", listener);
        callback();
      }
    }
    if (duration === 0) {
      return callback();
    }
    updateTransitionEndListener(box, "remove", currentTransitionEndListener);
    updateTransitionEndListener(box, "add", listener);
    currentTransitionEndListener = listener;
  }
  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }
    var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
    nodes.forEach(function(node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node,
        eventType,
        handler,
        options
      });
    });
  }
  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on("touchstart", onTrigger2, {
        passive: true
      });
      on("touchend", onMouseLeave, {
        passive: true
      });
    }
    splitBySpaces(instance.props.trigger).forEach(function(eventType) {
      if (eventType === "manual") {
        return;
      }
      on(eventType, onTrigger2);
      switch (eventType) {
        case "mouseenter":
          on("mouseleave", onMouseLeave);
          break;
        case "focus":
          on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
          break;
        case "focusin":
          on("focusout", onBlurOrFocusOut);
          break;
      }
    });
  }
  function removeListeners() {
    listeners.forEach(function(_ref) {
      var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }
  function onTrigger2(event) {
    var _lastTriggerEvent;
    var shouldScheduleClickHide = false;
    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }
    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();
    if (!instance.state.isVisible && isMouseEvent(event)) {
      mouseMoveListeners.forEach(function(listener) {
        return listener(event);
      });
    }
    if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }
    if (event.type === "click") {
      isVisibleFromClick = !shouldScheduleClickHide;
    }
    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }
  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper2.contains(target);
    if (event.type === "mousemove" && isCursorOverReferenceOrPopper) {
      return;
    }
    var popperTreeData = getNestedPopperTree().concat(popper2).map(function(popper3) {
      var _instance$popperInsta;
      var instance2 = popper3._tippy;
      var state2 = (_instance$popperInsta = instance2.popperInstance) == null ? void 0 : _instance$popperInsta.state;
      if (state2) {
        return {
          popperRect: popper3.getBoundingClientRect(),
          popperState: state2,
          props
        };
      }
      return null;
    }).filter(Boolean);
    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }
  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
    if (shouldBail) {
      return;
    }
    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }
    scheduleHide(event);
  }
  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) {
      return;
    }
    if (instance.props.interactive && event.relatedTarget && popper2.contains(event.relatedTarget)) {
      return;
    }
    scheduleHide(event);
  }
  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
  }
  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset2 = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
    var arrow2 = getIsDefaultRenderFn() ? getChildren(popper2).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference2;
    var tippyModifier = {
      name: "$$tippy",
      enabled: true,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function fn2(_ref2) {
        var state2 = _ref2.state;
        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(attr) {
            if (attr === "placement") {
              box.setAttribute("data-placement", state2.placement);
            } else {
              if (state2.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, "");
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state2.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: "offset",
      options: {
        offset: offset2
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];
    if (getIsDefaultRenderFn() && arrow2) {
      modifiers.push({
        name: "arrow",
        options: {
          element: arrow2,
          padding: 3
        }
      });
    }
    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = createPopper(computedReference, popper2, Object.assign({}, popperOptions, {
      placement,
      onFirstUpdate,
      modifiers
    }));
  }
  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }
  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode;
    var node = getCurrentTarget();
    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    }
    if (!parentNode.contains(popper2)) {
      parentNode.appendChild(popper2);
    }
    instance.state.isMounted = true;
    createPopperInstance();
    if (true) {
      warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node.nextElementSibling !== popper2, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", "\n\n", "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", "\n\n", "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", "\n\n", "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
    }
  }
  function getNestedPopperTree() {
    return arrayFrom(popper2.querySelectorAll("[data-tippy-root]"));
  }
  function scheduleShow(event) {
    instance.clearDelayTimeouts();
    if (event) {
      invokeHook("onTrigger", [instance, event]);
    }
    addDocumentPress();
    var delay = getDelay(true);
    var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
    if (currentInput.isTouch && touchValue === "hold" && touchDelay) {
      delay = touchDelay;
    }
    if (delay) {
      showTimeout = setTimeout(function() {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }
  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook("onUntrigger", [instance, event]);
    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    }
    if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }
    var delay = getDelay(false);
    if (delay) {
      hideTimeout = setTimeout(function() {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      scheduleHideAnimationFrame = requestAnimationFrame(function() {
        instance.hide();
      });
    }
  }
  function enable() {
    instance.state.isEnabled = true;
  }
  function disable() {
    instance.hide();
    instance.state.isEnabled = false;
  }
  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }
  function setProps(partialProps) {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("setProps"));
    }
    if (instance.state.isDestroyed) {
      return;
    }
    invokeHook("onBeforeUpdate", [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference2, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();
    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce2(onMouseMove, nextProps.interactiveDebounce);
    }
    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function(node) {
        node.removeAttribute("aria-expanded");
      });
    } else if (nextProps.triggerTarget) {
      reference2.removeAttribute("aria-expanded");
    }
    handleAriaExpandedAttribute();
    handleStyles();
    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }
    if (instance.popperInstance) {
      createPopperInstance();
      getNestedPopperTree().forEach(function(nestedPopper) {
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }
    invokeHook("onAfterUpdate", [instance, partialProps]);
  }
  function setContent2(content) {
    instance.setProps({
      content
    });
  }
  function show() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("show"));
    }
    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    }
    if (getCurrentTarget().hasAttribute("disabled")) {
      return;
    }
    invokeHook("onShow", [instance], false);
    if (instance.props.onShow(instance) === false) {
      return;
    }
    instance.state.isVisible = true;
    if (getIsDefaultRenderFn()) {
      popper2.style.visibility = "visible";
    }
    handleStyles();
    addDocumentPress();
    if (!instance.state.isMounted) {
      popper2.style.transition = "none";
    }
    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
      setTransitionDuration([box, content], 0);
    }
    onFirstUpdate = function onFirstUpdate2() {
      var _instance$popperInsta2;
      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }
      ignoreOnFirstUpdate = true;
      void popper2.offsetHeight;
      popper2.style.transition = instance.props.moveTransition;
      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], "visible");
      }
      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance);
      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook("onMount", [instance]);
      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function() {
          instance.state.isShown = true;
          invokeHook("onShown", [instance]);
        });
      }
    };
    mount();
  }
  function hide2() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("hide"));
    }
    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }
    invokeHook("onHide", [instance], false);
    if (instance.props.onHide(instance) === false) {
      return;
    }
    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;
    if (getIsDefaultRenderFn()) {
      popper2.style.visibility = "hidden";
    }
    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);
    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], "hidden");
      }
    }
    handleAriaContentAttribute();
    handleAriaExpandedAttribute();
    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }
  function hideWithInteractivity(event) {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("hideWithInteractivity"));
    }
    getDocument().addEventListener("mousemove", debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }
  function unmount() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("unmount"));
    }
    if (instance.state.isVisible) {
      instance.hide();
    }
    if (!instance.state.isMounted) {
      return;
    }
    destroyPopperInstance();
    getNestedPopperTree().forEach(function(nestedPopper) {
      nestedPopper._tippy.unmount();
    });
    if (popper2.parentNode) {
      popper2.parentNode.removeChild(popper2);
    }
    mountedInstances = mountedInstances.filter(function(i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook("onHidden", [instance]);
  }
  function destroy() {
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("destroy"));
    }
    if (instance.state.isDestroyed) {
      return;
    }
    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference2._tippy;
    instance.state.isDestroyed = true;
    invokeHook("onDestroy", [instance]);
  }
}
function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }
  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
  if (true) {
    validateTargets(targets);
    validateProps(optionalProps, plugins);
  }
  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins
  });
  var elements = getArrayOfElements(targets);
  if (true) {
    var isSingleContentElement = isElement2(passedProps.content);
    var isMoreThanOneReferenceElement = elements.length > 1;
    warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", "\n\n", "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", "\n\n", "1) content: element.innerHTML\n", "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var instances = elements.reduce(function(acc, reference2) {
    var instance = reference2 && createTippy(reference2, passedProps);
    if (instance) {
      acc.push(instance);
    }
    return acc;
  }, []);
  return isElement2(targets) ? instances[0] : instances;
}
tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
var hideAll = function hideAll2(_temp) {
  var _ref = _temp === void 0 ? {} : _temp, excludedReferenceOrInstance = _ref.exclude, duration = _ref.duration;
  mountedInstances.forEach(function(instance) {
    var isExcluded = false;
    if (excludedReferenceOrInstance) {
      isExcluded = isReferenceElement(excludedReferenceOrInstance) ? instance.reference === excludedReferenceOrInstance : instance.popper === excludedReferenceOrInstance.popper;
    }
    if (!isExcluded) {
      var originalDuration = instance.props.duration;
      instance.setProps({
        duration
      });
      instance.hide();
      if (!instance.state.isDestroyed) {
        instance.setProps({
          duration: originalDuration
        });
      }
    }
  });
};
var applyStylesModifier = Object.assign({}, applyStyles_default, {
  effect: function effect4(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
  }
});
tippy.setDefaultProps({
  render
});
var tippy_esm_default = tippy;

// src/ui/components/uic-ref--parent.ts
var import_obsidian5 = require("obsidian");

// src/utils.ts
var getScrollParent2 = (element, includeHidden) => {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
  if (style.position === "fixed")
    return document.body;
  for (let parent = element; parent = parent.parentElement; ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent;
  }
  return document.body;
};
var scrollResultsIntoView = (resultContainerEl) => {
  const searchResults = resultContainerEl.querySelectorAll(
    ".search-result-file-matched-text"
  );
  for (const searchResult of Array.from(searchResults)) {
    if (searchResult instanceof HTMLElement) {
      const scrollParent = getScrollParent2(searchResult, true);
      if (scrollParent) {
        scrollParent.scrollTop = searchResult.offsetTop - scrollParent.offsetTop - scrollParent.offsetHeight / 2;
      }
    }
  }
};

// src/ui/components/uic-ref-area.ts
var import_obsidian4 = require("obsidian");

// src/ui/components/uic-ref-item.ts
var import_obsidian2 = require("obsidian");

// src/ui/components/context/position-utils.ts
var getTextAtPosition = (textInput, pos) => textInput.substring(pos.start.offset, pos.end.offset);
var getTextFromLineStartToPositionEnd = (textInput, pos) => textInput.substring(pos.start.offset - pos.start.col, pos.end.offset);
var doesPositionIncludeAnother = (container, child) => {
  try {
    return container.start.offset <= child.start.offset && container.end.offset >= child.end.offset;
  } catch (error) {
    return false;
  }
};

// src/ui/components/context/context-builder.ts
var ContextBuilder = class {
  constructor(fileContents, { listItems = [], headings = [], sections = [] }) {
    this.fileContents = fileContents;
    this.getListItemIndexContaining = (searchedForPosition) => {
      return this.listItems.findIndex(
        ({ position }) => doesPositionIncludeAnother(position, searchedForPosition)
      );
    };
    this.getSectionContaining = (searchedForPosition) => {
      return this.sections.find(
        ({ position }) => doesPositionIncludeAnother(position, searchedForPosition)
      );
    };
    this.getListItemWithDescendants = (listItemIndex) => {
      const rootListItem = this.listItems[listItemIndex];
      const listItemWithDescendants = [rootListItem];
      for (let i = listItemIndex + 1; i < this.listItems.length; i++) {
        const nextItem = this.listItems[i];
        if (nextItem.parent < rootListItem.position.start.line) {
          return listItemWithDescendants;
        }
        listItemWithDescendants.push(nextItem);
      }
      return listItemWithDescendants;
    };
    this.listItems = listItems;
    this.headings = headings;
    this.sections = sections;
  }
  getListBreadcrumbs(position) {
    const listBreadcrumbs = [];
    if (this.listItems.length === 0) {
      return listBreadcrumbs;
    }
    const thisItemIndex = this.getListItemIndexContaining(position);
    const isPositionOutsideListItem = thisItemIndex < 0;
    if (isPositionOutsideListItem) {
      return listBreadcrumbs;
    }
    const thisItem = this.listItems[thisItemIndex];
    let currentParent = thisItem.parent;
    if (this.isTopLevelListItem(thisItem)) {
      return listBreadcrumbs;
    }
    for (let i = thisItemIndex - 1; i >= 0; i--) {
      const currentItem = this.listItems[i];
      const currentItemIsHigherUp = currentItem.parent < currentParent;
      if (currentItemIsHigherUp) {
        listBreadcrumbs.unshift(currentItem);
        currentParent = currentItem.parent;
      }
      if (this.isTopLevelListItem(currentItem)) {
        return listBreadcrumbs;
      }
    }
    return listBreadcrumbs;
  }
  getFirstSectionUnder(position) {
    return this.sections.find(
      (section) => section.position.start.line > position.start.line
    );
  }
  getHeadingContaining(position) {
    const index = this.getHeadingIndexContaining(position);
    return this.headings[index];
  }
  getHeadingBreadcrumbs(position) {
    const headingBreadcrumbs = [];
    if (this.headings.length === 0) {
      return headingBreadcrumbs;
    }
    const collectAncestorHeadingsForHeadingAtIndex = (startIndex) => {
      let currentLevel = this.headings[startIndex].level;
      const previousHeadingIndex = startIndex - 1;
      for (let i = previousHeadingIndex; i >= 0; i--) {
        const lookingAtHeading = this.headings[i];
        if (lookingAtHeading.level < currentLevel) {
          currentLevel = lookingAtHeading.level;
          headingBreadcrumbs.unshift(lookingAtHeading);
        }
      }
    };
    const headingIndexAtPosition = this.getHeadingIndexContaining(position);
    const positionIsInsideHeading = headingIndexAtPosition >= 0;
    if (positionIsInsideHeading) {
      collectAncestorHeadingsForHeadingAtIndex(headingIndexAtPosition);
      return headingBreadcrumbs;
    }
    const headingIndexAbovePosition = this.getIndexOfHeadingAbove(position);
    const positionIsBelowHeading = headingIndexAbovePosition >= 0;
    if (positionIsBelowHeading) {
      const headingAbovePosition = this.headings[headingIndexAbovePosition];
      headingBreadcrumbs.unshift(headingAbovePosition);
      collectAncestorHeadingsForHeadingAtIndex(headingIndexAbovePosition);
      return headingBreadcrumbs;
    }
    return headingBreadcrumbs;
  }
  isTopLevelListItem(listItem) {
    return listItem.parent <= 0;
  }
  getIndexOfHeadingAbove(position) {
    if (position === void 0)
      return -1;
    return this.headings.reduce(
      (previousIndex, lookingAtHeading, index) => lookingAtHeading.position.start.line < position.start.line ? index : previousIndex,
      -1
    );
  }
  getHeadingIndexContaining(position) {
    if (position === void 0)
      return -1;
    return this.headings.findIndex(
      (heading) => heading.position.start.line === position.start.line
    );
  }
};

// src/ui/components/context/formatting-utils.ts
var chainBreadcrumbs = (lines) => lines.map((line) => line.trim()).filter((line) => line.length > 0).join(" \u27A4 ");
var formatListBreadcrumbs = (fileContents, breadcrumbs) => chainBreadcrumbs(
  breadcrumbs.map((listCache) => getTextAtPosition(fileContents, listCache.position)).map((listText) => listText.trim().replace(/^-\s+/, ""))
);
var formatListWithDescendants = (textInput, listItems) => {
  const root = listItems[0];
  const leadingSpacesCount = root.position.start.col;
  return listItems.map(
    (itemCache) => getTextFromLineStartToPositionEnd(textInput, itemCache.position).slice(
      leadingSpacesCount
    )
  ).join("\n");
};
var formatHeadingBreadCrumbs = (breadcrumbs) => chainBreadcrumbs(breadcrumbs.map((headingCache) => headingCache.heading));

// src/ui/components/uic-ref-item.ts
var thePlugin2;
function setPluginVariableUIC_RefItem(plugin) {
  thePlugin2 = plugin;
}
var getUIC_Ref_Item = async (ref) => {
  const itemEl = createDiv();
  itemEl.addClass("snw-ref-item-info");
  itemEl.addClass("search-result-file-match");
  let startLine = "0";
  if (ref.reference.position !== void 0)
    startLine = ref.reference.position.start.line.toString();
  itemEl.setAttribute("snw-data-line-number", startLine);
  itemEl.setAttribute("snw-data-file-name", ref.sourceFile.path.replace(".md", ""));
  itemEl.setAttribute("data-href", ref.sourceFile.path.replace(".md", ""));
  const fileChuncksEl = await grabChunkOfFile(ref);
  itemEl.appendChild(fileChuncksEl);
  return itemEl;
};
var grabChunkOfFile = async (ref) => {
  const fileContents = await thePlugin2.app.vault.cachedRead(ref.sourceFile);
  const fileCache = thePlugin2.app.metadataCache.getFileCache(ref.sourceFile);
  const linkPosition = ref.reference.position;
  const container = createDiv();
  container.setAttribute("uic", "uic");
  const contextBuilder = new ContextBuilder(fileContents, fileCache);
  const headingBreadcrumbs = contextBuilder.getHeadingBreadcrumbs(linkPosition);
  if (headingBreadcrumbs.length > 0) {
    const headingBreadcrumbsEl = container.createDiv();
    headingBreadcrumbsEl.addClass("snw-breadcrumbs");
    headingBreadcrumbsEl.createEl("span", { text: "H" });
    await import_obsidian2.MarkdownRenderer.renderMarkdown(
      formatHeadingBreadCrumbs(headingBreadcrumbs),
      headingBreadcrumbsEl,
      ref.sourceFile.path,
      thePlugin2
    );
  }
  const indexOfListItemContainingLink = contextBuilder.getListItemIndexContaining(linkPosition);
  const isLinkInListItem = indexOfListItemContainingLink >= 0;
  if (isLinkInListItem) {
    const listBreadcrumbs = contextBuilder.getListBreadcrumbs(linkPosition);
    if (listBreadcrumbs.length > 0) {
      const contextEl2 = container.createDiv();
      contextEl2.addClass("snw-breadcrumbs");
      contextEl2.createEl("span", { text: "L" });
      await import_obsidian2.MarkdownRenderer.renderMarkdown(
        formatListBreadcrumbs(fileContents, listBreadcrumbs),
        contextEl2,
        ref.sourceFile.path,
        thePlugin2
      );
    }
    const listItemWithDescendants = contextBuilder.getListItemWithDescendants(
      indexOfListItemContainingLink
    );
    const contextEl = container.createDiv();
    await import_obsidian2.MarkdownRenderer.renderMarkdown(
      formatListWithDescendants(fileContents, listItemWithDescendants),
      contextEl,
      ref.sourceFile.path,
      thePlugin2
    );
  } else {
    const sectionContainingLink = contextBuilder.getSectionContaining(linkPosition);
    let blockContents = "";
    if ((sectionContainingLink == null ? void 0 : sectionContainingLink.position) !== void 0)
      blockContents = getTextAtPosition(fileContents, sectionContainingLink.position);
    await import_obsidian2.MarkdownRenderer.renderMarkdown(
      blockContents,
      container,
      ref.sourceFile.path,
      thePlugin2
    );
  }
  const headingThatContainsLink = contextBuilder.getHeadingContaining(linkPosition);
  if (headingThatContainsLink) {
    const firstSectionPosition = contextBuilder.getFirstSectionUnder(
      headingThatContainsLink.position
    );
    if (firstSectionPosition) {
      const contextEl = container.createDiv();
      await import_obsidian2.MarkdownRenderer.renderMarkdown(
        getTextAtPosition(fileContents, firstSectionPosition.position),
        contextEl,
        ref.sourceFile.path,
        thePlugin2
      );
    }
  }
  const elems = container.querySelectorAll("*");
  const res = Array.from(elems).find((v) => v.textContent == ref.reference.displayText);
  try {
    res.addClass("search-result-file-matched-text");
  } catch (error) {
  }
  return container;
};

// src/ui/components/uic-ref-title.ts
var import_obsidian3 = require("obsidian");
var getUIC_Ref_Title_Div = async (refType, realLink, key, filePath, refCount, lineNu, isPopover, thePlugin10) => {
  const titleEl = createDiv();
  titleEl.addClass(isPopover ? "snw-ref-title-popover" : "snw-ref-title-side-pane");
  titleEl.addClass("tree-item-self");
  titleEl.addClass("is-clickable");
  titleEl.setAttribute("snw-ref-title-type", refType);
  titleEl.setAttribute("snw-ref-title-reallink", realLink);
  titleEl.setAttribute("snw-ref-title-key", key);
  titleEl.setAttribute("snw-data-file-name", filePath);
  titleEl.setAttribute("snw-data-line-number", lineNu.toString());
  const titleLabelEl = createDiv({ cls: "snw-ref-title-popover-label" });
  titleLabelEl.innerText = realLink;
  titleEl.append(titleLabelEl);
  if (isPopover) {
    const openSidepaneIconEl = createSpan();
    openSidepaneIconEl.addClass("snw-ref-title-popover-icon");
    (0, import_obsidian3.setIcon)(openSidepaneIconEl, "more-horizontal");
    const imgWrappper = createSpan();
    imgWrappper.appendChild(openSidepaneIconEl);
    imgWrappper.addClass("snw-ref-title-popover-open-sidepane-icon");
    imgWrappper.setAttribute("snw-ref-title-type", refType);
    imgWrappper.setAttribute("snw-ref-title-reallink", realLink);
    imgWrappper.setAttribute("snw-ref-title-key", key);
    imgWrappper.setAttribute("snw-data-file-name", filePath);
    imgWrappper.setAttribute("snw-data-line-number", lineNu.toString());
    titleEl.appendChild(imgWrappper);
    setTimeout(async () => {
      if (imgWrappper) {
        imgWrappper.onclick = async (e) => {
          e.stopPropagation();
          hideAll({ duration: 0 });
          const parentEl = e.target.closest(".snw-ref-title-popover-open-sidepane-icon");
          const refType2 = parentEl.getAttribute("snw-ref-title-type");
          const realLink2 = parentEl.getAttribute("snw-ref-title-reallink");
          const key2 = parentEl.getAttribute("snw-ref-title-key");
          const path = parentEl.getAttribute("snw-data-file-name");
          const lineNu2 = parentEl.getAttribute("snw-data-line-number");
          thePlugin10.activateView(refType2, realLink2, key2, path, Number(lineNu2));
        };
      }
    }, 300);
  }
  return titleEl;
};

// src/ui/components/uic-ref-area.ts
var thePlugin3;
function setPluginVariableUIC_RefArea(plugin) {
  thePlugin3 = plugin;
}
var getUIC_Ref_Area = async (refType, realLink, key, filePath, lineNu, isHoverView) => {
  const refAreaItems = await getRefAreaItems(refType, key, filePath);
  const refAreaContainerEl = createDiv();
  refAreaContainerEl.append(
    await getUIC_Ref_Title_Div(
      refType,
      realLink,
      key,
      filePath,
      refAreaItems.refCount,
      lineNu,
      isHoverView,
      thePlugin3
    )
  );
  const refAreaEl = createDiv({ cls: "snw-ref-area" });
  refAreaEl.append(refAreaItems.response);
  refAreaContainerEl.append(refAreaEl);
  return refAreaContainerEl;
};
var getRefAreaItems = async (refType, key, filePath) => {
  let countOfRefs = 0;
  let linksToLoop = null;
  if (refType === "File") {
    const allLinks = getSnwAllLinksResolutions();
    const incomingLinks = allLinks.filter((f) => {
      var _a;
      if (!(f == null ? void 0 : f.resolvedFile))
        return false;
      return ((_a = f == null ? void 0 : f.resolvedFile) == null ? void 0 : _a.path) === filePath;
    });
    countOfRefs = incomingLinks.length;
    linksToLoop = incomingLinks;
  } else {
    let refCache = getReferencesCache()[key];
    if (refCache === void 0)
      refCache = getReferencesCache()[filePath + "#^" + key];
    const sortedCache = await sortRefCache(refCache);
    countOfRefs = sortedCache.length;
    linksToLoop = sortedCache;
  }
  const uniqueFileKeys = Array.from(
    new Set(linksToLoop.map((a) => a.sourceFile.path))
  ).map((file_path) => {
    return linksToLoop.find((a) => a.sourceFile.path === file_path);
  });
  const wrapperEl = createDiv();
  let maxItemsToShow = uniqueFileKeys.length;
  if (thePlugin3.settings.maxFileCountToDisplay != 1e3 && maxItemsToShow >= thePlugin3.settings.maxFileCountToDisplay)
    maxItemsToShow = thePlugin3.settings.maxFileCountToDisplay;
  for (let index = 0; index < maxItemsToShow; index++) {
    const file_path = uniqueFileKeys[index];
    const responseItemContainerEl = createDiv();
    responseItemContainerEl.addClass("snw-ref-item-container");
    responseItemContainerEl.addClass("tree-item");
    wrapperEl.appendChild(responseItemContainerEl);
    const refItemFileEl = createDiv();
    refItemFileEl.addClass("snw-ref-item-file");
    refItemFileEl.addClass("tree-item-self");
    refItemFileEl.addClass("search-result-file-title");
    refItemFileEl.addClass("is-clickable");
    refItemFileEl.setAttribute("snw-data-line-number", "-1");
    refItemFileEl.setAttribute(
      "snw-data-file-name",
      file_path.sourceFile.path.replace(".md", "")
    );
    refItemFileEl.setAttribute("data-href", file_path.sourceFile.path);
    refItemFileEl.setAttribute("href", file_path.sourceFile.path);
    const refItemFileIconEl = createDiv();
    refItemFileIconEl.addClass("snw-ref-item-file-icon");
    refItemFileIconEl.addClass("tree-item-icon");
    refItemFileIconEl.addClass("collapse-icon");
    (0, import_obsidian4.setIcon)(refItemFileIconEl, "file-box");
    const refItemFileLabelEl = createDiv();
    refItemFileLabelEl.addClass("snw-ref-item-file-label");
    refItemFileLabelEl.addClass("tree-item-inner");
    refItemFileLabelEl.innerText = file_path.sourceFile.basename;
    refItemFileEl.append(refItemFileIconEl);
    refItemFileEl.append(refItemFileLabelEl);
    responseItemContainerEl.appendChild(refItemFileEl);
    const refItemsCollectionE = createDiv();
    refItemsCollectionE.addClass("snw-ref-item-collection-items");
    refItemsCollectionE.addClass("search-result-file-matches");
    responseItemContainerEl.appendChild(refItemsCollectionE);
    for (const ref of linksToLoop) {
      if (file_path.sourceFile.path === ref.sourceFile.path) {
        refItemsCollectionE.appendChild(await getUIC_Ref_Item(ref));
      }
    }
  }
  return { response: wrapperEl, refCount: countOfRefs };
};
var sortRefCache = async (refCache) => {
  return refCache.sort((a, b) => {
    let positionA = 0;
    if (a.reference.position !== void 0)
      positionA = Number(a.reference.position.start.line);
    let positionB = 0;
    if (b.reference.position !== void 0)
      positionB = Number(b.reference.position.start.line);
    return a.sourceFile.basename.localeCompare(b.sourceFile.basename) || Number(positionA) - Number(positionB);
  });
};

// src/ui/components/uic-ref--parent.ts
var thePlugin4;
function setPluginVariableForUIC(plugin) {
  thePlugin4 = plugin;
  setPluginVariableUIC_RefItem(plugin);
}
var getUIC_Hoverview = async (instance) => {
  const { refType, realLink, key, filePath, lineNu } = await getDataElements(instance);
  const popoverEl = createDiv();
  popoverEl.addClass("snw-popover-container");
  popoverEl.addClass("search-result-container");
  popoverEl.appendChild(
    await getUIC_Ref_Area(refType, realLink, key, filePath, lineNu, true)
  );
  instance.setContent(popoverEl);
  setTimeout(async () => {
    await setFileLinkHandlers(false, popoverEl);
  }, 500);
  scrollResultsIntoView(popoverEl);
};
var getUIC_SidePane = async (refType, realLink, key, filePath, lineNu) => {
  const sidepaneEL = createDiv();
  sidepaneEL.addClass("snw-sidepane-container");
  sidepaneEL.addClass("search-result-container");
  sidepaneEL.append(
    await getUIC_Ref_Area(refType, realLink, key, filePath, lineNu, false)
  );
  setTimeout(async () => {
    await setFileLinkHandlers(false, sidepaneEL);
  }, 500);
  return sidepaneEL;
};
var setFileLinkHandlers = async (isHoverView, rootElementForViewEl) => {
  const linksToFiles = rootElementForViewEl.querySelectorAll(
    ".snw-ref-item-file, .snw-ref-item-info, .snw-ref-title-side-pane, .snw-ref-title-popover"
  );
  linksToFiles.forEach((node) => {
    if (!node.getAttribute("snw-has-handler")) {
      node.setAttribute("snw-has-handler", "true");
      node.addEventListener("click", async (e) => {
        var _a, _b;
        e.preventDefault();
        const handlerElement = e.target.closest(
          ".snw-ref-item-file, .snw-ref-item-info, .snw-ref-title-side-pane, .snw-ref-title-popover"
        );
        let lineNu = Number(handlerElement.getAttribute("snw-data-line-number"));
        const filePath = handlerElement.getAttribute("snw-data-file-name");
        const fileT = app.metadataCache.getFirstLinkpathDest(filePath, filePath);
        thePlugin4.app.workspace.getLeaf(import_obsidian5.Keymap.isModEvent(e)).openFile(fileT);
        const titleKey = handlerElement.getAttribute("snw-ref-title-key");
        if (titleKey) {
          if (titleKey.contains("#^")) {
            const destinationBlocks = Object.entries(
              (_a = thePlugin4.app.metadataCache.getFileCache(fileT)) == null ? void 0 : _a.blocks
            );
            if (destinationBlocks) {
              const blockID = titleKey.match(/#\^(.+)$/g)[0].replace("#^", "").toLowerCase();
              const l = destinationBlocks.find((b) => b[0] === blockID);
              lineNu = l[1].position.start.line;
            }
          } else if (titleKey.contains("#")) {
            const destinationHeadings = (_b = thePlugin4.app.metadataCache.getFileCache(fileT)) == null ? void 0 : _b.headings;
            if (destinationHeadings) {
              const headingKey = titleKey.match(/#(.+)/g)[0].replace("#", "");
              const l = destinationHeadings.find((h) => h.heading === headingKey);
              lineNu = l.position.start.line;
            }
          }
        }
        if (lineNu > 0) {
          setTimeout(() => {
            try {
              thePlugin4.app.workspace.getActiveViewOfType(import_obsidian5.MarkdownView).setEphemeralState({ line: lineNu });
            } catch (error) {
            }
          }, 400);
        }
      });
      if (thePlugin4.app.internalPlugins.plugins["page-preview"].enabled === true) {
        node.addEventListener("mouseover", (e) => {
          e.preventDefault();
          const hoverMetaKeyRequired = app.internalPlugins.plugins["page-preview"].instance.overrides["obsidian42-strange-new-worlds"] == false ? false : true;
          if (hoverMetaKeyRequired === false || hoverMetaKeyRequired === true && import_obsidian5.Keymap.isModifier(e, "Mod")) {
            const target = e.target;
            const previewLocation = {
              scroll: Number(target.getAttribute("snw-data-line-number"))
            };
            const filePath = target.getAttribute("snw-data-file-name");
            if (filePath) {
              app.workspace.trigger(
                "link-hover",
                {},
                target,
                filePath,
                "",
                previewLocation
              );
            }
          }
        });
      }
    }
  });
};
var getDataElements = async (instance) => {
  const parentElement = instance.reference;
  const refType = parentElement.getAttribute("data-snw-type");
  const realLink = parentElement.getAttribute("data-snw-reallink");
  const key = parentElement.getAttribute("data-snw-key");
  const path = parentElement.getAttribute("data-snw-filepath");
  const lineNum = Number(parentElement.getAttribute("snw-data-line-number"));
  return {
    refType,
    realLink,
    key,
    filePath: path,
    lineNu: lineNum
  };
};

// src/view-extensions/htmlDecorations.ts
var import_obsidian6 = require("obsidian");
var thePlugin5;
function setPluginVariableForHtmlDecorations(plugin) {
  thePlugin5 = plugin;
}
function htmlDecorationForReferencesElement(count, referenceType, realLink, key, filePath, attachCSSClass, lineNu) {
  var _a, _b;
  if ((_a = thePlugin5 == null ? void 0 : thePlugin5.snwAPI.enableDebugging) == null ? void 0 : _a.HtmlDecorationElements)
    thePlugin5.snwAPI.console(
      "htmlDecorations.htmlDecorationForReferencesElement(count, referenceType, realLink, key, filePath)",
      thePlugin5,
      count,
      referenceType,
      realLink,
      key,
      filePath
    );
  const element = createDiv({ cls: "snw-reference snw-" + referenceType });
  element.innerText = count.toString();
  element.setAttribute("data-snw-type", referenceType);
  element.setAttribute("data-snw-reallink", realLink);
  element.setAttribute("data-snw-key", key);
  element.setAttribute("data-snw-filepath", filePath);
  element.setAttribute("snw-data-line-number", lineNu.toString());
  if (attachCSSClass)
    element.addClass(attachCSSClass);
  if (import_obsidian6.Platform.isDesktop || import_obsidian6.Platform.isDesktopApp)
    element.onclick = async (e) => processHtmlDecorationReferenceEvent(e.target);
  if ((_b = thePlugin5 == null ? void 0 : thePlugin5.snwAPI.enableDebugging) == null ? void 0 : _b.HtmlDecorationElements)
    thePlugin5.snwAPI.console("returned element", element);
  const requireModifierKey = thePlugin5.settings.requireModifierKeyToActivateSNWView;
  let showTippy = true;
  const tippyObject = tippy_esm_default(element, {
    interactive: true,
    appendTo: () => document.body,
    allowHTML: true,
    zIndex: 9999,
    placement: "auto-end",
    // trigger: "click", // on click is another option instead of hovering at all
    onTrigger(instance, event) {
      const mouseEvent = event;
      if (requireModifierKey === false)
        return;
      if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
        showTippy = true;
      } else {
        showTippy = false;
      }
    },
    onShow(instance) {
      if (!showTippy)
        return false;
      setTimeout(async () => {
        await getUIC_Hoverview(instance);
      }, 1);
    }
  });
  tippyObject.popper.classList.add("snw-tippy");
  return element;
}
var processHtmlDecorationReferenceEvent = async (target) => {
  var _a, _b, _c, _d, _e, _f;
  const refType = (_a = target.getAttribute("data-snw-type")) != null ? _a : "";
  const realLink = (_b = target.getAttribute("data-snw-realLink")) != null ? _b : "";
  const key = (_c = target.getAttribute("data-snw-key")) != null ? _c : "";
  const filePath = (_d = target.getAttribute("data-snw-filepath")) != null ? _d : "";
  const lineNu = (_e = target.getAttribute("snw-data-line-number")) != null ? _e : "";
  if ((_f = thePlugin5.snwAPI.enableDebugging) == null ? void 0 : _f.HtmlDecorationElements)
    thePlugin5.snwAPI.console(
      "htmlDecorations.processHtmlDecorationReferenceEvent: target, realLink, key, refType, filePath",
      target,
      realLink,
      key,
      refType,
      filePath
    );
  thePlugin5.activateView(refType, realLink, key, filePath, Number(lineNu));
};

// src/view-extensions/references-cm6.ts
var thePlugin6;
function setPluginVariableForCM6InlineReferences(plugin) {
  thePlugin6 = plugin;
}
var InlineReferenceExtension = import_view.ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.view = view;
      this.decorations = import_view.Decoration.none;
      this.regxPattern = "";
      if (thePlugin6.settings.enableRenderingBlockIdInLivePreview)
        this.regxPattern = "(\\s\\^)(\\S+)$";
      if (thePlugin6.settings.enableRenderingEmbedsInLivePreview)
        this.regxPattern += (this.regxPattern != "" ? "|" : "") + "!\\[\\[(.*?)\\]\\]";
      if (thePlugin6.settings.enableRenderingLinksInLivePreview)
        this.regxPattern += (this.regxPattern != "" ? "|" : "") + "\\[\\[(.*?)\\]\\]";
      if (thePlugin6.settings.enableRenderingHeadersInLivePreview)
        this.regxPattern += (this.regxPattern != "" ? "|" : "") + "^#+\\s.+";
      if (this.regxPattern === "")
        return;
      this.decorator = new import_view.MatchDecorator({
        regexp: new RegExp(this.regxPattern, "g"),
        decorate: (add, from, to, match, view2) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
          const mdView = view2.state.field(import_obsidian7.editorInfoField);
          const mdViewFile = mdView.file;
          const firstCharacterMatch = match[0].charAt(0);
          const transformedCache = getSNWCacheByFile(mdViewFile);
          if (((_b = (_a = transformedCache == null ? void 0 : transformedCache.cacheMetaData) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b["snw-file-exclude"]) != true && ((_d = (_c = transformedCache == null ? void 0 : transformedCache.cacheMetaData) == null ? void 0 : _c.frontmatter) == null ? void 0 : _d["snw-canvas-exclude-edit"]) != true) {
            const widgetsToAdd = [];
            if (firstCharacterMatch === " " && ((_f = (_e = transformedCache == null ? void 0 : transformedCache.blocks) == null ? void 0 : _e.length) != null ? _f : 0) > 0) {
              widgetsToAdd.push({
                //blocks
                key: mdViewFile.path.replace(".md", "") + match[0].replace(" ^", ""),
                //change this to match the references cache
                transformedCachedItem: (_g = transformedCache.blocks) != null ? _g : null,
                refType: "block",
                from: to,
                to
              });
            } else if (firstCharacterMatch === "!" && ((_i = (_h = transformedCache == null ? void 0 : transformedCache.embeds) == null ? void 0 : _h.length) != null ? _i : 0) > 0) {
              let newEmbed = match[0].replace("![[", "").replace("]]", "");
              if (newEmbed.startsWith("#"))
                newEmbed = mdViewFile.path.replace(".md", "") + (0, import_obsidian7.stripHeading)(newEmbed);
              widgetsToAdd.push({
                key: newEmbed,
                transformedCachedItem: (_j = transformedCache.embeds) != null ? _j : null,
                refType: "embed",
                from: to,
                to
              });
            } else if (firstCharacterMatch === "[" && ((_l = (_k = transformedCache == null ? void 0 : transformedCache.links) == null ? void 0 : _k.length) != null ? _l : 0) > 0) {
              let newLink = match[0].replace("[[", "").replace("]]", "");
              if (newLink.startsWith("#"))
                newLink = mdViewFile.path.replace(".md", "") + newLink;
              widgetsToAdd.push({
                key: newLink,
                transformedCachedItem: (_m = transformedCache.links) != null ? _m : null,
                refType: "link",
                from: to,
                to
              });
            } else if (firstCharacterMatch === "#" && ((_o = (_n = transformedCache == null ? void 0 : transformedCache.headings) == null ? void 0 : _n.length) != null ? _o : 0) > 0) {
              widgetsToAdd.push({
                // @ts-ignore
                key: (0, import_obsidian7.stripHeading)(match[0].replace(/^#+/, "").substring(1)),
                transformedCachedItem: (_p = transformedCache.headings) != null ? _p : null,
                refType: "heading",
                from: to,
                to
              });
              if (thePlugin6.settings.enableRenderingLinksInLivePreview) {
                const linksinHeader = match[0].match(/\[\[(.*?)\]\]|!\[\[(.*?)\]\]/g);
                if (linksinHeader)
                  for (const l of linksinHeader) {
                    widgetsToAdd.push({
                      key: l.replace("![[", "").replace("[[", "").replace("]]", ""),
                      //change this to match the references cache
                      transformedCachedItem: l.startsWith("!") ? (_q = transformedCache.embeds) != null ? _q : null : (_r = transformedCache.links) != null ? _r : null,
                      refType: "link",
                      from: to - match[0].length + (match[0].indexOf(l) + l.length),
                      to: to - match[0].length + (match[0].indexOf(l) + l.length)
                    });
                  }
              }
            }
            for (const ref of widgetsToAdd.sort((a, b) => a.to - b.to)) {
              if (ref.key != "") {
                const wdgt = constructWidgetForInlineReference(
                  ref.refType,
                  ref.key,
                  (_s = ref.transformedCachedItem) != null ? _s : [],
                  mdViewFile.path
                );
                if (wdgt != null) {
                  add(ref.from, ref.to, import_view.Decoration.widget({ widget: wdgt, side: 1 }));
                }
              }
            }
          }
        }
      });
      if (this.regxPattern != "")
        this.decorations = this.decorator.createDeco(view);
    }
    update(update) {
      if (this.regxPattern != "" && (update.docChanged || update.viewportChanged)) {
        this.decorations = this.decorator.updateDeco(update, this.decorations);
      }
    }
  },
  {
    decorations: (v) => v.decorations
  }
);
var constructWidgetForInlineReference = (refType, key, references2, filePath) => {
  var _a, _b, _c;
  for (let i = 0; i < references2.length; i++) {
    const ref = references2[i];
    let matchKey = ref.key;
    if (refType === "heading") {
      matchKey = (0, import_obsidian7.stripHeading)((_a = ref.headerMatch) != null ? _a : "");
      key = key.replace(/^\s+|\s+$/g, "");
    }
    if (refType === "embed" || refType === "link") {
      if (key.contains("|"))
        key = key.substring(0, key.search(/\|/));
      const parsedKey = parseLinkTextToFullPath(key);
      key = parsedKey === "" ? key : parsedKey;
      if (matchKey.startsWith("#")) {
        matchKey = filePath.replace(".md", "") + (0, import_obsidian7.stripHeading)(matchKey);
      }
    }
    if (matchKey === key) {
      const filePath2 = ((_b = ref == null ? void 0 : ref.references[0]) == null ? void 0 : _b.resolvedFile) ? ref.references[0].resolvedFile.path.replace(".md", "") : key;
      if (((_c = ref == null ? void 0 : ref.references[0]) == null ? void 0 : _c.excludedFile) != true && (ref == null ? void 0 : ref.references.length) >= thePlugin6.settings.minimumRefCountThreshold)
        return new InlineReferenceWidget(
          ref.references.length,
          ref.type,
          ref.references[0].realLink,
          ref.key,
          filePath2,
          "",
          ref.pos.start.line
        );
      else
        return null;
    }
  }
  return null;
};
var InlineReferenceWidget = class extends import_view.WidgetType {
  //number of line within the file
  constructor(refCount, cssclass, realLink, key, filePath, addCSSClass, lineNu) {
    super();
    this.referenceCount = refCount;
    this.referenceType = cssclass;
    this.realLink = realLink;
    this.key = key;
    this.filePath = filePath;
    this.addCssClass = addCSSClass;
    this.lineNu = lineNu;
  }
  // eq(other: InlineReferenceWidget) {
  //     return other.referenceCount == this.referenceCount;
  // }
  toDOM() {
    return htmlDecorationForReferencesElement(
      this.referenceCount,
      this.referenceType,
      this.realLink,
      this.key,
      this.filePath,
      this.addCssClass,
      this.lineNu
    );
  }
  destroy() {
  }
  ignoreEvent() {
    return false;
  }
};

// src/view-extensions/references-preview.ts
var import_obsidian8 = require("obsidian");
var thePlugin7;
function setPluginVariableForMarkdownPreviewProcessor(plugin) {
  thePlugin7 = plugin;
}
function markdownPreviewProcessor(el, ctx2) {
  var _a, _b, _c, _d;
  if (thePlugin7.snwAPI.enableDebugging.PreviewRendering)
    thePlugin7.snwAPI.console(
      "markdownPreviewProcessor(HTMLElement, MarkdownPostProcessorContext,ctx.getSectionInfo",
      el,
      ctx2,
      ctx2.getSectionInfo(el)
    );
  if (ctx2.remainingNestLevel === 4)
    return;
  if (((_a = ctx2 == null ? void 0 : ctx2.frontmatter) == null ? void 0 : _a["snw-file-exclude"]) === true)
    return;
  if (((_b = ctx2 == null ? void 0 : ctx2.frontmatter) == null ? void 0 : _b["snw-canvas-exclude-preview"]) === true)
    return;
  if (el.hasAttribute("uic"))
    return;
  const currentFile = thePlugin7.app.vault.fileMap[ctx2.sourcePath];
  if (currentFile === void 0)
    return;
  const fileCache = thePlugin7.app.metadataCache.getFileCache(currentFile);
  if (((_c = fileCache == null ? void 0 : fileCache.frontmatter) == null ? void 0 : _c["kanban-plugin"]) || ((_d = ctx2.el.parentElement) == null ? void 0 : _d.classList.contains("kanban-plugin__markdown-preview-view")))
    return;
  try {
    ctx2.addChild(new snwChildComponent(el, ctx2.getSectionInfo(el), currentFile));
  } catch (error) {
  }
}
var snwChildComponent = class extends import_obsidian8.MarkdownRenderChild {
  constructor(containerEl, sectionInfo, currentFile) {
    super(containerEl);
    this.containerEl = containerEl;
    this.sectionInfo = sectionInfo;
    this.currentFile = currentFile;
    if (thePlugin7.snwAPI.enableDebugging.PreviewRendering)
      thePlugin7.snwAPI.console(
        "snwChildComponent(HTMLElement, MarkdownPostProcessorContext,currentfile",
        containerEl,
        sectionInfo,
        currentFile
      );
  }
  onload() {
    this.processMarkdown();
  }
  processMarkdown() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const minRefCountThreshold = thePlugin7.settings.minimumRefCountThreshold;
    const transformedCache = getSNWCacheByFile(this.currentFile);
    if (((_b = (_a = transformedCache == null ? void 0 : transformedCache.cacheMetaData) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b["snw-file-exclude"]) === true)
      return;
    if ((transformedCache == null ? void 0 : transformedCache.blocks) || transformedCache.embeds || transformedCache.headings || transformedCache.links) {
      if (thePlugin7.settings.enableRenderingBlockIdInMarkdown && (transformedCache == null ? void 0 : transformedCache.blocks)) {
        let isThisAnEmbed = false;
        try {
          isThisAnEmbed = ctx.containerEl.closest(".snw-embed-preview").nextSibling.classList.contains("snw-reference");
        } catch (error) {
        }
        for (const value of transformedCache.blocks) {
          if (((_c = value.references[0]) == null ? void 0 : _c.excludedFile) != true && value.references.length >= minRefCountThreshold && value.pos.start.line >= ((_d = this.sectionInfo) == null ? void 0 : _d.lineStart) && value.pos.end.line <= ((_e = this.sectionInfo) == null ? void 0 : _e.lineEnd) && !isThisAnEmbed) {
            const referenceElement = htmlDecorationForReferencesElement(
              value.references.length,
              "block",
              value.references[0].realLink,
              value.key,
              (_g = (_f = value.references[0]) == null ? void 0 : _f.resolvedFile) == null ? void 0 : _g.path.replace(".md", ""),
              "",
              value.pos.start.line
            );
            let blockElement = this.containerEl.querySelector("p");
            const valueLineInSection = value.pos.start.line - this.sectionInfo.lineStart;
            if (!blockElement) {
              blockElement = this.containerEl.querySelector(
                `li[data-line="${valueLineInSection}"]`
              );
              if (blockElement.querySelector("ul"))
                blockElement.querySelector("ul").before(referenceElement);
              else
                blockElement.append(referenceElement);
            } else {
              if (!blockElement) {
                blockElement = this.containerEl.querySelector(
                  `ol[data-line="${valueLineInSection}"]`
                );
                blockElement.append(referenceElement);
              } else {
                blockElement.append(referenceElement);
              }
            }
            try {
              if (!blockElement.hasClass("snw-block-preview")) {
                referenceElement.addClass("snw-block-preview");
              }
            } catch (error) {
            }
          }
        }
      }
      if (thePlugin7.settings.enableRenderingEmbedsInMarkdown && (transformedCache == null ? void 0 : transformedCache.embeds)) {
        this.containerEl.querySelectorAll(".internal-embed:not(.snw-embed-preview)").forEach((element) => {
          var _a2, _b2, _c2;
          let embedKey = parseLinkTextToFullPath(element.getAttribute("src"));
          if (embedKey === "") {
            embedKey = this.currentFile.path.replace(".md", "") + (0, import_obsidian8.stripHeading)(element.getAttribute("src"));
          }
          for (const value of transformedCache.embeds) {
            if (((_a2 = value.references[0]) == null ? void 0 : _a2.excludedFile) != true && value.references.length >= minRefCountThreshold && embedKey.endsWith(value.key)) {
              const referenceElement = htmlDecorationForReferencesElement(
                value.references.length,
                "embed",
                value.references[0].realLink,
                value.key,
                (_c2 = (_b2 = value.references[0]) == null ? void 0 : _b2.resolvedFile) == null ? void 0 : _c2.path.replace(".md", ""),
                "",
                value.pos.start.line
              );
              referenceElement.addClass("snw-embed-preview");
              element.after(referenceElement);
              break;
            }
          }
        });
      }
      if (thePlugin7.settings.enableRenderingHeadersInMarkdown) {
        const headerKey = this.containerEl.querySelector("[data-heading]");
        if ((transformedCache == null ? void 0 : transformedCache.headings) && headerKey) {
          const textContext = headerKey.getAttribute("data-heading");
          for (const value of transformedCache.headings) {
            if (((_h = value.references[0]) == null ? void 0 : _h.excludedFile) != true && value.references.length >= minRefCountThreshold && value.headerMatch === textContext) {
              const referenceElement = htmlDecorationForReferencesElement(
                value.references.length,
                "heading",
                value.references[0].realLink,
                value.key,
                (_j = (_i = value.references[0]) == null ? void 0 : _i.resolvedFile) == null ? void 0 : _j.path.replace(".md", ""),
                "",
                value.pos.start.line
              );
              referenceElement.addClass("snw-heading-preview");
              this.containerEl.querySelector("h1,h2,h3,h4,h5,h6").insertAdjacentElement("beforeend", referenceElement);
              break;
            }
          }
        }
      }
      if (thePlugin7.settings.enableRenderingLinksInMarkdown && (transformedCache == null ? void 0 : transformedCache.links)) {
        this.containerEl.querySelectorAll("a.internal-link:not(.snw-link-preview)").forEach((element) => {
          var _a2, _b2, _c2;
          const link = parseLinkTextToFullPath(element.getAttribute("data-href"));
          for (const value of transformedCache.links) {
            if (((_a2 = value.references[0]) == null ? void 0 : _a2.excludedFile) != true && value.references.length >= minRefCountThreshold && (value.key === link || (value == null ? void 0 : value.original) != void 0 && (value == null ? void 0 : value.original.contains(link)))) {
              const referenceElement = htmlDecorationForReferencesElement(
                value.references.length,
                "link",
                value.references[0].realLink,
                value.key,
                (_c2 = (_b2 = value.references[0]) == null ? void 0 : _b2.resolvedFile) == null ? void 0 : _c2.path.replace(".md", ""),
                "",
                value.pos.start.line
              );
              referenceElement.addClass("snw-link-preview");
              element.after(referenceElement);
              break;
            }
          }
        });
      }
    }
  }
};

// src/view-extensions/gutters-cm6.ts
var import_view2 = require("@codemirror/view");
var import_obsidian9 = require("obsidian");
var thePlugin8;
function setPluginVariableForCM6Gutter(plugin) {
  thePlugin8 = plugin;
}
var referenceGutterMarker = class extends import_view2.GutterMarker {
  //if a reference need special treatment, this class can be assigned
  constructor(refCount, cssclass, realLink, key, filePath, addCSSClass) {
    super();
    this.referenceCount = refCount;
    this.referenceType = cssclass;
    this.realLink = realLink;
    this.key = key;
    this.filePath = filePath;
    this.addCssClass = addCSSClass;
  }
  toDOM() {
    return htmlDecorationForReferencesElement(
      this.referenceCount,
      this.referenceType,
      this.realLink,
      this.key,
      this.filePath,
      this.addCssClass,
      0
    );
  }
};
var emptyMarker = new class extends import_view2.GutterMarker {
  toDOM() {
    return document.createTextNode("\xF8\xF8\xF8");
  }
}();
var ReferenceGutterExtension = (0, import_view2.gutter)({
  class: "snw-gutter-ref",
  lineMarker(editorView, line) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (thePlugin8.snwAPI.enableDebugging.GutterEmbedCounter)
      thePlugin8.snwAPI.console(
        "ReferenceGutterExtension(EditorView, BlockInfo)",
        editorView,
        line
      );
    const mdView = editorView.state.field(import_obsidian9.editorInfoField);
    if (!mdView.file)
      return null;
    const transformedCache = getSNWCacheByFile(mdView.file);
    if (((_b = (_a = transformedCache == null ? void 0 : transformedCache.cacheMetaData) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b["snw-file-exclude"]) === true)
      return null;
    if (((_d = (_c = transformedCache == null ? void 0 : transformedCache.cacheMetaData) == null ? void 0 : _c.frontmatter) == null ? void 0 : _d["snw-canvas-exclude-edit"]) === true)
      return null;
    const embedsFromMetaDataCache = (_e = mdView.app.metadataCache.getFileCache(mdView.file)) == null ? void 0 : _e.embeds;
    if (!embedsFromMetaDataCache)
      return null;
    if ((_f = embedsFromMetaDataCache == null ? void 0 : embedsFromMetaDataCache.length) != null ? _f : 0 >= thePlugin8.settings.minimumRefCountThreshold) {
      const lineNumberInFile = editorView.state.doc.lineAt(line.from).number;
      for (const embed of embedsFromMetaDataCache) {
        if (embed.position.start.line + 1 === lineNumberInFile) {
          for (const ref of (_g = transformedCache == null ? void 0 : transformedCache.embeds) != null ? _g : []) {
            if (((_h = ref == null ? void 0 : ref.references[0]) == null ? void 0 : _h.excludedFile) != true && (ref == null ? void 0 : ref.references.length) > 0 && (ref == null ? void 0 : ref.pos.start.line) + 1 === lineNumberInFile) {
              const lineToAnalyze = editorView.state.doc.lineAt(line.from).text.trim();
              if (lineToAnalyze.startsWith("!")) {
                const strippedLineToAnalyze = lineToAnalyze.replace("![[", "").replace("]]", "");
                let lineFromFile = "";
                if (strippedLineToAnalyze.startsWith("#")) {
                  lineFromFile = mdView.file.path.replace(".md", "") + (0, import_obsidian9.stripHeading)(strippedLineToAnalyze);
                } else {
                  lineFromFile = parseLinkTextToFullPath(strippedLineToAnalyze);
                }
                if (lineFromFile === ref.key) {
                  if (thePlugin8.snwAPI.enableDebugging.GutterEmbedCounter)
                    thePlugin8.snwAPI.console(
                      "ReferenceGutterExtension New gutter",
                      ref.references.length,
                      "embed",
                      ref.key,
                      ref.key,
                      "snw-embed-special"
                    );
                  return new referenceGutterMarker(
                    ref.references.length,
                    "embed",
                    ref.references[0].realLink,
                    ref.key,
                    ((_j = (_i = ref.references[0].resolvedFile) == null ? void 0 : _i.path) != null ? _j : "").replace(".md", ""),
                    "snw-embed-special"
                  );
                }
              }
            }
          }
        }
      }
    }
    return null;
  },
  initialSpacer: () => emptyMarker
});
var gutters_cm6_default = ReferenceGutterExtension;

// src/ui/headerRefCount.ts
var import_obsidian10 = require("obsidian");
var thePlugin9;
function setPluginVariableForHeaderRefCount(plugin) {
  thePlugin9 = plugin;
}
function setHeaderWithReferenceCounts() {
  var _a;
  if ((_a = thePlugin9.snwAPI.enableDebugging) == null ? void 0 : _a.LinkCountInHeader)
    thePlugin9.snwAPI.console(
      "headerImageCount.setHeaderWithReferenceCounts(thePlugin)",
      SNWPlugin
    );
  thePlugin9.app.workspace.iterateAllLeaves((leaf) => {
    if (leaf.view.getViewType() === "markdown")
      processHeader(leaf.view);
  });
}
function processHeader(mdView) {
  var _a, _b, _c, _d, _e, _f, _g;
  if ((_a = thePlugin9.snwAPI.enableDebugging) == null ? void 0 : _a.LinkCountInHeader)
    thePlugin9.snwAPI.console(
      "headerImageCount.processHeader(ThePlugin, MarkdownView)",
      thePlugin9,
      mdView
    );
  const mdViewFile = mdView.file;
  const allLinks = getSnwAllLinksResolutions();
  if (allLinks == void 0)
    return;
  const incomingLinks = allLinks.filter((f) => {
    var _a2;
    if (!(f == null ? void 0 : f.resolvedFile))
      return false;
    return ((_a2 = f == null ? void 0 : f.resolvedFile) == null ? void 0 : _a2.path) === mdViewFile.path;
  });
  let incomingLinksCount = incomingLinks.length;
  const transformedCache = getSNWCacheByFile(mdViewFile);
  if (((_c = (_b = transformedCache == null ? void 0 : transformedCache.cacheMetaData) == null ? void 0 : _b.frontmatter) == null ? void 0 : _c["snw-file-exclude"]) === true)
    incomingLinksCount = 0;
  if (((_d = incomingLinks[0]) == null ? void 0 : _d.excludedFile) === true)
    incomingLinksCount = 0;
  if (incomingLinksCount < thePlugin9.settings.minimumRefCountThreshold) {
    if (mdView.contentEl.querySelector(".snw-header-count-wrapper"))
      (_e = mdView.contentEl.querySelector(".snw-header-count-wrapper")) == null ? void 0 : _e.remove();
    return;
  }
  let snwTitleRefCountDisplayCountEl = mdView.contentEl.querySelector(".snw-header-count");
  if (snwTitleRefCountDisplayCountEl && snwTitleRefCountDisplayCountEl.getAttribute("data-snw-key") === mdViewFile.basename) {
    snwTitleRefCountDisplayCountEl.innerText = " " + incomingLinks.length.toString() + " ";
    return;
  }
  const containerViewContent = mdView.contentEl;
  if (mdView.contentEl.querySelector(".snw-header-count-wrapper"))
    (_f = mdView.contentEl.querySelector(".snw-header-count-wrapper")) == null ? void 0 : _f.remove();
  let wrapper = containerViewContent.querySelector(
    ".snw-header-count-wrapper"
  );
  if (!wrapper) {
    wrapper = createDiv({ cls: "snw-header-count-wrapper" });
    snwTitleRefCountDisplayCountEl = createDiv({ cls: "snw-header-count" });
    wrapper.appendChild(snwTitleRefCountDisplayCountEl);
    containerViewContent.prepend(wrapper);
  } else {
    snwTitleRefCountDisplayCountEl = containerViewContent.querySelector(".snw-header-count");
  }
  if (snwTitleRefCountDisplayCountEl)
    snwTitleRefCountDisplayCountEl.innerText = " " + incomingLinks.length.toString() + " ";
  if ((import_obsidian10.Platform.isDesktop || import_obsidian10.Platform.isDesktopApp) && snwTitleRefCountDisplayCountEl) {
    snwTitleRefCountDisplayCountEl.onclick = (e) => {
      e.stopPropagation();
      if (wrapper)
        processHtmlDecorationReferenceEvent(wrapper);
    };
  }
  wrapper.setAttribute("data-snw-reallink", mdViewFile.basename);
  wrapper.setAttribute("data-snw-key", mdViewFile.basename);
  wrapper.setAttribute("data-snw-type", "File");
  wrapper.setAttribute("data-snw-filepath", mdViewFile.path);
  wrapper.onclick = (e) => {
    e.stopPropagation();
    processHtmlDecorationReferenceEvent(e.target);
  };
  const requireModifierKey = thePlugin9.settings.requireModifierKeyToActivateSNWView;
  let showTippy = true;
  const tippyObject = tippy_esm_default(wrapper, {
    interactive: true,
    appendTo: () => document.body,
    allowHTML: true,
    zIndex: 9999,
    placement: "auto-end",
    onTrigger(instance, event) {
      const mouseEvent = event;
      if (requireModifierKey === false)
        return;
      if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
        showTippy = true;
      } else {
        showTippy = false;
      }
    },
    onShow(instance) {
      if (!showTippy)
        return false;
      setTimeout(async () => {
        await getUIC_Hoverview(instance);
      }, 1);
    }
  });
  tippyObject.popper.classList.add("snw-tippy");
  if ((_g = thePlugin9.snwAPI.enableDebugging) == null ? void 0 : _g.LinkCountInHeader)
    thePlugin9.snwAPI.console(
      "snwTitleRefCountDisplayCountEl",
      snwTitleRefCountDisplayCountEl
    );
}

// src/ui/sidebar-pane.ts
var import_obsidian11 = require("obsidian");
var VIEW_TYPE_SNW = "Strange New Worlds";
var SideBarPaneView = class extends import_obsidian11.ItemView {
  constructor(leaf, thePlugin10) {
    super(leaf);
    this.thePlugin = thePlugin10;
  }
  getViewType() {
    return VIEW_TYPE_SNW;
  }
  getDisplayText() {
    return VIEW_TYPE_SNW;
  }
  getIcon() {
    return "file-digit";
  }
  async onOpen() {
    const container = this.containerEl;
    const loadingEL = container.createSpan({ cls: "snw-sidepane-loading" });
    const bannerEl = createDiv({ cls: "snw-sidepane-loading-banner" });
    bannerEl.innerText = `Discovering Strange New Worlds...`;
    loadingEL.appendChild(bannerEl);
    const pendingTextEl = createDiv({ cls: "snw-sidepane-loading-subtext" });
    pendingTextEl.innerText = `Click a reference counter in the main document for information to appear here.`;
    loadingEL.appendChild(pendingTextEl);
    container.empty();
    container.appendChild(loadingEL);
  }
  async updateView() {
    const refType = this.thePlugin.lastSelectedReferenceType;
    const realLink = this.thePlugin.lastSelectedReferenceRealLink;
    const key = this.thePlugin.lastSelectedReferenceKey;
    const filePath = this.thePlugin.lastSelectedReferenceFilePath;
    const lineNu = this.thePlugin.lastSelectedLineNumber;
    if (this.thePlugin.snwAPI.enableDebugging.SidePane) {
      this.thePlugin.snwAPI.console(
        "sidepane.open() refType, realLink, key, filePath",
        refType,
        realLink,
        key,
        filePath
      );
      this.thePlugin.snwAPI.console(
        "sidepane.open() getReferencesCache()",
        getReferencesCache()
      );
    }
    this.containerEl.replaceChildren(
      await getUIC_SidePane(refType, realLink, key, filePath, lineNu)
    );
    scrollResultsIntoView(this.containerEl);
  }
  async onClose() {
  }
};

// src/ui/settingsTab.ts
var import_obsidian12 = require("obsidian");
var DEFAULT_SETTINGS = {
  enableOnStartupDesktop: true,
  enableOnStartupMobile: true,
  minimumRefCountThreshold: 1,
  maxFileCountToDisplay: 100,
  displayIncomingFilesheader: true,
  displayInlineReferencesLivePreview: true,
  displayInlineReferencesMarkdown: true,
  displayEmbedReferencesInGutter: true,
  displayEmbedReferencesInGutterMobile: false,
  cacheUpdateInMilliseconds: 500,
  enableRenderingBlockIdInMarkdown: true,
  enableRenderingLinksInMarkdown: true,
  enableRenderingHeadersInMarkdown: true,
  enableRenderingEmbedsInMarkdown: true,
  enableRenderingBlockIdInLivePreview: true,
  enableRenderingLinksInLivePreview: true,
  enableRenderingHeadersInLivePreview: true,
  enableRenderingEmbedsInLivePreview: true,
  enableIgnoreObsExcludeFoldersLinksFrom: false,
  enableIgnoreObsExcludeFoldersLinksTo: false,
  requireModifierKeyToActivateSNWView: false
};
var SettingsTab = class extends import_obsidian12.PluginSettingTab {
  constructor(app2, plugin) {
    super(app2, plugin);
    this.thePlugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: this.thePlugin.appName });
    containerEl.createEl("h2", { text: "SNW Activation" });
    new import_obsidian12.Setting(containerEl).setName("Require modifier key to activate SNW").setDesc(
      `If enabled, SNW will only activate when the modifier key is pressed when hovering the mouse over an SNW counter.  
						Otherwise, SNW will activate on a mouse hover. May require reopening open files to take effect.`
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.requireModifierKeyToActivateSNWView);
      cb.onChange(async (value) => {
        this.thePlugin.settings.requireModifierKeyToActivateSNWView = value;
        await this.thePlugin.saveSettings();
      });
    });
    containerEl.createEl("h2", { text: "Thresholds" });
    new import_obsidian12.Setting(containerEl).setName("Minimal required count to show counter").setDesc(
      `This setting defines how many references there needs to be for the reference count box to appear. May require reloading open files.
				 Currently set to: ${this.thePlugin.settings.minimumRefCountThreshold} references.`
    ).addSlider(
      (slider) => slider.setLimits(1, 1e3, 1).setValue(this.thePlugin.settings.minimumRefCountThreshold).onChange(async (value) => {
        this.thePlugin.settings.minimumRefCountThreshold = value;
        await this.thePlugin.saveSettings();
      }).setDynamicTooltip()
    );
    new import_obsidian12.Setting(containerEl).setName("Maximum file references to show").setDesc(
      `This setting defines the max amount of files with their references are displayed in the popup or sidebar.  Set to 1000 for no maximum.
				 Currently set to: ${this.thePlugin.settings.maxFileCountToDisplay} references.`
    ).addSlider(
      (slider) => slider.setLimits(1, 1e3, 1).setValue(this.thePlugin.settings.maxFileCountToDisplay).onChange(async (value) => {
        this.thePlugin.settings.maxFileCountToDisplay = value;
        await this.thePlugin.saveSettings();
      }).setDynamicTooltip()
    );
    containerEl.createEl("h2", {
      text: "Use Obsidian's Excluded Files list (Settings > Files & Links)"
    });
    new import_obsidian12.Setting(containerEl).setName("Outgoing links").setDesc(
      "If enabled, links FROM files in the excluded folder will not be included in SNW's reference counters. May require restarting Obsidian."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableIgnoreObsExcludeFoldersLinksFrom);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableIgnoreObsExcludeFoldersLinksFrom = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Incoming links").setDesc(
      "If enabled, links TO files in the excluded folder will not be included in SNW's reference counters.  May require restarting Obsidian."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableIgnoreObsExcludeFoldersLinksTo);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableIgnoreObsExcludeFoldersLinksTo = value;
        await this.thePlugin.saveSettings();
      });
    });
    containerEl.createEl("h2", { text: "Enable on startup" });
    new import_obsidian12.Setting(containerEl).setName("Enable upon startup (Desktop)").setDesc(
      "If disabled, SNW will not show block counters from startup until enabled from the command palette."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableOnStartupDesktop);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableOnStartupDesktop = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Enable startup (Mobile)").setDesc(
      "If disabled, SNW will not show block counters from startup until enabled from the command palette."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableOnStartupMobile);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableOnStartupMobile = value;
        await this.thePlugin.saveSettings();
      });
    });
    containerEl.createEl("h2", { text: "View Modes" });
    new import_obsidian12.Setting(containerEl).setName("Incoming Links Header Count").setDesc("In header of a document, show number of incoming link to that file.").addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.displayIncomingFilesheader);
      cb.onChange(async (value) => {
        this.thePlugin.settings.displayIncomingFilesheader = value;
        this.thePlugin.toggleStateHeaderCount();
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Show SNW indicators in Live Preview Editor").setDesc(
      "While using Live Preview, Display inline of the text of documents all reference counts for links, blocks and embeds."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.displayInlineReferencesLivePreview);
      cb.onChange(async (value) => {
        this.thePlugin.settings.displayInlineReferencesLivePreview = value;
        this.thePlugin.toggleStateSNWLivePreview();
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Show SNW indicators in Reading view ").setDesc(
      "While in Reading View of a document, display inline of the text of documents all reference counts for links, blocks and embeds."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.displayInlineReferencesMarkdown);
      cb.onChange(async (value) => {
        this.thePlugin.settings.displayInlineReferencesMarkdown = value;
        this.thePlugin.toggleStateSNWMarkdownPreview();
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Embed references in Gutter in Live Preview Mode (Desktop)").setDesc(
      `Displays a count of references in the gutter while in live preview. This is done only in a
					  special scenario. It has to do with the way Obsidian renders embeds, example: ![[link]] when  
					  they are on its own line. Strange New Worlds cannot embed the count in this scenario, so a hint is 
					  displayed in the gutter. It is a hack, but at least we get some information.`
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.displayEmbedReferencesInGutter);
      cb.onChange(async (value) => {
        this.thePlugin.settings.displayEmbedReferencesInGutter = value;
        this.thePlugin.toggleStateSNWGutters();
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Embed references in Gutter in Live Preview Mode (Mobile)").setDesc(
      `This is off by default on mobile since the gutter takes up some space in the left margin.`
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.displayEmbedReferencesInGutterMobile);
      cb.onChange(async (value) => {
        this.thePlugin.settings.displayEmbedReferencesInGutterMobile = value;
        this.thePlugin.toggleStateSNWGutters();
        await this.thePlugin.saveSettings();
      });
    });
    containerEl.createEl("h2", { text: "Enable Reference Types in Reading mode" });
    containerEl.createEl("sup", {
      text: "(requires reopening documents to take effect)"
    });
    new import_obsidian12.Setting(containerEl).setName("Block ID").setDesc(
      "Identifies block ID's, for example text blocks that end with a ^ and unique ID for that text block."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingBlockIdInMarkdown);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingBlockIdInMarkdown = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Embeds").setDesc(
      "Identifies embedded links, that is links that start with an explanation mark. For example: ![[PageName]]."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingEmbedsInMarkdown);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingEmbedsInMarkdown = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Links").setDesc("Identifies links in a document. For example: [[PageName]].").addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingLinksInMarkdown);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingLinksInMarkdown = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Headers").setDesc(
      "Identifies headers, that is lines of text that start with a hash mark or multiple hash marks. For example: # Heading 1."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingHeadersInMarkdown);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingHeadersInMarkdown = value;
        await this.thePlugin.saveSettings();
      });
    });
    containerEl.createEl("h2", { text: "Enable Reference Types in Live Preview Mode" });
    containerEl.createEl("sup", {
      text: "(requires reopening documents to take effect)"
    });
    new import_obsidian12.Setting(containerEl).setName("Block ID").setDesc(
      "Identifies block ID's, for example text blocks that end with a ^ and unique ID for that text block."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingBlockIdInLivePreview);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingBlockIdInLivePreview = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Embeds").setDesc(
      "Identifies embedded links, that is links that start with an explanation mark. For example: ![[PageName]]."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingEmbedsInLivePreview);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingEmbedsInLivePreview = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Links").setDesc("Identifies links in a document. For example: [[PageName]].").addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingLinksInLivePreview);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingLinksInLivePreview = value;
        await this.thePlugin.saveSettings();
      });
    });
    new import_obsidian12.Setting(containerEl).setName("Headers").setDesc(
      "Identifies headers, that is lines of text that start with a hash mark or multiple hash marks. For example: # Heading 1."
    ).addToggle((cb) => {
      cb.setValue(this.thePlugin.settings.enableRenderingHeadersInLivePreview);
      cb.onChange(async (value) => {
        this.thePlugin.settings.enableRenderingHeadersInLivePreview = value;
        await this.thePlugin.saveSettings();
      });
    });
    containerEl.createEl("h2", { text: "Cache Tuning" });
    new import_obsidian12.Setting(containerEl).setName(`How often should the SNW Cache update`).setDesc(
      `By default SNW will updates its internal cache every half a second (500 milliseconds) when there is some change in the vault.
					  Increase the time to slighlty improve performance on less performant devices or decrease it to improve refresh of vault information.
					  Currently set to: ${this.thePlugin.settings.cacheUpdateInMilliseconds} milliseconds. (Requires Obsidian Restart)`
    ).addSlider(
      (slider) => slider.setLimits(500, 3e4, 100).setValue(this.thePlugin.settings.cacheUpdateInMilliseconds).onChange(async (value) => {
        this.thePlugin.settings.cacheUpdateInMilliseconds = value;
        await this.thePlugin.saveSettings();
      }).setDynamicTooltip()
    );
  }
};

// src/snwApi.ts
var SnwAPI = class {
  constructor(plugin) {
    this.enableDebugging = {
      CM6Extension: false,
      PreviewRendering: false,
      LinkCountInHeader: false,
      GutterEmbedCounter: false,
      HtmlDecorationElements: false,
      SidePane: false
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.console = (logDescription, ...outputs) => {
      console.log("SNW: " + logDescription, outputs);
    };
    /**
     * For active file return the meta information used by various components of SNW
     *
     * @return {*}  {Promise<any>} // Needs to be any since we might return just about anything
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.getMetaInfoByCurrentFile = async () => {
      var _a;
      return this.getMetaInfoByFileName(((_a = app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "");
    };
    /**
     * For given file name passed into the function, get the meta info for that file
     *
     * @param {string} fileName (or file name path)
     * @memberof SnwAPI
     */
    this.getMetaInfoByFileName = async (fileName) => {
      const currentFile = app.metadataCache.getFirstLinkpathDest(fileName, "/");
      return {
        TFile: currentFile,
        metadataCache: currentFile ? app.metadataCache.getFileCache(currentFile) : null,
        SnwTransformedCache: currentFile ? getSNWCacheByFile(currentFile) : null
      };
    };
    this.plugin = plugin;
  }
};

// src/pluginCommands.ts
var import_obsidian13 = require("obsidian");
var PluginCommands = class {
  constructor(plugin) {
    this.snwCommands = [
      {
        id: "SNW-ToggleActiveState",
        icon: "dot-network",
        name: "Toggle active state of SNW plugin on/off",
        showInRibbon: true,
        callback: async () => {
          this.thePlugin.showCountsActive = !this.thePlugin.showCountsActive;
          let msg = "SNW toggled " + (this.thePlugin.showCountsActive ? "ON\n\n" : "OFF\n\n");
          msg += "Tabs may require reloading for this change to take effect.";
          new import_obsidian13.Notice(msg);
          this.thePlugin.toggleStateHeaderCount();
          this.thePlugin.toggleStateSNWMarkdownPreview();
          this.thePlugin.toggleStateSNWLivePreview();
          this.thePlugin.toggleStateSNWGutters();
        }
      }
    ];
    this.thePlugin = plugin;
    this.snwCommands.forEach(async (item) => {
      this.thePlugin.addCommand({
        id: item.id,
        name: item.name,
        icon: item.icon,
        callback: async () => {
          await item.callback();
        }
      });
    });
  }
};

// src/main.ts
var SNWPlugin = class extends import_obsidian14.Plugin {
  constructor() {
    super(...arguments);
    this.appName = this.manifest.name;
    this.appID = this.manifest.id;
    this.markdownPostProcessor = null;
    this.editorExtensions = [];
  }
  async onload() {
    console.log("loading " + this.appName);
    setPluginVariableForIndexer(this);
    setPluginVariableUIC_RefArea(this);
    setPluginVariableForHtmlDecorations(this);
    setPluginVariableForCM6Gutter(this);
    setPluginVariableForHeaderRefCount(this);
    setPluginVariableForMarkdownPreviewProcessor(this);
    setPluginVariableForCM6InlineReferences(this);
    setPluginVariableForUIC(this);
    this.snwAPI = new SnwAPI(this);
    globalThis.snwAPI = this.snwAPI;
    await this.loadSettings();
    this.addSettingTab(new SettingsTab(this.app, this));
    if (import_obsidian14.Platform.isMobile || import_obsidian14.Platform.isMobileApp)
      this.showCountsActive = this.settings.enableOnStartupMobile;
    else
      this.showCountsActive = this.settings.enableOnStartupDesktop;
    this.commands = new PluginCommands(this);
    this.registerView(VIEW_TYPE_SNW, (leaf) => new SideBarPaneView(leaf, this));
    const indexDebounce = (0, import_obsidian14.debounce)(
      () => {
        buildLinksAndReferences();
      },
      1e3,
      true
    );
    this.registerEvent(this.app.metadataCache.on("resolve", indexDebounce));
    this.registerEvent(this.app.workspace.on("editor-change", indexDebounce));
    this.app.workspace.registerHoverLinkSource(this.appID, {
      display: this.appName,
      defaultMod: true
    });
    this.snwAPI.settings = this.settings;
    this.registerEditorExtension(this.editorExtensions);
    this.toggleStateHeaderCount();
    this.toggleStateSNWMarkdownPreview();
    this.toggleStateSNWLivePreview();
    this.toggleStateSNWGutters();
    this.app.workspace.onLayoutReady(async () => {
      var _a;
      if (!((_a = this.app.workspace.getLeavesOfType(VIEW_TYPE_SNW)) == null ? void 0 : _a.length)) {
        await this.app.workspace.getRightLeaf(false).setViewState({ type: VIEW_TYPE_SNW, active: false });
      }
      const resolved = this.app.metadataCache.on("resolved", async () => {
        buildLinksAndReferences();
        this.app.metadataCache.offref(resolved);
      });
    });
  }
  async layoutChangeEvent() {
    setHeaderWithReferenceCounts();
  }
  /**
   * Displays the sidebar SNW pane
   *
   * @param {string} refType
   * @param {string} key
   * @param {string} filePath
   * @param {number} lineNu
   * @memberof ThePlugin
   */
  async activateView(refType, realLink, key, filePath, lineNu) {
    this.lastSelectedReferenceType = refType;
    this.lastSelectedReferenceRealLink = realLink;
    this.lastSelectedReferenceKey = key;
    this.lastSelectedReferenceFilePath = filePath;
    this.lastSelectedLineNumber = lineNu;
    await this.app.workspace.getLeavesOfType(VIEW_TYPE_SNW)[0].view.updateView();
    this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE_SNW)[0]);
  }
  /**
   * Turns on and off the reference count displayed at the top of the document in the header area
   *
   * @memberof ThePlugin
   */
  toggleStateHeaderCount() {
    if (this.settings.displayIncomingFilesheader && this.showCountsActive)
      this.app.workspace.on("layout-change", this.layoutChangeEvent);
    else
      this.app.workspace.off("layout-change", this.layoutChangeEvent);
  }
  /**
   * Turns on and off the SNW reference counters in Reading mode
   *
   * @memberof ThePlugin
   */
  toggleStateSNWMarkdownPreview() {
    if (this.settings.displayInlineReferencesMarkdown && this.showCountsActive && this.markdownPostProcessor === null) {
      this.markdownPostProcessor = this.registerMarkdownPostProcessor(
        (el, ctx2) => markdownPreviewProcessor(el, ctx2)
      );
    } else {
      if (!this.markdownPostProcessor) {
        console.log("Markdown post processor is not registered");
      } else {
        import_obsidian14.MarkdownPreviewRenderer.unregisterPostProcessor(this.markdownPostProcessor);
      }
      this.markdownPostProcessor = null;
    }
  }
  /**
   * Turns on and off the SNW reference counters in CM editor
   *
   * @memberof ThePlugin
   */
  toggleStateSNWLivePreview() {
    let state = this.settings.displayInlineReferencesLivePreview;
    if (state === true)
      state = this.showCountsActive;
    this.updateCMExtensionState("inline-ref", state, InlineReferenceExtension);
  }
  /**
   * Turns on and off the SNW reference counters in CM editor gutter
   *
   * @memberof ThePlugin
   */
  toggleStateSNWGutters() {
    let state = import_obsidian14.Platform.isMobile || import_obsidian14.Platform.isMobileApp ? this.settings.displayEmbedReferencesInGutterMobile : this.settings.displayEmbedReferencesInGutter;
    if (state === true)
      state = this.showCountsActive;
    this.updateCMExtensionState("gutter", state, gutters_cm6_default);
  }
  /**
   * Manages which CM extensions are loaded into Obsidian
   *
   * @param {string} extensionIdentifier
   * @param {boolean} extensionState
   * @param {Extension} extension
   * @memberof ThePlugin
   */
  updateCMExtensionState(extensionIdentifier, extensionState, extension) {
    if (extensionState == true) {
      this.editorExtensions.push(extension);
      this.editorExtensions[this.editorExtensions.length - 1].snwID = extensionIdentifier;
    } else {
      for (let i = 0; i < this.editorExtensions.length; i++) {
        const ext = this.editorExtensions[i];
        if (ext.snwID === extensionIdentifier) {
          this.editorExtensions.splice(i, 1);
          break;
        }
      }
    }
    this.app.workspace.updateOptions();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  onunload() {
    console.log("unloading " + this.appName);
    try {
      if (!this.markdownPostProcessor) {
        console.log("Markdown post processor is not registered");
      } else {
        import_obsidian14.MarkdownPreviewRenderer.unregisterPostProcessor(this.markdownPostProcessor);
      }
      this.app.workspace.unregisterHoverLinkSource(this.appID);
    } catch (error) {
    }
  }
};

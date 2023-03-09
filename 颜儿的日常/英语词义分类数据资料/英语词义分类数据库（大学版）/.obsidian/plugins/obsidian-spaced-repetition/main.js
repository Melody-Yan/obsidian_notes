'use strict';

var obsidian = require('obsidian');

function forOwn(object, callback) {
    if ((typeof object === 'object') && (typeof callback === 'function')) {
        for (var key in object) {
            if (object.hasOwnProperty(key) === true) {
                if (callback(key, object[key]) === false) {
                    break;
                }
            }
        }
    }
}

var lib = (function () {
    var self = {
        count: 0,
        edges: {},
        nodes: {}
    };

    self.link = function (source, target, weight) {
        if ((isFinite(weight) !== true) || (weight === null)) {
            weight = 1;
        }
        
        weight = parseFloat(weight);

        if (self.nodes.hasOwnProperty(source) !== true) {
            self.count++;
            self.nodes[source] = {
                weight: 0,
                outbound: 0
            };
        }

        self.nodes[source].outbound += weight;

        if (self.nodes.hasOwnProperty(target) !== true) {
            self.count++;
            self.nodes[target] = {
                weight: 0,
                outbound: 0
            };
        }

        if (self.edges.hasOwnProperty(source) !== true) {
            self.edges[source] = {};
        }

        if (self.edges[source].hasOwnProperty(target) !== true) {
            self.edges[source][target] = 0;
        }

        self.edges[source][target] += weight;
    };

    self.rank = function (alpha, epsilon, callback) {
        var delta = 1,
            inverse = 1 / self.count;

        forOwn(self.edges, function (source) {
            if (self.nodes[source].outbound > 0) {
                forOwn(self.edges[source], function (target) {
                    self.edges[source][target] /= self.nodes[source].outbound;
                });
            }
        });

        forOwn(self.nodes, function (key) {
            self.nodes[key].weight = inverse;
        });

        while (delta > epsilon) {
            var leak = 0,
                nodes = {};

            forOwn(self.nodes, function (key, value) {
                nodes[key] = value.weight;

                if (value.outbound === 0) {
                    leak += value.weight;
                }

                self.nodes[key].weight = 0;
            });

            leak *= alpha;

            forOwn(self.nodes, function (source) {
                forOwn(self.edges[source], function (target, weight) {
                    self.nodes[target].weight += alpha * nodes[source] * weight;
                });

                self.nodes[source].weight += (1 - alpha) * inverse + leak * inverse;
            });

            delta = 0;

            forOwn(self.nodes, function (key, value) {
                delta += Math.abs(value.weight - nodes[key]);
            });
        }

        forOwn(self.nodes, function (key) {
            return callback(key, self.nodes[key].weight);
        });
    };

    self.reset = function () {
        self.count = 0;
        self.edges = {};
        self.nodes = {};
    };

    return self;
})();

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(LogLevel || (LogLevel = {}));
const createLogger = (console, logLevel) => {
    let info, warn;
    if (logLevel === LogLevel.Info)
        info = Function.prototype.bind.call(console.info, console, "SR:");
    else
        info = (..._) => { };
    if (logLevel <= LogLevel.Warn)
        warn = Function.prototype.bind.call(console.warn, console, "SR:");
    else
        warn = (..._) => { };
    let error = Function.prototype.bind.call(console.error, console, "SR:");
    return { info, warn, error };
};

// العربية
var ar = {};

// čeština
var cz = {};

// Dansk
var da = {};

// Deutsch
var de = {};

// English
var en = {
    // flashcard-modal.ts
    Decks: "Decks",
    "Open file": "Open file",
    "Due cards": "Due cards",
    "New cards": "New cards",
    "Total cards": "Total cards",
    "Reset card's progress": "Reset card's progress",
    Hard: "Hard",
    Good: "Good",
    Easy: "Easy",
    "Show Answer": "Show Answer",
    "Card's progress has been reset.": "Card's progress has been reset.",
    // main.ts
    "Open a note for review": "Open a note for review",
    "Review flashcards": "Review flashcards",
    "Review: Easy": "Review: Easy",
    "Review: Good": "Review: Good",
    "Review: Hard": "Review: Hard",
    "Review note as easy": "Review note as easy",
    "Review note as good": "Review note as good",
    "Review note as hard": "Review note as hard",
    "View statistics": "View statistics",
    note: "note",
    notes: "notes",
    card: "card",
    cards: "cards",
    "Please tag the note appropriately for reviewing (in settings).": "Please tag the note appropriately for reviewing (in settings).",
    "You're all caught up now :D.": "You're all caught up now :D.",
    "Response received.": "Response received.",
    // scheduling.ts
    day: "day",
    days: "days",
    month: "month",
    months: "months",
    year: "year",
    years: "years",
    // settings.ts
    Notes: "Notes",
    Flashcards: "Flashcards",
    "Spaced Repetition Plugin - Settings": "Spaced Repetition Plugin - Settings",
    "For more information, check the": "For more information, check the",
    wiki: "wiki",
    "algorithm implementation": "algorithm implementation",
    "Flashcard tags": "Flashcard tags",
    "Enter tags separated by spaces or newlines i.e. #flashcards #deck2 #deck3.": "Enter tags separated by spaces or newlines i.e. #flashcards #deck2 #deck3.",
    "Convert folders to decks and subdecks?": "Convert folders to decks and subdecks?",
    "This is an alternative to the Flashcard tags option above.": "This is an alternative to the Flashcard tags option above.",
    "Save scheduling comment on the same line as the flashcard's last line?": "Save scheduling comment on the same line as the flashcard's last line?",
    "Turning this on will make the HTML comments not break list formatting.": "Turning this on will make the HTML comments not break list formatting.",
    "Bury sibling cards until the next day?": "Bury sibling cards until the next day?",
    "Siblings are cards generated from the same card text i.e. cloze deletions": "Siblings are cards generated from the same card text i.e. cloze deletions",
    "Show context in cards?": "Show context in cards?",
    "i.e. Title > Heading 1 > Subheading > ... > Subheading": "i.e. Title > Heading 1 > Subheading > ... > Subheading",
    "Flashcard Height Percentage": "Flashcard Height Percentage",
    "[Desktop] Should be set to 100% if you have very large images": "[Desktop] Should be set to 100% if you have very large images",
    "Reset to default": "Reset to default",
    "Flashcard Width Percentage": "Flashcard Width Percentage",
    "Show file name instead of 'Open file' in flashcard review?": "Show file name instead of 'Open file' in flashcard review?",
    "Randomize card order during review?": "Randomize card order during review?",
    "Disable cloze cards?": "Disable cloze cards?",
    "If you're not currently using 'em & would like the plugin to run a tad faster.": "If you're not currently using 'em & would like the plugin to run a tad faster.",
    "Separator for inline flashcards": "Separator for inline flashcards",
    "Separator for inline reversed flashcards": "Separator for inline reversed flashcards",
    "Separator for multiline reversed flashcards": "Separator for multiline reversed flashcards",
    "Note that after changing this you have to manually edit any flashcards you already have.": "Note that after changing this you have to manually edit any flashcards you already have.",
    "Separator for multiline flashcards": "Separator for multiline flashcards",
    "Tags to review": "Tags to review",
    "Enter tags separated by spaces or newlines i.e. #review #tag2 #tag3.": "Enter tags separated by spaces or newlines i.e. #review #tag2 #tag3.",
    "Open a random note for review": "Open a random note for review",
    "When you turn this off, notes are ordered by importance (PageRank).": "When you turn this off, notes are ordered by importance (PageRank).",
    "Open next note automatically after a review": "Open next note automatically after a review",
    "For faster reviews.": "For faster reviews.",
    "Disable review options in the file menu i.e. Review: Easy Good Hard": "Disable review options in the file menu i.e. Review: Easy Good Hard",
    "After disabling, you can review using the command hotkeys. Reload Obsidian after changing this.": "After disabling, you can review using the command hotkeys. Reload Obsidian after changing this.",
    "Maximum number of days to display on right panel": "Maximum number of days to display on right panel",
    "Reduce this for a cleaner interface.": "Reduce this for a cleaner interface.",
    "The number of days must be at least 1.": "The number of days must be at least 1.",
    "Please provide a valid number.": "Please provide a valid number.",
    Algorithm: "Algorithm",
    "Base ease": "Base ease",
    "minimum = 130, preferrably approximately 250.": "minimum = 130, preferrably approximately 250.",
    "The base ease must be at least 130.": "The base ease must be at least 130.",
    "Interval change when you review a flashcard/note as hard": "Interval change when you review a flashcard/note as hard",
    "newInterval = oldInterval * intervalChange / 100.": "newInterval = oldInterval * intervalChange / 100.",
    "Easy bonus": "Easy bonus",
    "The easy bonus allows you to set the difference in intervals between answering Good and Easy on a flashcard/note (minimum = 100%).": "The easy bonus allows you to set the difference in intervals between answering Good and Easy on a flashcard/note (minimum = 100%).",
    "The easy bonus must be at least 100.": "The easy bonus must be at least 100.",
    "Maximum Interval": "Maximum Interval",
    "Allows you to place an upper limit on the interval (default = 100 years).": "Allows you to place an upper limit on the interval (default = 100 years).",
    "The maximum interval must be at least 1 day.": "The maximum interval must be at least 1 day.",
    "Maximum link contribution": "Maximum link contribution",
    "Maximum contribution of the weighted ease of linked notes to the initial ease.": "Maximum contribution of the weighted ease of linked notes to the initial ease.",
    // sidebar.ts
    New: "New",
    Yesterday: "Yesterday",
    Today: "Today",
    Tomorrow: "Tomorrow",
    "Notes Review Queue": "Notes Review Queue",
    Close: "Close",
    // stats-modal.ts
    Statistics: "Statistics",
    "Note that this requires the Obsidian Charts plugin to work": "Note that this requires the Obsidian Charts plugin to work",
    Forecast: "Forecast",
    "The number of cards due in the future": "The number of cards due in the future",
    "Number of cards": "Number of cards",
    Scheduled: "Scheduled",
    Review: "Review",
    due: "due",
    Days: "Days",
};

// British English
var enGB = {};

// Español
var es = {};

// français
var fr = {};

// हिन्दी
var hi = {};

// Bahasa Indonesia
var id = {};

// Italiano
var it = {};

// 日本語
var ja = {};

// 한국어
var ko = {};

// Nederlands
var nl = {};

// Norsk
var no = {};

// język polski
var pl = {};

// Português
var pt = {};

// Português do Brasil
// Brazilian Portuguese
var ptBR = {};

// Română
var ro = {};

// русский
var ru = {};

// Türkçe
var tr = {};

// 简体中文
var zhCN = {};

// 繁體中文
var zhTW = {};

// https://github.com/mgmeyers/obsidian-kanban/blob/93014c2512507fde9eafd241e8d4368a8dfdf853/src/lang/helpers.ts
const localeMap = {
    ar,
    cs: cz,
    da,
    de,
    en,
    "en-gb": enGB,
    es,
    fr,
    hi,
    id,
    it,
    ja,
    ko,
    nl,
    nn: no,
    pl,
    pt,
    "pt-br": ptBR,
    ro,
    ru,
    tr,
    "zh-cn": zhCN,
    "zh-tw": zhTW,
};
const locale = localeMap[obsidian.moment.locale()];
function t(str) {
    if (!locale) {
        console.error("Error: SRS locale not found", obsidian.moment.locale());
    }
    return (locale && locale[str]) || en[str];
}

const DEFAULT_SETTINGS = {
    // flashcards
    flashcardTags: ["#flashcards"],
    convertFoldersToDecks: false,
    cardCommentOnSameLine: false,
    burySiblingCards: false,
    showContextInCards: true,
    flashcardHeightPercentage: obsidian.Platform.isDesktop ? 80 : 100,
    flashcardWidthPercentage: obsidian.Platform.isDesktop ? 40 : 100,
    showFileNameInFileLink: false,
    randomizeCardOrder: true,
    disableClozeCards: false,
    singlelineCardSeparator: "::",
    singlelineReversedCardSeparator: ":::",
    multilineCardSeparator: "?",
    multilineReversedCardSeparator: "??",
    // notes
    tagsToReview: ["#review"],
    openRandomNote: false,
    autoNextNote: false,
    disableFileMenuReviewOptions: false,
    maxNDaysNotesReviewQueue: 365,
    // algorithm
    baseEase: 250,
    lapsesIntervalChange: 0.5,
    easyBonus: 1.3,
    maximumInterval: 36525,
    maxLinkFactor: 1.0,
    // logging
    logLevel: LogLevel.Warn,
};
// https://github.com/mgmeyers/obsidian-kanban/blob/main/src/Settings.ts
let applyDebounceTimer = 0;
function applySettingsUpdate(callback) {
    clearTimeout(applyDebounceTimer);
    applyDebounceTimer = window.setTimeout(callback, 512);
}
class SRSettingTab extends obsidian.PluginSettingTab {
    plugin;
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createDiv().innerHTML =
            "<h2>" + t("Spaced Repetition Plugin - Settings") + "</h2>";
        containerEl.createDiv().innerHTML =
            t("For more information, check the") +
                ' <a href="https://github.com/st3v3nmw/obsidian-spaced-repetition/wiki">' +
                t("wiki") +
                "</a>.";
        containerEl.createDiv().innerHTML = "<h3>" + t("Flashcards") + "</h3>";
        new obsidian.Setting(containerEl)
            .setName(t("Flashcard tags"))
            .setDesc(t("Enter tags separated by spaces or newlines i.e. #flashcards #deck2 #deck3."))
            .addTextArea((text) => text
            .setValue(this.plugin.data.settings.flashcardTags.join(" "))
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.flashcardTags =
                    value.split(/\s+/);
                await this.plugin.savePluginData();
            });
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Convert folders to decks and subdecks?"))
            .setDesc(t("This is an alternative to the Flashcard tags option above."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.convertFoldersToDecks)
            .onChange(async (value) => {
            this.plugin.data.settings.convertFoldersToDecks = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Save scheduling comment on the same line as the flashcard's last line?"))
            .setDesc(t("Turning this on will make the HTML comments not break list formatting."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.cardCommentOnSameLine)
            .onChange(async (value) => {
            this.plugin.data.settings.cardCommentOnSameLine = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Bury sibling cards until the next day?"))
            .setDesc(t("Siblings are cards generated from the same card text i.e. cloze deletions"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.burySiblingCards)
            .onChange(async (value) => {
            this.plugin.data.settings.burySiblingCards = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Show context in cards?"))
            .setDesc(t("i.e. Title > Heading 1 > Subheading > ... > Subheading"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.showContextInCards)
            .onChange(async (value) => {
            this.plugin.data.settings.showContextInCards = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Flashcard Height Percentage"))
            .setDesc(t("[Desktop] Should be set to 100% if you have very large images"))
            .addSlider((slider) => slider
            .setLimits(10, 100, 5)
            .setValue(this.plugin.data.settings.flashcardHeightPercentage)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.flashcardHeightPercentage =
                value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.flashcardHeightPercentage =
                    DEFAULT_SETTINGS.flashcardHeightPercentage;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Flashcard Width Percentage"))
            .setDesc(t("[Desktop] Should be set to 100% if you have very large images"))
            .addSlider((slider) => slider
            .setLimits(10, 100, 5)
            .setValue(this.plugin.data.settings.flashcardWidthPercentage)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.flashcardWidthPercentage =
                value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.flashcardWidthPercentage =
                    DEFAULT_SETTINGS.flashcardWidthPercentage;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Show file name instead of 'Open file' in flashcard review?"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.showFileNameInFileLink)
            .onChange(async (value) => {
            this.plugin.data.settings.showFileNameInFileLink =
                value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Randomize card order during review?"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.randomizeCardOrder)
            .onChange(async (value) => {
            this.plugin.data.settings.randomizeCardOrder = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Disable cloze cards?"))
            .setDesc(t("If you're not currently using 'em & would like the plugin to run a tad faster."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.disableClozeCards)
            .onChange(async (value) => {
            this.plugin.data.settings.disableClozeCards = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Separator for inline flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.singlelineCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.singlelineCardSeparator =
                    value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.singlelineCardSeparator =
                    DEFAULT_SETTINGS.singlelineCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Separator for inline reversed flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings
            .singlelineReversedCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.singlelineReversedCardSeparator =
                    value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.singlelineReversedCardSeparator =
                    DEFAULT_SETTINGS.singlelineReversedCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Separator for multiline flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.multilineCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.multilineCardSeparator =
                    value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.multilineCardSeparator =
                    DEFAULT_SETTINGS.multilineCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Separator for multiline reversed flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.multilineReversedCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.multilineReversedCardSeparator =
                    value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.multilineReversedCardSeparator =
                    DEFAULT_SETTINGS.multilineReversedCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        containerEl.createDiv().innerHTML = "<h3>" + t("Notes") + "</h3>";
        new obsidian.Setting(containerEl)
            .setName(t("Tags to review"))
            .setDesc(t("Enter tags separated by spaces or newlines i.e. #review #tag2 #tag3."))
            .addTextArea((text) => text
            .setValue(this.plugin.data.settings.tagsToReview.join(" "))
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.tagsToReview =
                    value.split(/\s+/);
                await this.plugin.savePluginData();
            });
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Open a random note for review"))
            .setDesc(t("When you turn this off, notes are ordered by importance (PageRank)."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.openRandomNote)
            .onChange(async (value) => {
            this.plugin.data.settings.openRandomNote = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Open next note automatically after a review"))
            .setDesc(t("For faster reviews."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.autoNextNote)
            .onChange(async (value) => {
            this.plugin.data.settings.autoNextNote = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Disable review options in the file menu i.e. Review: Easy Good Hard"))
            .setDesc(t("After disabling, you can review using the command hotkeys. Reload Obsidian after changing this."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.disableFileMenuReviewOptions)
            .onChange(async (value) => {
            this.plugin.data.settings.disableFileMenuReviewOptions =
                value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Maximum number of days to display on right panel"))
            .setDesc(t("Reduce this for a cleaner interface."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.maxNDaysNotesReviewQueue.toString())
            .onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value);
                if (!isNaN(numValue)) {
                    if (numValue < 1) {
                        new obsidian.Notice(t("The number of days must be at least 1."));
                        text.setValue(this.plugin.data.settings.maxNDaysNotesReviewQueue.toString());
                        return;
                    }
                    this.plugin.data.settings.maxNDaysNotesReviewQueue =
                        numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.maxNDaysNotesReviewQueue =
                    DEFAULT_SETTINGS.maxNDaysNotesReviewQueue;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        containerEl.createDiv().innerHTML = "<h3>" + t("Algorithm") + "</h3>";
        containerEl.createDiv().innerHTML =
            t("For more information, check the") +
                ' <a href="https://github.com/st3v3nmw/obsidian-spaced-repetition/wiki/Spaced-Repetition-Algorithm">' +
                t("algorithm implementation") +
                "</a>.";
        new obsidian.Setting(containerEl)
            .setName(t("Base ease"))
            .setDesc(t("minimum = 130, preferrably approximately 250."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.baseEase.toString())
            .onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value);
                if (!isNaN(numValue)) {
                    if (numValue < 130) {
                        new obsidian.Notice(t("The base ease must be at least 130."));
                        text.setValue(this.plugin.data.settings.baseEase.toString());
                        return;
                    }
                    this.plugin.data.settings.baseEase = numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.baseEase =
                    DEFAULT_SETTINGS.baseEase;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Interval change when you review a flashcard/note as hard"))
            .setDesc(t("newInterval = oldInterval * intervalChange / 100."))
            .addSlider((slider) => slider
            .setLimits(1, 99, 1)
            .setValue(this.plugin.data.settings.lapsesIntervalChange * 100)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.lapsesIntervalChange = value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.lapsesIntervalChange =
                    DEFAULT_SETTINGS.lapsesIntervalChange;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Easy bonus"))
            .setDesc(t("The easy bonus allows you to set the difference in intervals between answering Good and Easy on a flashcard/note (minimum = 100%)."))
            .addText((text) => text
            .setValue((this.plugin.data.settings.easyBonus * 100).toString())
            .onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value) / 100;
                if (!isNaN(numValue)) {
                    if (numValue < 1.0) {
                        new obsidian.Notice(t("The easy bonus must be at least 100."));
                        text.setValue((this.plugin.data.settings
                            .easyBonus * 100).toString());
                        return;
                    }
                    this.plugin.data.settings.easyBonus = numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.easyBonus =
                    DEFAULT_SETTINGS.easyBonus;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Maximum Interval"))
            .setDesc(t("Allows you to place an upper limit on the interval (default = 100 years)."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.maximumInterval.toString())
            .onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value);
                if (!isNaN(numValue)) {
                    if (numValue < 1) {
                        new obsidian.Notice(t("The maximum interval must be at least 1 day."));
                        text.setValue(this.plugin.data.settings.maximumInterval.toString());
                        return;
                    }
                    this.plugin.data.settings.maximumInterval =
                        numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.maximumInterval =
                    DEFAULT_SETTINGS.maximumInterval;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Maximum link contribution"))
            .setDesc(t("Maximum contribution of the weighted ease of linked notes to the initial ease."))
            .addSlider((slider) => slider
            .setLimits(0, 100, 1)
            .setValue(this.plugin.data.settings.maxLinkFactor * 100)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.maxLinkFactor = value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.maxLinkFactor =
                    DEFAULT_SETTINGS.maxLinkFactor;
                await this.plugin.savePluginData();
                this.display();
            });
        });
    }
}

var ReviewResponse;
(function (ReviewResponse) {
    ReviewResponse[ReviewResponse["Easy"] = 0] = "Easy";
    ReviewResponse[ReviewResponse["Good"] = 1] = "Good";
    ReviewResponse[ReviewResponse["Hard"] = 2] = "Hard";
    ReviewResponse[ReviewResponse["Reset"] = 3] = "Reset";
})(ReviewResponse || (ReviewResponse = {}));
function schedule(response, interval, ease, delayBeforeReview, settingsObj, dueDates) {
    delayBeforeReview = Math.max(0, Math.floor(delayBeforeReview / (24 * 3600 * 1000)));
    if (response === ReviewResponse.Easy) {
        ease += 20;
        interval = ((interval + delayBeforeReview) * ease) / 100;
        interval *= settingsObj.easyBonus;
    }
    else if (response === ReviewResponse.Good)
        interval = ((interval + delayBeforeReview / 2) * ease) / 100;
    else if (response === ReviewResponse.Hard) {
        ease = Math.max(130, ease - 20);
        interval = Math.max(1, (interval + delayBeforeReview / 4) *
            settingsObj.lapsesIntervalChange);
    }
    // replaces random fuzz with load balancing over the fuzz interval
    if (dueDates !== undefined) {
        interval = Math.round(interval);
        if (!dueDates.hasOwnProperty(interval))
            dueDates[interval] = 0;
        let fuzzRange;
        // disable fuzzing for small intervals
        if (interval <= 4)
            fuzzRange = [interval, interval];
        else {
            let fuzz;
            if (interval < 7)
                fuzz = 1;
            else if (interval < 30)
                fuzz = Math.max(2, Math.floor(interval * 0.15));
            else
                fuzz = Math.max(4, Math.floor(interval * 0.05));
            fuzzRange = [interval - fuzz, interval + fuzz];
        }
        for (let ivl = fuzzRange[0]; ivl <= fuzzRange[1]; ivl++) {
            if (!dueDates.hasOwnProperty(ivl))
                dueDates[ivl] = 0;
            if (dueDates[ivl] < dueDates[interval])
                interval = ivl;
        }
        dueDates[interval]++;
    }
    interval = Math.min(interval, settingsObj.maximumInterval);
    return { interval: Math.round(interval * 10) / 10, ease };
}
function textInterval(interval, isMobile) {
    let m = Math.round(interval / 3) / 10, y = Math.round(interval / 36.5) / 10;
    if (isMobile) {
        if (interval < 30)
            return `${interval}d`;
        else if (interval < 365)
            return `${m}m`;
        else
            return `${y}y`;
    }
    else {
        if (interval < 30)
            return interval === 1.0
                ? "1.0 " + t("day")
                : interval.toString() + " " + t("days");
        else if (interval < 365)
            return m === 1.0
                ? "1.0 " + t("month")
                : m.toString() + " " + t("months");
        else
            return y === 1.0
                ? "1.0 " + t("year")
                : y.toString() + " " + t("years");
    }
}

// https://github.com/obsidianmd/obsidian-api/issues/13
// flashcards
var CardType;
(function (CardType) {
    CardType[CardType["SingleLineBasic"] = 0] = "SingleLineBasic";
    CardType[CardType["SingleLineReversed"] = 1] = "SingleLineReversed";
    CardType[CardType["MultiLineBasic"] = 2] = "MultiLineBasic";
    CardType[CardType["MultiLineReversed"] = 3] = "MultiLineReversed";
    CardType[CardType["Cloze"] = 4] = "Cloze";
})(CardType || (CardType = {}));

const SCHEDULING_INFO_REGEX = /^---\n((?:.*\n)*)sr-due: (.+)\nsr-interval: (\d+)\nsr-ease: (\d+)\n((?:.*\n)*)---/;
const YAML_FRONT_MATTER_REGEX = /^---\n((?:.*\n)*?)---/;
const MULTI_SCHEDULING_EXTRACTOR = /!([\d-]+),(\d+),(\d+)/gm;
const LEGACY_SCHEDULING_EXTRACTOR = /<!--SR:([\d-]+),(\d+),(\d+)-->/gm;
const CROSS_HAIRS_ICON = `<path style=" stroke:none;fill-rule:nonzero;fill:currentColor;fill-opacity:1;" d="M 99.921875 47.941406 L 93.074219 47.941406 C 92.84375 42.03125 91.390625 36.238281 88.800781 30.921875 L 85.367188 32.582031 C 87.667969 37.355469 88.964844 42.550781 89.183594 47.84375 L 82.238281 47.84375 C 82.097656 44.617188 81.589844 41.417969 80.734375 38.304688 L 77.050781 39.335938 C 77.808594 42.089844 78.261719 44.917969 78.40625 47.769531 L 65.871094 47.769531 C 64.914062 40.507812 59.144531 34.832031 51.871094 33.996094 L 51.871094 21.386719 C 54.816406 21.507812 57.742188 21.960938 60.585938 22.738281 L 61.617188 19.058594 C 58.4375 18.191406 55.164062 17.691406 51.871094 17.570312 L 51.871094 10.550781 C 57.164062 10.769531 62.355469 12.066406 67.132812 14.363281 L 68.789062 10.929688 C 63.5 8.382812 57.738281 6.953125 51.871094 6.734375 L 51.871094 0.0390625 L 48.054688 0.0390625 L 48.054688 6.734375 C 42.179688 6.976562 36.417969 8.433594 31.132812 11.007812 L 32.792969 14.441406 C 37.566406 12.140625 42.761719 10.84375 48.054688 10.625 L 48.054688 17.570312 C 44.828125 17.714844 41.628906 18.21875 38.515625 19.078125 L 39.546875 22.757812 C 42.324219 21.988281 45.175781 21.53125 48.054688 21.386719 L 48.054688 34.03125 C 40.796875 34.949219 35.089844 40.679688 34.203125 47.941406 L 21.5 47.941406 C 21.632812 45.042969 22.089844 42.171875 22.855469 39.375 L 19.171875 38.34375 C 18.3125 41.457031 17.808594 44.65625 17.664062 47.882812 L 10.664062 47.882812 C 10.882812 42.589844 12.179688 37.394531 14.480469 32.621094 L 11.121094 30.921875 C 8.535156 36.238281 7.078125 42.03125 6.847656 47.941406 L 0 47.941406 L 0 51.753906 L 6.847656 51.753906 C 7.089844 57.636719 8.542969 63.402344 11.121094 68.695312 L 14.554688 67.035156 C 12.257812 62.261719 10.957031 57.066406 10.738281 51.773438 L 17.742188 51.773438 C 17.855469 55.042969 18.34375 58.289062 19.191406 61.445312 L 22.871094 60.414062 C 22.089844 57.5625 21.628906 54.632812 21.5 51.679688 L 34.203125 51.679688 C 35.058594 58.96875 40.773438 64.738281 48.054688 65.660156 L 48.054688 78.308594 C 45.105469 78.1875 42.183594 77.730469 39.335938 76.957031 L 38.304688 80.636719 C 41.488281 81.511719 44.757812 82.015625 48.054688 82.144531 L 48.054688 89.144531 C 42.761719 88.925781 37.566406 87.628906 32.792969 85.328125 L 31.132812 88.765625 C 36.425781 91.3125 42.183594 92.742188 48.054688 92.960938 L 48.054688 99.960938 L 51.871094 99.960938 L 51.871094 92.960938 C 57.75 92.71875 63.519531 91.265625 68.808594 88.6875 L 67.132812 85.253906 C 62.355469 87.550781 57.164062 88.851562 51.871094 89.070312 L 51.871094 82.125 C 55.09375 81.980469 58.292969 81.476562 61.40625 80.617188 L 60.378906 76.9375 C 57.574219 77.703125 54.695312 78.15625 51.792969 78.289062 L 51.792969 65.679688 C 59.121094 64.828125 64.910156 59.0625 65.796875 51.734375 L 78.367188 51.734375 C 78.25 54.734375 77.789062 57.710938 76.992188 60.605469 L 80.675781 61.636719 C 81.558594 58.40625 82.066406 55.082031 82.183594 51.734375 L 89.261719 51.734375 C 89.042969 57.03125 87.742188 62.222656 85.445312 66.996094 L 88.878906 68.65625 C 91.457031 63.367188 92.910156 57.597656 93.152344 51.71875 L 100 51.71875 Z M 62.019531 51.734375 C 61.183594 56.945312 57.085938 61.023438 51.871094 61.828125 L 51.871094 57.515625 L 48.054688 57.515625 L 48.054688 61.808594 C 42.910156 60.949219 38.886719 56.902344 38.058594 51.753906 L 42.332031 51.753906 L 42.332031 47.941406 L 38.058594 47.941406 C 38.886719 42.789062 42.910156 38.746094 48.054688 37.886719 L 48.054688 42.179688 L 51.871094 42.179688 L 51.871094 37.847656 C 57.078125 38.648438 61.179688 42.71875 62.019531 47.921875 L 57.707031 47.921875 L 57.707031 51.734375 Z M 62.019531 51.734375 "/>`;
const COLLAPSE_ICON = `<svg viewBox="0 0 100 100" width="8" height="8" class="right-triangle"><path fill="currentColor" stroke="currentColor" d="M94.9,20.8c-1.4-2.5-4.1-4.1-7.1-4.1H12.2c-3,0-5.7,1.6-7.1,4.1c-1.3,2.4-1.2,5.2,0.2,7.6L43.1,88c1.5,2.3,4,3.7,6.9,3.7 s5.4-1.4,6.9-3.7l37.8-59.6C96.1,26,96.2,23.2,94.9,20.8L94.9,20.8z"></path></svg>`;

// https://stackoverflow.com/a/59459000
const getKeysPreserveType = Object.keys;
// https://stackoverflow.com/a/6969486
const escapeRegexString = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// https://stackoverflow.com/a/52171480
function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
            Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
            Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

var FlashcardModalMode;
(function (FlashcardModalMode) {
    FlashcardModalMode[FlashcardModalMode["DecksList"] = 0] = "DecksList";
    FlashcardModalMode[FlashcardModalMode["Front"] = 1] = "Front";
    FlashcardModalMode[FlashcardModalMode["Back"] = 2] = "Back";
    FlashcardModalMode[FlashcardModalMode["Closed"] = 3] = "Closed";
})(FlashcardModalMode || (FlashcardModalMode = {}));
class FlashcardModal extends obsidian.Modal {
    plugin;
    answerBtn;
    flashcardView;
    hardBtn;
    goodBtn;
    easyBtn;
    responseDiv;
    fileLinkView;
    resetLinkView;
    contextView;
    currentCard;
    currentCardIdx;
    currentDeck;
    checkDeck;
    mode;
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.titleEl.setText(t("Decks"));
        if (obsidian.Platform.isMobile)
            this.contentEl.style.display = "block";
        this.modalEl.style.height =
            this.plugin.data.settings.flashcardHeightPercentage + "%";
        this.modalEl.style.width =
            this.plugin.data.settings.flashcardWidthPercentage + "%";
        this.contentEl.style.position = "relative";
        this.contentEl.style.height = "92%";
        this.contentEl.addClass("sr-modal-content");
        document.body.onkeypress = (e) => {
            if (this.mode !== FlashcardModalMode.DecksList) {
                if (this.mode !== FlashcardModalMode.Closed &&
                    e.code === "KeyS") {
                    this.currentDeck.deleteFlashcardAtIndex(this.currentCardIdx, this.currentCard.isDue);
                    if (this.currentCard.cardType === CardType.Cloze)
                        this.burySiblingCards(false);
                    this.currentDeck.nextCard(this);
                }
                else if (this.mode === FlashcardModalMode.Front &&
                    (e.code === "Space" || e.code === "Enter"))
                    this.showAnswer();
                else if (this.mode === FlashcardModalMode.Back) {
                    if (e.code === "Numpad1" || e.code === "Digit1")
                        this.processReview(ReviewResponse.Hard);
                    else if (e.code === "Numpad2" ||
                        e.code === "Digit2" ||
                        e.code === "Space")
                        this.processReview(ReviewResponse.Good);
                    else if (e.code === "Numpad3" || e.code === "Digit3")
                        this.processReview(ReviewResponse.Easy);
                    else if (e.code === "Numpad0" || e.code === "Digit0")
                        this.processReview(ReviewResponse.Reset);
                }
            }
        };
    }
    onOpen() {
        this.decksList();
    }
    onClose() {
        this.mode = FlashcardModalMode.Closed;
    }
    decksList() {
        this.mode = FlashcardModalMode.DecksList;
        this.titleEl.setText(t("Decks"));
        this.titleEl.innerHTML +=
            '<p style="margin:0px;line-height:12px;">' +
                '<span style="background-color:#4caf50;color:#ffffff;" aria-label="' +
                t("Due cards") +
                '" class="tag-pane-tag-count tree-item-flair">' +
                this.plugin.deckTree.dueFlashcardsCount +
                "</span>" +
                '<span style="background-color:#2196f3;" aria-label="' +
                t("New cards") +
                '" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.plugin.deckTree.newFlashcardsCount +
                "</span>" +
                '<span style="background-color:#ff7043;" aria-label="' +
                t("Total cards") +
                '" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.plugin.deckTree.totalFlashcards +
                "</span>" +
                "</p>";
        this.contentEl.innerHTML = "";
        this.contentEl.setAttribute("id", "sr-flashcard-view");
        for (let deck of this.plugin.deckTree.subdecks)
            deck.render(this.contentEl, this);
    }
    setupCardsView() {
        this.contentEl.innerHTML = "";
        this.fileLinkView = this.contentEl.createDiv("sr-link");
        this.fileLinkView.setText(t("Open file"));
        if (this.plugin.data.settings.showFileNameInFileLink)
            this.fileLinkView.setAttribute("aria-label", t("Open file"));
        this.fileLinkView.addEventListener("click", async (_) => {
            this.close();
            await this.plugin.app.workspace.activeLeaf.openFile(this.currentCard.note);
            let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            activeView.editor.setCursor({
                line: this.currentCard.lineNo,
                ch: 0,
            });
        });
        this.resetLinkView = this.contentEl.createDiv("sr-link");
        this.resetLinkView.setText(t("Reset card's progress"));
        this.resetLinkView.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Reset);
        });
        this.resetLinkView.style.float = "right";
        if (this.plugin.data.settings.showContextInCards) {
            this.contextView = this.contentEl.createDiv();
            this.contextView.setAttribute("id", "sr-context");
        }
        this.flashcardView = this.contentEl.createDiv("div");
        this.flashcardView.setAttribute("id", "sr-flashcard-view");
        this.responseDiv = this.contentEl.createDiv("sr-response");
        this.hardBtn = document.createElement("button");
        this.hardBtn.setAttribute("id", "sr-hard-btn");
        this.hardBtn.setText(t("Hard"));
        this.hardBtn.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Hard);
        });
        this.responseDiv.appendChild(this.hardBtn);
        this.goodBtn = document.createElement("button");
        this.goodBtn.setAttribute("id", "sr-good-btn");
        this.goodBtn.setText(t("Good"));
        this.goodBtn.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Good);
        });
        this.responseDiv.appendChild(this.goodBtn);
        this.easyBtn = document.createElement("button");
        this.easyBtn.setAttribute("id", "sr-easy-btn");
        this.easyBtn.setText(t("Easy"));
        this.easyBtn.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Easy);
        });
        this.responseDiv.appendChild(this.easyBtn);
        this.responseDiv.style.display = "none";
        this.answerBtn = this.contentEl.createDiv();
        this.answerBtn.setAttribute("id", "sr-show-answer");
        this.answerBtn.setText(t("Show Answer"));
        this.answerBtn.addEventListener("click", (_) => {
            this.showAnswer();
        });
    }
    showAnswer() {
        this.mode = FlashcardModalMode.Back;
        this.answerBtn.style.display = "none";
        this.responseDiv.style.display = "grid";
        if (this.currentCard.isDue)
            this.resetLinkView.style.display = "inline-block";
        if (this.currentCard.cardType !== CardType.Cloze) {
            let hr = document.createElement("hr");
            hr.setAttribute("id", "sr-hr-card-divide");
            this.flashcardView.appendChild(hr);
        }
        else
            this.flashcardView.innerHTML = "";
        this.renderMarkdownWrapper(this.currentCard.back, this.flashcardView);
    }
    async processReview(response) {
        let interval, ease, due;
        this.currentDeck.deleteFlashcardAtIndex(this.currentCardIdx, this.currentCard.isDue);
        if (response !== ReviewResponse.Reset) {
            // scheduled card
            if (this.currentCard.isDue) {
                let schedObj = schedule(response, this.currentCard.interval, this.currentCard.ease, this.currentCard.delayBeforeReview, this.plugin.data.settings, this.plugin.dueDatesFlashcards);
                interval = schedObj.interval;
                ease = schedObj.ease;
            }
            else {
                let schedObj = schedule(response, 1, this.plugin.data.settings.baseEase, 0, this.plugin.data.settings, this.plugin.dueDatesFlashcards);
                interval = schedObj.interval;
                ease = schedObj.ease;
            }
            due = window.moment(Date.now() + interval * 24 * 3600 * 1000);
        }
        else {
            this.currentCard.interval = 1.0;
            this.currentCard.ease = this.plugin.data.settings.baseEase;
            if (this.currentCard.isDue)
                this.currentDeck.dueFlashcards.push(this.currentCard);
            else
                this.currentDeck.newFlashcards.push(this.currentCard);
            due = window.moment(Date.now());
            new obsidian.Notice(t("Card's progress has been reset."));
            this.currentDeck.nextCard(this);
            return;
        }
        let dueString = due.format("YYYY-MM-DD");
        let fileText = await this.app.vault.read(this.currentCard.note);
        let replacementRegex = new RegExp(escapeRegexString(this.currentCard.cardText), "gm");
        let sep = this.plugin.data.settings.cardCommentOnSameLine
            ? " "
            : "\n";
        // check if we're adding scheduling information to the flashcard
        // for the first time
        if (this.currentCard.cardText.lastIndexOf("<!--SR:") === -1) {
            this.currentCard.cardText =
                this.currentCard.cardText +
                    sep +
                    `<!--SR:!${dueString},${interval},${ease}-->`;
        }
        else {
            let scheduling = [
                ...this.currentCard.cardText.matchAll(MULTI_SCHEDULING_EXTRACTOR),
            ];
            if (scheduling.length === 0)
                scheduling = [
                    ...this.currentCard.cardText.matchAll(LEGACY_SCHEDULING_EXTRACTOR),
                ];
            let currCardSched = [
                "0",
                dueString,
                interval.toString(),
                ease.toString(),
            ];
            if (this.currentCard.isDue)
                scheduling[this.currentCard.siblingIdx] = currCardSched;
            else
                scheduling.push(currCardSched);
            this.currentCard.cardText = this.currentCard.cardText.replace(/<!--SR:.+-->/gm, "");
            this.currentCard.cardText += "<!--SR:";
            for (let i = 0; i < scheduling.length; i++)
                this.currentCard.cardText += `!${scheduling[i][1]},${scheduling[i][2]},${scheduling[i][3]}`;
            this.currentCard.cardText += "-->";
        }
        fileText = fileText.replace(replacementRegex, (_) => this.currentCard.cardText);
        for (let sibling of this.currentCard.siblings)
            sibling.cardText = this.currentCard.cardText;
        if (this.plugin.data.settings.burySiblingCards)
            this.burySiblingCards(true);
        await this.app.vault.modify(this.currentCard.note, fileText);
        this.currentDeck.nextCard(this);
    }
    async burySiblingCards(tillNextDay) {
        if (tillNextDay) {
            this.plugin.data.buryList.push(cyrb53(this.currentCard.cardText));
            await this.plugin.savePluginData();
        }
        for (let sibling of this.currentCard.siblings) {
            let dueIdx = this.currentDeck.dueFlashcards.indexOf(sibling);
            let newIdx = this.currentDeck.newFlashcards.indexOf(sibling);
            if (dueIdx !== -1)
                this.currentDeck.deleteFlashcardAtIndex(dueIdx, this.currentDeck.dueFlashcards[dueIdx].isDue);
            else if (newIdx !== -1)
                this.currentDeck.deleteFlashcardAtIndex(newIdx, this.currentDeck.newFlashcards[newIdx].isDue);
        }
    }
    // slightly modified version of the renderMarkdown function in
    // https://github.com/mgmeyers/obsidian-kanban/blob/main/src/KanbanView.tsx
    async renderMarkdownWrapper(markdownString, containerEl) {
        obsidian.MarkdownRenderer.renderMarkdown(markdownString, containerEl, this.currentCard.note.path, this.plugin);
        containerEl.findAll(".internal-embed").forEach((el) => {
            let src = el.getAttribute("src");
            let target = typeof src === "string" &&
                this.plugin.app.metadataCache.getFirstLinkpathDest(src, this.currentCard.note.path);
            if (target instanceof obsidian.TFile && target.extension !== "md") {
                el.innerText = "";
                el.createEl("img", {
                    attr: {
                        src: this.plugin.app.vault.getResourcePath(target),
                    },
                }, (img) => {
                    if (el.hasAttribute("width"))
                        img.setAttribute("width", el.getAttribute("width"));
                    else
                        img.setAttribute("width", "100%");
                    if (el.hasAttribute("alt"))
                        img.setAttribute("alt", el.getAttribute("alt"));
                });
                el.addClasses(["image-embed", "is-loaded"]);
            }
            // file does not exist
            // display dead link
            if (target === null)
                el.innerText = src;
        });
    }
}
class Deck {
    deckName;
    newFlashcards;
    newFlashcardsCount = 0; // counts those in subdecks too
    dueFlashcards;
    dueFlashcardsCount = 0; // counts those in subdecks too
    totalFlashcards = 0; // counts those in subdecks too
    subdecks;
    parent;
    constructor(deckName, parent) {
        this.deckName = deckName;
        this.newFlashcards = [];
        this.newFlashcardsCount = 0;
        this.dueFlashcards = [];
        this.dueFlashcardsCount = 0;
        this.totalFlashcards = 0;
        this.subdecks = [];
        this.parent = parent;
    }
    createDeck(deckPath) {
        if (deckPath.length === 0)
            return;
        let deckName = deckPath.shift();
        for (let deck of this.subdecks) {
            if (deckName === deck.deckName) {
                deck.createDeck(deckPath);
                return;
            }
        }
        let deck = new Deck(deckName, this);
        this.subdecks.push(deck);
        deck.createDeck(deckPath);
    }
    insertFlashcard(deckPath, cardObj) {
        if (cardObj.isDue)
            this.dueFlashcardsCount++;
        else
            this.newFlashcardsCount++;
        this.totalFlashcards++;
        if (deckPath.length === 0) {
            if (cardObj.isDue)
                this.dueFlashcards.push(cardObj);
            else
                this.newFlashcards.push(cardObj);
            return;
        }
        let deckName = deckPath.shift();
        for (let deck of this.subdecks) {
            if (deckName === deck.deckName) {
                deck.insertFlashcard(deckPath, cardObj);
                return;
            }
        }
    }
    // count flashcards that have either been buried
    // or aren't due yet
    countFlashcard(deckPath, n = 1) {
        this.totalFlashcards += n;
        let deckName = deckPath.shift();
        for (let deck of this.subdecks) {
            if (deckName === deck.deckName) {
                deck.countFlashcard(deckPath, n);
                return;
            }
        }
    }
    deleteFlashcardAtIndex(index, cardIsDue) {
        if (cardIsDue)
            this.dueFlashcards.splice(index, 1);
        else
            this.newFlashcards.splice(index, 1);
        let deck = this;
        while (deck !== null) {
            if (cardIsDue)
                deck.dueFlashcardsCount--;
            else
                deck.newFlashcardsCount--;
            deck = deck.parent;
        }
    }
    sortSubdecksList() {
        this.subdecks.sort((a, b) => {
            if (a.deckName < b.deckName)
                return -1;
            else if (a.deckName > b.deckName)
                return 1;
            return 0;
        });
        for (let deck of this.subdecks)
            deck.sortSubdecksList();
    }
    render(containerEl, modal) {
        let deckView = containerEl.createDiv("tree-item");
        let deckViewSelf = deckView.createDiv("tree-item-self tag-pane-tag is-clickable");
        let collapsed = true;
        let collapseIconEl = null;
        if (this.subdecks.length > 0) {
            collapseIconEl = deckViewSelf.createDiv("tree-item-icon collapse-icon");
            collapseIconEl.innerHTML = COLLAPSE_ICON;
            collapseIconEl.childNodes[0].style.transform =
                "rotate(-90deg)";
        }
        let deckViewInner = deckViewSelf.createDiv("tree-item-inner");
        deckViewInner.addEventListener("click", (_) => {
            modal.currentDeck = this;
            modal.checkDeck = this.parent;
            modal.setupCardsView();
            this.nextCard(modal);
        });
        let deckViewInnerText = deckViewInner.createDiv("tag-pane-tag-text");
        deckViewInnerText.innerHTML += `<span class="tag-pane-tag-self">${this.deckName}</span>`;
        let deckViewOuter = deckViewSelf.createDiv("tree-item-flair-outer");
        deckViewOuter.innerHTML +=
            '<span style="background-color:#4caf50;" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.dueFlashcardsCount +
                "</span>" +
                '<span style="background-color:#2196f3;" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.newFlashcardsCount +
                "</span>" +
                '<span style="background-color:#ff7043;" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.totalFlashcards +
                "</span>";
        let deckViewChildren = deckView.createDiv("tree-item-children");
        deckViewChildren.style.display = "none";
        if (this.subdecks.length > 0) {
            collapseIconEl.addEventListener("click", (_) => {
                if (collapsed) {
                    collapseIconEl.childNodes[0].style.transform = "";
                    deckViewChildren.style.display = "block";
                }
                else {
                    collapseIconEl.childNodes[0].style.transform = "rotate(-90deg)";
                    deckViewChildren.style.display = "none";
                }
                collapsed = !collapsed;
            });
        }
        for (let deck of this.subdecks)
            deck.render(deckViewChildren, modal);
    }
    nextCard(modal) {
        if (this.newFlashcards.length + this.dueFlashcards.length === 0) {
            if (this.dueFlashcardsCount + this.newFlashcardsCount > 0) {
                for (let deck of this.subdecks) {
                    if (deck.dueFlashcardsCount + deck.newFlashcardsCount > 0) {
                        modal.currentDeck = deck;
                        deck.nextCard(modal);
                        return;
                    }
                }
            }
            if (this.parent == modal.checkDeck)
                modal.decksList();
            else
                this.parent.nextCard(modal);
            return;
        }
        modal.responseDiv.style.display = "none";
        modal.resetLinkView.style.display = "none";
        modal.titleEl.setText(`${this.deckName} - ${this.dueFlashcardsCount + this.newFlashcardsCount}`);
        modal.answerBtn.style.display = "initial";
        modal.flashcardView.innerHTML = "";
        modal.mode = FlashcardModalMode.Front;
        if (this.dueFlashcards.length > 0) {
            if (modal.plugin.data.settings.randomizeCardOrder)
                modal.currentCardIdx = Math.floor(Math.random() * this.dueFlashcards.length);
            else
                modal.currentCardIdx = 0;
            modal.currentCard = this.dueFlashcards[modal.currentCardIdx];
            modal.renderMarkdownWrapper(modal.currentCard.front, modal.flashcardView);
            let hardInterval = schedule(ReviewResponse.Hard, modal.currentCard.interval, modal.currentCard.ease, modal.currentCard.delayBeforeReview, modal.plugin.data.settings).interval;
            let goodInterval = schedule(ReviewResponse.Good, modal.currentCard.interval, modal.currentCard.ease, modal.currentCard.delayBeforeReview, modal.plugin.data.settings).interval;
            let easyInterval = schedule(ReviewResponse.Easy, modal.currentCard.interval, modal.currentCard.ease, modal.currentCard.delayBeforeReview, modal.plugin.data.settings).interval;
            if (obsidian.Platform.isMobile) {
                modal.hardBtn.setText(textInterval(hardInterval, true));
                modal.goodBtn.setText(textInterval(goodInterval, true));
                modal.easyBtn.setText(textInterval(easyInterval, true));
            }
            else {
                modal.hardBtn.setText(t("Hard") + " - " + textInterval(hardInterval, false));
                modal.goodBtn.setText(t("Good") + " - " + textInterval(goodInterval, false));
                modal.easyBtn.setText(t("Easy") + " - " + textInterval(easyInterval, false));
            }
        }
        else if (this.newFlashcards.length > 0) {
            if (modal.plugin.data.settings.randomizeCardOrder)
                modal.currentCardIdx = Math.floor(Math.random() * this.newFlashcards.length);
            else
                modal.currentCardIdx = 0;
            modal.currentCard = this.newFlashcards[modal.currentCardIdx];
            modal.renderMarkdownWrapper(modal.currentCard.front, modal.flashcardView);
            if (obsidian.Platform.isMobile) {
                modal.hardBtn.setText("1.0d");
                modal.goodBtn.setText("2.5d");
                modal.easyBtn.setText("3.5d");
            }
            else {
                modal.hardBtn.setText(t("Hard") + " - 1.0 " + t("day"));
                modal.goodBtn.setText(t("Good") + " - 2.5 " + t("days"));
                modal.easyBtn.setText(t("Easy") + " - 3.5 " + t("days"));
            }
        }
        if (modal.plugin.data.settings.showContextInCards)
            modal.contextView.setText(modal.currentCard.context);
        if (modal.plugin.data.settings.showFileNameInFileLink)
            modal.fileLinkView.setText(modal.currentCard.note.basename);
    }
}

class StatsModal extends obsidian.Modal {
    plugin;
    dueDatesFlashcards;
    constructor(app, dueDatesFlashcards, plugin) {
        super(app);
        this.plugin = plugin;
        this.dueDatesFlashcards = dueDatesFlashcards;
        this.titleEl.setText(t("Statistics"));
        if (obsidian.Platform.isMobile) {
            this.modalEl.style.height = "100%";
            this.modalEl.style.width = "100%";
            this.contentEl.style.display = "block";
        }
        else {
            this.modalEl.style.height = "100%";
            this.modalEl.style.width = "100%";
        }
    }
    onOpen() {
        let { contentEl } = this;
        contentEl.innerHTML +=
            "<div style='text-align:center'>" +
                "<span>" +
                t("Note that this requires the Obsidian Charts plugin to work") +
                "</span>" +
                "<h2 style='text-align:center'>" +
                t("Forecast") +
                "</h2>" +
                "<h4 style='text-align:center'>" +
                t("The number of cards due in the future") +
                "</h4>" +
                "</div>";
        let maxN = Math.max(...getKeysPreserveType(this.dueDatesFlashcards));
        for (let dueOffset = 0; dueOffset <= maxN; dueOffset++) {
            if (!this.dueDatesFlashcards.hasOwnProperty(dueOffset))
                this.dueDatesFlashcards[dueOffset] = 0;
        }
        let dueDatesFlashcardsCopy = { 0: 0 };
        for (let [dueOffset, dueCount] of Object.entries(this.dueDatesFlashcards)) {
            if (dueOffset <= 0)
                dueDatesFlashcardsCopy[0] += dueCount;
            else
                dueDatesFlashcardsCopy[dueOffset] = dueCount;
        }
        let text = "```chart\n" +
            "\ttype: bar\n" +
            `\tlabels: [${Object.keys(dueDatesFlashcardsCopy)}]\n` +
            "\tseries:\n" +
            "\t\t- title: " +
            t("Scheduled") +
            `\n\t\t  data: [${Object.values(dueDatesFlashcardsCopy)}]\n` +
            "\txTitle: " +
            t("Days") +
            "\n\tyTitle: " +
            t("Number of cards") +
            "\n\tlegend: false\n" +
            "\tstacked: true\n" +
            "````";
        obsidian.MarkdownRenderer.renderMarkdown(text, contentEl, "", this.plugin);
    }
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}

const REVIEW_QUEUE_VIEW_TYPE = "review-queue-list-view";
class ReviewQueueListView extends obsidian.ItemView {
    plugin;
    activeFolders;
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.activeFolders = new Set([t("Today")]);
        this.registerEvent(this.app.workspace.on("file-open", (_) => this.redraw()));
        this.registerEvent(this.app.vault.on("rename", (_) => this.redraw()));
    }
    getViewType() {
        return REVIEW_QUEUE_VIEW_TYPE;
    }
    getDisplayText() {
        return t("Notes Review Queue");
    }
    getIcon() {
        return "crosshairs";
    }
    onHeaderMenu(menu) {
        menu.addItem((item) => {
            item.setTitle(t("Close"))
                .setIcon("cross")
                .onClick(() => {
                this.app.workspace.detachLeavesOfType(REVIEW_QUEUE_VIEW_TYPE);
            });
        });
    }
    redraw() {
        let openFile = this.app.workspace.getActiveFile();
        let rootEl = createDiv("nav-folder mod-root"), childrenEl = rootEl.createDiv("nav-folder-children");
        if (this.plugin.newNotes.length > 0) {
            let newNotesFolderEl = this.createRightPaneFolder(childrenEl, t("New"), !this.activeFolders.has(t("New")));
            for (let newFile of this.plugin.newNotes) {
                this.createRightPaneFile(newNotesFolderEl, newFile, openFile !== null && newFile.path === openFile.path, !this.activeFolders.has(t("New")));
            }
        }
        if (this.plugin.scheduledNotes.length > 0) {
            let now = Date.now(), currUnix = -1;
            let folderEl = null, folderTitle = "";
            let maxDaysToRender = this.plugin.data.settings.maxNDaysNotesReviewQueue;
            for (let sNote of this.plugin.scheduledNotes) {
                if (sNote.dueUnix !== currUnix) {
                    let nDays = Math.ceil((sNote.dueUnix - now) / (24 * 3600 * 1000));
                    if (nDays > maxDaysToRender)
                        break;
                    folderTitle =
                        nDays === -1
                            ? t("Yesterday")
                            : nDays === 0
                                ? t("Today")
                                : nDays === 1
                                    ? t("Tomorrow")
                                    : new Date(sNote.dueUnix).toDateString();
                    folderEl = this.createRightPaneFolder(childrenEl, folderTitle, !this.activeFolders.has(folderTitle));
                    currUnix = sNote.dueUnix;
                }
                this.createRightPaneFile(folderEl, sNote.note, openFile !== null && sNote.note.path === openFile.path, !this.activeFolders.has(folderTitle));
            }
        }
        let contentEl = this.containerEl.children[1];
        contentEl.empty();
        contentEl.appendChild(rootEl);
    }
    createRightPaneFolder(parentEl, folderTitle, collapsed) {
        let folderEl = parentEl.createDiv("nav-folder"), folderTitleEl = folderEl.createDiv("nav-folder-title"), childrenEl = folderEl.createDiv("nav-folder-children"), collapseIconEl = folderTitleEl.createDiv("nav-folder-collapse-indicator collapse-icon");
        collapseIconEl.innerHTML = COLLAPSE_ICON;
        if (collapsed)
            collapseIconEl.childNodes[0].style.transform =
                "rotate(-90deg)";
        folderTitleEl
            .createDiv("nav-folder-title-content")
            .setText(folderTitle);
        folderTitleEl.onClickEvent((_) => {
            for (let child of childrenEl.childNodes) {
                if (child.style.display === "block" ||
                    child.style.display === "") {
                    child.style.display = "none";
                    collapseIconEl.childNodes[0].style.transform = "rotate(-90deg)";
                    this.activeFolders.delete(folderTitle);
                }
                else {
                    child.style.display = "block";
                    collapseIconEl.childNodes[0].style.transform = "";
                    this.activeFolders.add(folderTitle);
                }
            }
        });
        return folderEl;
    }
    createRightPaneFile(folderEl, file, fileElActive, hidden) {
        let navFileEl = folderEl
            .getElementsByClassName("nav-folder-children")[0]
            .createDiv("nav-file");
        if (hidden)
            navFileEl.style.display = "none";
        let navFileTitle = navFileEl.createDiv("nav-file-title");
        if (fileElActive)
            navFileTitle.addClass("is-active");
        navFileTitle.createDiv("nav-file-title-content").setText(file.basename);
        navFileTitle.addEventListener("click", (event) => {
            event.preventDefault();
            this.app.workspace.activeLeaf.openFile(file);
            return false;
        }, false);
        navFileTitle.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            let fileMenu = new obsidian.Menu(this.app);
            this.app.workspace.trigger("file-menu", fileMenu, file, "my-context-menu", null);
            fileMenu.showAtPosition({
                x: event.pageX,
                y: event.pageY,
            });
            return false;
        }, false);
    }
}

function parse(fileText, singlelineCardSeparator, singlelineReversedCardSeparator, multilineCardSeparator, multilineReversedCardSeparator) {
    let cardText = "";
    let cards = [];
    let cardType = null;
    let lineNo = 0;
    let lines = fileText.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length === 0) {
            if (cardType) {
                cards.push([cardType, cardText, lineNo]);
                cardType = null;
            }
            cardText = "";
            continue;
        }
        else if (lines[i].startsWith("<!--") &&
            !lines[i].startsWith("<!--SR:")) {
            while (i + 1 < lines.length && !lines[i + 1].includes("-->"))
                i++;
            i++;
            continue;
        }
        if (cardText.length > 0)
            cardText += "\n";
        cardText += lines[i];
        if (lines[i].includes(singlelineReversedCardSeparator) ||
            lines[i].includes(singlelineCardSeparator)) {
            cardType = lines[i].includes(singlelineReversedCardSeparator)
                ? CardType.SingleLineReversed
                : CardType.SingleLineBasic;
            cardText = lines[i];
            lineNo = i;
            if (i + 1 < lines.length && lines[i + 1].startsWith("<!--SR:")) {
                cardText += "\n" + lines[i + 1];
                i++;
            }
            cards.push([cardType, cardText, lineNo]);
            cardType = null;
            cardText = "";
        }
        else if (cardType === null && /==.*?==/gm.test(lines[i])) {
            cardType = CardType.Cloze;
            lineNo = i;
        }
        else if (lines[i] === multilineCardSeparator) {
            cardType = CardType.MultiLineBasic;
            lineNo = i;
        }
        else if (lines[i] === multilineReversedCardSeparator) {
            cardType = CardType.MultiLineReversed;
            lineNo = i;
        }
        else if (lines[i].startsWith("```")) {
            while (i + 1 < lines.length && !lines[i + 1].startsWith("```")) {
                i++;
                cardText += "\n" + lines[i];
            }
            cardText += "\n" + "```";
            i++;
        }
    }
    if (cardType && cardText)
        cards.push([cardType, cardText, lineNo]);
    return cards;
}

const DEFAULT_DATA = {
    settings: DEFAULT_SETTINGS,
    buryDate: "",
    buryList: [],
    cache: {},
};
class SRPlugin extends obsidian.Plugin {
    statusBar;
    reviewQueueView;
    data;
    logger;
    newNotes = [];
    scheduledNotes = [];
    easeByPath = {};
    incomingLinks = {};
    pageranks = {};
    dueNotesCount = 0;
    dueDatesNotes = {}; // Record<# of days in future, due count>
    deckTree = new Deck("root", null);
    dueDatesFlashcards = {}; // Record<# of days in future, due count>
    // prevent calling these functions if another instance is already running
    notesSyncLock = false;
    flashcardsSyncLock = false;
    async onload() {
        await this.loadPluginData();
        this.logger = createLogger(console, this.data.settings.logLevel);
        obsidian.addIcon("crosshairs", CROSS_HAIRS_ICON);
        this.statusBar = this.addStatusBarItem();
        this.statusBar.classList.add("mod-clickable");
        this.statusBar.setAttribute("aria-label", t("Open a note for review"));
        this.statusBar.setAttribute("aria-label-position", "top");
        this.statusBar.addEventListener("click", (_) => {
            if (!this.notesSyncLock) {
                this.sync();
                this.reviewNextNote();
            }
        });
        this.addRibbonIcon("crosshairs", t("Review flashcards"), async () => {
            if (!this.flashcardsSyncLock) {
                await this.flashcards_sync();
                new FlashcardModal(this.app, this).open();
            }
        });
        this.registerView(REVIEW_QUEUE_VIEW_TYPE, (leaf) => (this.reviewQueueView = new ReviewQueueListView(leaf, this)));
        if (!this.data.settings.disableFileMenuReviewOptions) {
            this.registerEvent(this.app.workspace.on("file-menu", (menu, fileish) => {
                if (fileish instanceof obsidian.TFile &&
                    fileish.extension === "md") {
                    menu.addItem((item) => {
                        item.setTitle(t("Review: Easy"))
                            .setIcon("crosshairs")
                            .onClick((_) => {
                            this.saveReviewResponse(fileish, ReviewResponse.Easy);
                        });
                    });
                    menu.addItem((item) => {
                        item.setTitle(t("Review: Good"))
                            .setIcon("crosshairs")
                            .onClick((_) => {
                            this.saveReviewResponse(fileish, ReviewResponse.Good);
                        });
                    });
                    menu.addItem((item) => {
                        item.setTitle(t("Review: Hard"))
                            .setIcon("crosshairs")
                            .onClick((_) => {
                            this.saveReviewResponse(fileish, ReviewResponse.Hard);
                        });
                    });
                }
            }));
        }
        this.addCommand({
            id: "srs-note-review-open-note",
            name: t("Open a note for review"),
            callback: () => {
                if (!this.notesSyncLock) {
                    this.sync();
                    this.reviewNextNote();
                }
            },
        });
        this.addCommand({
            id: "srs-note-review-easy",
            name: t("Review note as easy"),
            callback: () => {
                let openFile = this.app.workspace.getActiveFile();
                if (openFile && openFile.extension === "md")
                    this.saveReviewResponse(openFile, ReviewResponse.Easy);
            },
        });
        this.addCommand({
            id: "srs-note-review-good",
            name: t("Review note as good"),
            callback: () => {
                let openFile = this.app.workspace.getActiveFile();
                if (openFile && openFile.extension === "md")
                    this.saveReviewResponse(openFile, ReviewResponse.Good);
            },
        });
        this.addCommand({
            id: "srs-note-review-hard",
            name: t("Review note as hard"),
            callback: () => {
                let openFile = this.app.workspace.getActiveFile();
                if (openFile && openFile.extension === "md")
                    this.saveReviewResponse(openFile, ReviewResponse.Hard);
            },
        });
        this.addCommand({
            id: "srs-review-flashcards",
            name: t("Review flashcards"),
            callback: async () => {
                if (!this.flashcardsSyncLock) {
                    await this.flashcards_sync();
                    new FlashcardModal(this.app, this).open();
                }
            },
        });
        this.addCommand({
            id: "srs-view-stats",
            name: t("View statistics"),
            callback: () => {
                new StatsModal(this.app, this.dueDatesFlashcards, this).open();
            },
        });
        this.addSettingTab(new SRSettingTab(this.app, this));
        this.app.workspace.onLayoutReady(() => {
            this.initView();
            setTimeout(() => this.sync(), 2000);
            setTimeout(() => this.flashcards_sync(), 2000);
        });
    }
    onunload() {
        this.app.workspace
            .getLeavesOfType(REVIEW_QUEUE_VIEW_TYPE)
            .forEach((leaf) => leaf.detach());
    }
    async sync() {
        if (this.notesSyncLock)
            return;
        this.notesSyncLock = true;
        let notes = this.app.vault.getMarkdownFiles();
        lib.reset();
        this.scheduledNotes = [];
        this.easeByPath = {};
        this.newNotes = [];
        this.incomingLinks = {};
        this.pageranks = {};
        this.dueNotesCount = 0;
        this.dueDatesNotes = {};
        let now = Date.now();
        for (let note of notes) {
            if (this.incomingLinks[note.path] === undefined)
                this.incomingLinks[note.path] = [];
            let links = this.app.metadataCache.resolvedLinks[note.path] || {};
            for (let targetPath in links) {
                if (this.incomingLinks[targetPath] === undefined)
                    this.incomingLinks[targetPath] = [];
                // markdown files only
                if (targetPath.split(".").pop().toLowerCase() === "md") {
                    this.incomingLinks[targetPath].push({
                        sourcePath: note.path,
                        linkCount: links[targetPath],
                    });
                    lib.link(note.path, targetPath, links[targetPath]);
                }
            }
            let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
            let frontmatter = fileCachedData.frontmatter || {};
            let tags = obsidian.getAllTags(fileCachedData) || [];
            let shouldIgnore = true;
            outer: for (let tag of tags) {
                for (let tagToReview of this.data.settings.tagsToReview) {
                    if (tag === tagToReview ||
                        tag.startsWith(tagToReview + "/")) {
                        shouldIgnore = false;
                        break outer;
                    }
                }
            }
            if (shouldIgnore)
                continue;
            // file has no scheduling information
            if (!(frontmatter.hasOwnProperty("sr-due") &&
                frontmatter.hasOwnProperty("sr-interval") &&
                frontmatter.hasOwnProperty("sr-ease"))) {
                this.newNotes.push(note);
                continue;
            }
            let dueUnix = window
                .moment(frontmatter["sr-due"], [
                "YYYY-MM-DD",
                "DD-MM-YYYY",
                "ddd MMM DD YYYY",
            ])
                .valueOf();
            this.scheduledNotes.push({
                note,
                dueUnix,
            });
            this.easeByPath[note.path] = frontmatter["sr-ease"];
            if (dueUnix <= now)
                this.dueNotesCount++;
            let nDays = Math.ceil((dueUnix - now) / (24 * 3600 * 1000));
            if (!this.dueDatesNotes.hasOwnProperty(nDays))
                this.dueDatesNotes[nDays] = 0;
            this.dueDatesNotes[nDays]++;
        }
        lib.rank(0.85, 0.000001, (node, rank) => {
            this.pageranks[node] = rank * 10000;
        });
        // sort new notes by importance
        this.newNotes = this.newNotes.sort((a, b) => (this.pageranks[b.path] || 0) - (this.pageranks[a.path] || 0));
        // sort scheduled notes by date & within those days, sort them by importance
        this.scheduledNotes = this.scheduledNotes.sort((a, b) => {
            let result = a.dueUnix - b.dueUnix;
            if (result !== 0)
                return result;
            return ((this.pageranks[b.note.path] || 0) -
                (this.pageranks[a.note.path] || 0));
        });
        let noteCountText = this.dueNotesCount === 1 ? t("note") : t("notes");
        let cardCountText = this.deckTree.dueFlashcardsCount === 1 ? t("card") : t("cards");
        this.statusBar.setText(t("Review") +
            `: ${this.dueNotesCount} ${noteCountText}, ` +
            `${this.deckTree.dueFlashcardsCount} ${cardCountText} ` +
            t("due"));
        this.reviewQueueView.redraw();
        this.notesSyncLock = false;
    }
    async saveReviewResponse(note, response) {
        let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
        let frontmatter = fileCachedData.frontmatter || {};
        let tags = obsidian.getAllTags(fileCachedData) || [];
        let shouldIgnore = true;
        outer: for (let tag of tags) {
            for (let tagToReview of this.data.settings.tagsToReview) {
                if (tag === tagToReview || tag.startsWith(tagToReview + "/")) {
                    shouldIgnore = false;
                    break outer;
                }
            }
        }
        if (shouldIgnore) {
            new obsidian.Notice(t("Please tag the note appropriately for reviewing (in settings)."));
            return;
        }
        let fileText = await this.app.vault.read(note);
        let ease, interval, delayBeforeReview, now = Date.now();
        // new note
        if (!(frontmatter.hasOwnProperty("sr-due") &&
            frontmatter.hasOwnProperty("sr-interval") &&
            frontmatter.hasOwnProperty("sr-ease"))) {
            let linkTotal = 0, linkPGTotal = 0, totalLinkCount = 0;
            for (let statObj of this.incomingLinks[note.path] || []) {
                let ease = this.easeByPath[statObj.sourcePath];
                if (ease) {
                    linkTotal +=
                        statObj.linkCount *
                            this.pageranks[statObj.sourcePath] *
                            ease;
                    linkPGTotal +=
                        this.pageranks[statObj.sourcePath] * statObj.linkCount;
                    totalLinkCount += statObj.linkCount;
                }
            }
            let outgoingLinks = this.app.metadataCache.resolvedLinks[note.path] || {};
            for (let linkedFilePath in outgoingLinks) {
                let ease = this.easeByPath[linkedFilePath];
                if (ease) {
                    linkTotal +=
                        outgoingLinks[linkedFilePath] *
                            this.pageranks[linkedFilePath] *
                            ease;
                    linkPGTotal +=
                        this.pageranks[linkedFilePath] *
                            outgoingLinks[linkedFilePath];
                    totalLinkCount += outgoingLinks[linkedFilePath];
                }
            }
            let linkContribution = this.data.settings.maxLinkFactor *
                Math.min(1.0, Math.log(totalLinkCount + 0.5) / Math.log(64));
            ease = Math.round((1.0 - linkContribution) * this.data.settings.baseEase +
                (totalLinkCount > 0
                    ? (linkContribution * linkTotal) / linkPGTotal
                    : linkContribution * this.data.settings.baseEase));
            interval = 1;
            delayBeforeReview = 0;
        }
        else {
            interval = frontmatter["sr-interval"];
            ease = frontmatter["sr-ease"];
            delayBeforeReview =
                now -
                    window
                        .moment(frontmatter["sr-due"], [
                        "YYYY-MM-DD",
                        "DD-MM-YYYY",
                        "ddd MMM DD YYYY",
                    ])
                        .valueOf();
        }
        let schedObj = schedule(response, interval, ease, delayBeforeReview, this.data.settings, this.dueDatesNotes);
        interval = schedObj.interval;
        ease = schedObj.ease;
        let due = window.moment(now + interval * 24 * 3600 * 1000);
        let dueString = due.format("YYYY-MM-DD");
        // check if scheduling info exists
        if (SCHEDULING_INFO_REGEX.test(fileText)) {
            let schedulingInfo = SCHEDULING_INFO_REGEX.exec(fileText);
            fileText = fileText.replace(SCHEDULING_INFO_REGEX, `---\n${schedulingInfo[1]}sr-due: ${dueString}\n` +
                `sr-interval: ${interval}\nsr-ease: ${ease}\n` +
                `${schedulingInfo[5]}---`);
        }
        else if (YAML_FRONT_MATTER_REGEX.test(fileText)) {
            // new note with existing YAML front matter
            let existingYaml = YAML_FRONT_MATTER_REGEX.exec(fileText);
            fileText = fileText.replace(YAML_FRONT_MATTER_REGEX, `---\n${existingYaml[1]}sr-due: ${dueString}\n` +
                `sr-interval: ${interval}\nsr-ease: ${ease}\n---`);
        }
        else
            fileText =
                `---\nsr-due: ${dueString}\nsr-interval: ${interval}\n` +
                    `sr-ease: ${ease}\n---\n\n${fileText}`;
        if (this.data.settings.burySiblingCards) {
            await this.findFlashcards(note, [], true); // bury all cards in current note
            await this.savePluginData();
        }
        await this.app.vault.modify(note, fileText);
        new obsidian.Notice(t("Response received."));
        setTimeout(() => {
            if (!this.notesSyncLock) {
                this.sync();
                if (this.data.settings.autoNextNote)
                    this.reviewNextNote();
            }
        }, 500);
    }
    async reviewNextNote() {
        if (this.dueNotesCount > 0) {
            let index = this.data.settings.openRandomNote
                ? Math.floor(Math.random() * this.dueNotesCount)
                : 0;
            this.app.workspace.activeLeaf.openFile(this.scheduledNotes[index].note);
            return;
        }
        if (this.newNotes.length > 0) {
            let index = this.data.settings.openRandomNote
                ? Math.floor(Math.random() * this.newNotes.length)
                : 0;
            this.app.workspace.activeLeaf.openFile(this.newNotes[index]);
            return;
        }
        new obsidian.Notice(t("You're all caught up now :D."));
    }
    async flashcards_sync() {
        if (this.flashcardsSyncLock)
            return;
        this.flashcardsSyncLock = true;
        let notes = this.app.vault.getMarkdownFiles();
        this.deckTree = new Deck("root", null);
        this.dueDatesFlashcards = {};
        let now = window.moment(Date.now());
        let todayDate = now.format("YYYY-MM-DD");
        // clear list if we've changed dates
        if (todayDate !== this.data.buryDate) {
            this.data.buryDate = todayDate;
            this.data.buryList = [];
        }
        let notePathsSet = new Set();
        for (let note of notes) {
            notePathsSet.add(note.path);
            // find deck path
            let deckPath = [];
            if (this.data.settings.convertFoldersToDecks) {
                deckPath = note.path.split("/");
                deckPath.pop(); // remove filename
                if (deckPath.length === 0)
                    deckPath = ["/"];
            }
            else {
                let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
                let tags = obsidian.getAllTags(fileCachedData) || [];
                outer: for (let tag of tags) {
                    for (let tagToReview of this.data.settings.flashcardTags) {
                        if (tag === tagToReview ||
                            tag.startsWith(tagToReview + "/")) {
                            deckPath = tag.substring(1).split("/");
                            break outer;
                        }
                    }
                }
            }
            if (deckPath.length === 0)
                continue;
            if (this.data.cache.hasOwnProperty(note.path)) {
                let fileCache = this.data.cache[note.path];
                // Has file changed?
                if (fileCache.lastUpdated === note.stat.mtime) {
                    if (fileCache.totalCards === 0)
                        continue;
                    else if (!fileCache.hasNewCards &&
                        now.valueOf() <
                            window
                                .moment(fileCache.nextDueDate, "YYYY-MM-DD")
                                .valueOf()) {
                        this.deckTree.createDeck([...deckPath]);
                        this.deckTree.countFlashcard(deckPath, fileCache.totalCards);
                    }
                    else
                        await this.findFlashcards(note, deckPath);
                }
                else
                    await this.findFlashcards(note, deckPath);
            }
            else
                await this.findFlashcards(note, deckPath);
            for (let [nDay, count] of Object.entries(this.data.cache[note.path].dueDatesFlashcards)) {
                if (!this.dueDatesFlashcards.hasOwnProperty(nDay))
                    this.dueDatesFlashcards[nDay] = 0;
                this.dueDatesFlashcards[nDay] += count;
            }
        }
        // remove unused cache entries
        for (let cachedPath in this.data.cache) {
            if (!notePathsSet.has(cachedPath))
                delete this.data.cache[cachedPath];
        }
        this.logger.info(`Flashcard sync took ${Date.now() - now.valueOf()}ms`);
        await this.savePluginData();
        // sort the deck names
        this.deckTree.sortSubdecksList();
        let noteCountText = this.dueNotesCount === 1 ? t("note") : t("notes");
        let cardCountText = this.deckTree.dueFlashcardsCount === 1 ? t("card") : t("cards");
        this.statusBar.setText(t("Review") +
            `: ${this.dueNotesCount} ${noteCountText}, ` +
            `${this.deckTree.dueFlashcardsCount} ${cardCountText} ` +
            t("due"));
        this.flashcardsSyncLock = false;
    }
    async findFlashcards(note, deckPath, buryOnly = false) {
        let fileText = await this.app.vault.read(note);
        let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
        let headings = fileCachedData.headings || [];
        let fileChanged = false, deckAdded = false;
        // caching information
        let hasNewCards = false, totalCards = 0, nextDueDate = Infinity, // 03:14:07 UTC, January 19 2038 haha
        dueDatesFlashcards = {};
        let now = Date.now();
        let parsedCards = parse(fileText, this.data.settings.singlelineCardSeparator, this.data.settings.singlelineReversedCardSeparator, this.data.settings.multilineCardSeparator, this.data.settings.multilineReversedCardSeparator);
        this.logger.info(parsedCards);
        for (let parsedCard of parsedCards) {
            let cardType = parsedCard[0], cardText = parsedCard[1], lineNo = parsedCard[2];
            if (cardType === CardType.Cloze &&
                this.data.settings.disableClozeCards)
                continue;
            let cardTextHash = cyrb53(cardText);
            if (buryOnly) {
                this.data.buryList.push(cardTextHash);
                continue;
            }
            if (!deckAdded) {
                this.deckTree.createDeck([...deckPath]);
                deckAdded = true;
            }
            let siblingMatches = [];
            if (cardType === CardType.Cloze) {
                let front, back;
                for (let m of cardText.matchAll(/==(.*?)==/gm)) {
                    let deletionStart = m.index, deletionEnd = deletionStart + m[0].length;
                    front =
                        cardText.substring(0, deletionStart) +
                            "<span style='color:#2196f3'>[...]</span>" +
                            cardText.substring(deletionEnd);
                    front = front.replace(/==/gm, "");
                    back =
                        cardText.substring(0, deletionStart) +
                            "<span style='color:#2196f3'>" +
                            cardText.substring(deletionStart, deletionEnd) +
                            "</span>" +
                            cardText.substring(deletionEnd);
                    back = back.replace(/==/gm, "");
                    siblingMatches.push([front, back]);
                }
            }
            else {
                let idx;
                if (cardType === CardType.SingleLineBasic) {
                    idx = cardText.indexOf(this.data.settings.singlelineCardSeparator);
                    siblingMatches.push([
                        cardText.substring(0, idx),
                        cardText.substring(idx +
                            this.data.settings.singlelineCardSeparator
                                .length),
                    ]);
                }
                else if (cardType === CardType.SingleLineReversed) {
                    idx = cardText.indexOf(this.data.settings.singlelineReversedCardSeparator);
                    let side1 = cardText.substring(0, idx), side2 = cardText.substring(idx +
                        this.data.settings
                            .singlelineReversedCardSeparator.length);
                    siblingMatches.push([side1, side2]);
                    siblingMatches.push([side2, side1]);
                }
                else if (cardType === CardType.MultiLineBasic) {
                    idx = cardText.indexOf("\n" + this.data.settings.multilineCardSeparator + "\n");
                    siblingMatches.push([
                        cardText.substring(0, idx),
                        cardText.substring(idx +
                            2 +
                            this.data.settings.multilineCardSeparator.length),
                    ]);
                }
                else if (cardType === CardType.MultiLineReversed) {
                    idx = cardText.indexOf("\n" +
                        this.data.settings.multilineReversedCardSeparator +
                        "\n");
                    let side1 = cardText.substring(0, idx), side2 = cardText.substring(idx +
                        2 +
                        this.data.settings
                            .multilineReversedCardSeparator.length);
                    siblingMatches.push([side1, side2]);
                    siblingMatches.push([side2, side1]);
                }
            }
            let scheduling = [
                ...cardText.matchAll(MULTI_SCHEDULING_EXTRACTOR),
            ];
            if (scheduling.length === 0)
                scheduling = [
                    ...cardText.matchAll(LEGACY_SCHEDULING_EXTRACTOR),
                ];
            // we have some extra scheduling dates to delete
            if (scheduling.length > siblingMatches.length) {
                let idxSched = cardText.lastIndexOf("<!--SR:") + 7;
                let newCardText = cardText.substring(0, idxSched);
                for (let i = 0; i < siblingMatches.length; i++)
                    newCardText += `!${scheduling[i][1]},${scheduling[i][2]},${scheduling[i][3]}`;
                newCardText += "-->";
                let replacementRegex = new RegExp(escapeRegexString(cardText), "gm");
                fileText = fileText.replace(replacementRegex, (_) => newCardText);
                fileChanged = true;
            }
            let context = this.data.settings.showContextInCards
                ? getCardContext(lineNo, headings)
                : "";
            let siblings = [];
            for (let i = 0; i < siblingMatches.length; i++) {
                let front = siblingMatches[i][0].trim(), back = siblingMatches[i][1].trim();
                let cardObj = {
                    isDue: i < scheduling.length,
                    note,
                    lineNo,
                    front,
                    back,
                    cardText,
                    context,
                    cardType,
                    siblingIdx: i,
                    siblings,
                };
                totalCards++;
                // card scheduled
                if (i < scheduling.length) {
                    let dueUnix = window
                        .moment(scheduling[i][1], ["YYYY-MM-DD", "DD-MM-YYYY"])
                        .valueOf();
                    if (dueUnix < nextDueDate)
                        nextDueDate = dueUnix;
                    let nDays = Math.ceil((dueUnix - now) / (24 * 3600 * 1000));
                    if (!dueDatesFlashcards.hasOwnProperty(nDays))
                        dueDatesFlashcards[nDays] = 0;
                    dueDatesFlashcards[nDays]++;
                    if (this.data.buryList.includes(cardTextHash)) {
                        this.deckTree.countFlashcard([...deckPath]);
                        continue;
                    }
                    if (dueUnix <= now) {
                        cardObj.interval = parseInt(scheduling[i][2]);
                        cardObj.ease = parseInt(scheduling[i][3]);
                        cardObj.delayBeforeReview = now - dueUnix;
                        this.deckTree.insertFlashcard([...deckPath], cardObj);
                    }
                    else {
                        this.deckTree.countFlashcard([...deckPath]);
                        continue;
                    }
                }
                else {
                    if (!hasNewCards)
                        hasNewCards = true;
                    if (this.data.buryList.includes(cyrb53(cardText))) {
                        this.deckTree.countFlashcard([...deckPath]);
                        continue;
                    }
                    this.deckTree.insertFlashcard([...deckPath], cardObj);
                }
                siblings.push(cardObj);
            }
        }
        if (!buryOnly)
            this.data.cache[note.path] = {
                totalCards,
                hasNewCards,
                nextDueDate: nextDueDate !== Infinity
                    ? window.moment(nextDueDate).format("YYYY-MM-DD")
                    : "",
                lastUpdated: note.stat.mtime,
                dueDatesFlashcards,
            };
        if (fileChanged)
            await this.app.vault.modify(note, fileText);
    }
    async loadPluginData() {
        this.data = Object.assign({}, DEFAULT_DATA, await this.loadData());
        this.data.settings = Object.assign({}, DEFAULT_SETTINGS, this.data.settings);
    }
    async savePluginData() {
        await this.saveData(this.data);
    }
    initView() {
        if (this.app.workspace.getLeavesOfType(REVIEW_QUEUE_VIEW_TYPE).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: REVIEW_QUEUE_VIEW_TYPE,
            active: true,
        });
    }
}
function getCardContext(cardLine, headings) {
    let stack = [];
    for (let heading of headings) {
        if (heading.position.start.line > cardLine)
            break;
        while (stack.length > 0 &&
            stack[stack.length - 1].level >= heading.level)
            stack.pop();
        stack.push(heading);
    }
    let context = "";
    for (let headingObj of stack)
        context += headingObj.heading + " > ";
    return context.slice(0, -3);
}

module.exports = SRPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3BhZ2VyYW5rLmpzL2xpYi9pbmRleC5qcyIsInNyYy9sb2dnZXIudHMiLCJzcmMvbGFuZy9sb2NhbGUvYXIudHMiLCJzcmMvbGFuZy9sb2NhbGUvY3oudHMiLCJzcmMvbGFuZy9sb2NhbGUvZGEudHMiLCJzcmMvbGFuZy9sb2NhbGUvZGUudHMiLCJzcmMvbGFuZy9sb2NhbGUvZW4udHMiLCJzcmMvbGFuZy9sb2NhbGUvZW4tZ2IudHMiLCJzcmMvbGFuZy9sb2NhbGUvZXMudHMiLCJzcmMvbGFuZy9sb2NhbGUvZnIudHMiLCJzcmMvbGFuZy9sb2NhbGUvaGkudHMiLCJzcmMvbGFuZy9sb2NhbGUvaWQudHMiLCJzcmMvbGFuZy9sb2NhbGUvaXQudHMiLCJzcmMvbGFuZy9sb2NhbGUvamEudHMiLCJzcmMvbGFuZy9sb2NhbGUva28udHMiLCJzcmMvbGFuZy9sb2NhbGUvbmwudHMiLCJzcmMvbGFuZy9sb2NhbGUvbm8udHMiLCJzcmMvbGFuZy9sb2NhbGUvcGwudHMiLCJzcmMvbGFuZy9sb2NhbGUvcHQudHMiLCJzcmMvbGFuZy9sb2NhbGUvcHQtYnIudHMiLCJzcmMvbGFuZy9sb2NhbGUvcm8udHMiLCJzcmMvbGFuZy9sb2NhbGUvcnUudHMiLCJzcmMvbGFuZy9sb2NhbGUvdHIudHMiLCJzcmMvbGFuZy9sb2NhbGUvemgtY24udHMiLCJzcmMvbGFuZy9sb2NhbGUvemgtdHcudHMiLCJzcmMvbGFuZy9oZWxwZXJzLnRzIiwic3JjL3NldHRpbmdzLnRzIiwic3JjL3NjaGVkdWxpbmcudHMiLCJzcmMvdHlwZXMudHMiLCJzcmMvY29uc3RhbnRzLnRzIiwic3JjL3V0aWxzLnRzIiwic3JjL2ZsYXNoY2FyZC1tb2RhbC50cyIsInNyYy9zdGF0cy1tb2RhbC50cyIsInNyYy9zaWRlYmFyLnRzIiwic3JjL3BhcnNlci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZm9yT3duKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICBpZiAoKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSAmJiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2soa2V5LCBvYmplY3Rba2V5XSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0ge1xuICAgICAgICBjb3VudDogMCxcbiAgICAgICAgZWRnZXM6IHt9LFxuICAgICAgICBub2Rlczoge31cbiAgICB9O1xuXG4gICAgc2VsZi5saW5rID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCB3ZWlnaHQpIHtcbiAgICAgICAgaWYgKChpc0Zpbml0ZSh3ZWlnaHQpICE9PSB0cnVlKSB8fCAod2VpZ2h0ID09PSBudWxsKSkge1xuICAgICAgICAgICAgd2VpZ2h0ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgd2VpZ2h0ID0gcGFyc2VGbG9hdCh3ZWlnaHQpO1xuXG4gICAgICAgIGlmIChzZWxmLm5vZGVzLmhhc093blByb3BlcnR5KHNvdXJjZSkgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHNlbGYuY291bnQrKztcbiAgICAgICAgICAgIHNlbGYubm9kZXNbc291cmNlXSA9IHtcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgb3V0Ym91bmQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLm5vZGVzW3NvdXJjZV0ub3V0Ym91bmQgKz0gd2VpZ2h0O1xuXG4gICAgICAgIGlmIChzZWxmLm5vZGVzLmhhc093blByb3BlcnR5KHRhcmdldCkgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHNlbGYuY291bnQrKztcbiAgICAgICAgICAgIHNlbGYubm9kZXNbdGFyZ2V0XSA9IHtcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgb3V0Ym91bmQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5lZGdlcy5oYXNPd25Qcm9wZXJ0eShzb3VyY2UpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBzZWxmLmVkZ2VzW3NvdXJjZV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLmVkZ2VzW3NvdXJjZV0uaGFzT3duUHJvcGVydHkodGFyZ2V0KSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgc2VsZi5lZGdlc1tzb3VyY2VdW3RhcmdldF0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5lZGdlc1tzb3VyY2VdW3RhcmdldF0gKz0gd2VpZ2h0O1xuICAgIH07XG5cbiAgICBzZWxmLnJhbmsgPSBmdW5jdGlvbiAoYWxwaGEsIGVwc2lsb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBkZWx0YSA9IDEsXG4gICAgICAgICAgICBpbnZlcnNlID0gMSAvIHNlbGYuY291bnQ7XG5cbiAgICAgICAgZm9yT3duKHNlbGYuZWRnZXMsIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm5vZGVzW3NvdXJjZV0ub3V0Ym91bmQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yT3duKHNlbGYuZWRnZXNbc291cmNlXSwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVkZ2VzW3NvdXJjZV1bdGFyZ2V0XSAvPSBzZWxmLm5vZGVzW3NvdXJjZV0ub3V0Ym91bmQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvck93bihzZWxmLm5vZGVzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBzZWxmLm5vZGVzW2tleV0ud2VpZ2h0ID0gaW52ZXJzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGRlbHRhID4gZXBzaWxvbikge1xuICAgICAgICAgICAgdmFyIGxlYWsgPSAwLFxuICAgICAgICAgICAgICAgIG5vZGVzID0ge307XG5cbiAgICAgICAgICAgIGZvck93bihzZWxmLm5vZGVzLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG5vZGVzW2tleV0gPSB2YWx1ZS53ZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUub3V0Ym91bmQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGVhayArPSB2YWx1ZS53ZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5ub2Rlc1trZXldLndlaWdodCA9IDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGVhayAqPSBhbHBoYTtcblxuICAgICAgICAgICAgZm9yT3duKHNlbGYubm9kZXMsIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBmb3JPd24oc2VsZi5lZGdlc1tzb3VyY2VdLCBmdW5jdGlvbiAodGFyZ2V0LCB3ZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ub2Rlc1t0YXJnZXRdLndlaWdodCArPSBhbHBoYSAqIG5vZGVzW3NvdXJjZV0gKiB3ZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm5vZGVzW3NvdXJjZV0ud2VpZ2h0ICs9ICgxIC0gYWxwaGEpICogaW52ZXJzZSArIGxlYWsgKiBpbnZlcnNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlbHRhID0gMDtcblxuICAgICAgICAgICAgZm9yT3duKHNlbGYubm9kZXMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVsdGEgKz0gTWF0aC5hYnModmFsdWUud2VpZ2h0IC0gbm9kZXNba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvck93bihzZWxmLm5vZGVzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soa2V5LCBzZWxmLm5vZGVzW2tleV0ud2VpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNlbGYucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuY291bnQgPSAwO1xuICAgICAgICBzZWxmLmVkZ2VzID0ge307XG4gICAgICAgIHNlbGYubm9kZXMgPSB7fTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlbGY7XG59KSgpO1xuIiwiZXhwb3J0IGVudW0gTG9nTGV2ZWwge1xuICAgIEluZm8sXG4gICAgV2FybixcbiAgICBFcnJvcixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXIge1xuICAgIGluZm86IEZ1bmN0aW9uO1xuICAgIHdhcm46IEZ1bmN0aW9uO1xuICAgIGVycm9yOiBGdW5jdGlvbjtcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxvZ2dlciA9IChjb25zb2xlOiBDb25zb2xlLCBsb2dMZXZlbDogTG9nTGV2ZWwpOiBMb2dnZXIgPT4ge1xuICAgIGxldCBpbmZvOiBGdW5jdGlvbiwgd2FybjogRnVuY3Rpb247XG5cbiAgICBpZiAobG9nTGV2ZWwgPT09IExvZ0xldmVsLkluZm8pXG4gICAgICAgIGluZm8gPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKGNvbnNvbGUuaW5mbywgY29uc29sZSwgXCJTUjpcIik7XG4gICAgZWxzZSBpbmZvID0gKC4uLl86IGFueVtdKSA9PiB7fTtcblxuICAgIGlmIChsb2dMZXZlbCA8PSBMb2dMZXZlbC5XYXJuKVxuICAgICAgICB3YXJuID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChjb25zb2xlLndhcm4sIGNvbnNvbGUsIFwiU1I6XCIpO1xuICAgIGVsc2Ugd2FybiA9ICguLi5fOiBhbnlbXSkgPT4ge307XG5cbiAgICBsZXQgZXJyb3I6IEZ1bmN0aW9uID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChcbiAgICAgICAgY29uc29sZS5lcnJvcixcbiAgICAgICAgY29uc29sZSxcbiAgICAgICAgXCJTUjpcIlxuICAgICk7XG5cbiAgICByZXR1cm4geyBpbmZvLCB3YXJuLCBlcnJvciB9O1xufTtcbiIsIi8vINin2YTYudix2KjZitipXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gxI1lxaF0aW5hXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gRGFuc2tcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBEZXV0c2NoXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gRW5nbGlzaFxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gZmxhc2hjYXJkLW1vZGFsLnRzXG4gICAgRGVja3M6IFwiRGVja3NcIixcbiAgICBcIk9wZW4gZmlsZVwiOiBcIk9wZW4gZmlsZVwiLFxuICAgIFwiRHVlIGNhcmRzXCI6IFwiRHVlIGNhcmRzXCIsXG4gICAgXCJOZXcgY2FyZHNcIjogXCJOZXcgY2FyZHNcIixcbiAgICBcIlRvdGFsIGNhcmRzXCI6IFwiVG90YWwgY2FyZHNcIixcbiAgICBcIlJlc2V0IGNhcmQncyBwcm9ncmVzc1wiOiBcIlJlc2V0IGNhcmQncyBwcm9ncmVzc1wiLFxuICAgIEhhcmQ6IFwiSGFyZFwiLFxuICAgIEdvb2Q6IFwiR29vZFwiLFxuICAgIEVhc3k6IFwiRWFzeVwiLFxuICAgIFwiU2hvdyBBbnN3ZXJcIjogXCJTaG93IEFuc3dlclwiLFxuICAgIFwiQ2FyZCdzIHByb2dyZXNzIGhhcyBiZWVuIHJlc2V0LlwiOiBcIkNhcmQncyBwcm9ncmVzcyBoYXMgYmVlbiByZXNldC5cIixcblxuICAgIC8vIG1haW4udHNcbiAgICBcIk9wZW4gYSBub3RlIGZvciByZXZpZXdcIjogXCJPcGVuIGEgbm90ZSBmb3IgcmV2aWV3XCIsXG4gICAgXCJSZXZpZXcgZmxhc2hjYXJkc1wiOiBcIlJldmlldyBmbGFzaGNhcmRzXCIsXG4gICAgXCJSZXZpZXc6IEVhc3lcIjogXCJSZXZpZXc6IEVhc3lcIixcbiAgICBcIlJldmlldzogR29vZFwiOiBcIlJldmlldzogR29vZFwiLFxuICAgIFwiUmV2aWV3OiBIYXJkXCI6IFwiUmV2aWV3OiBIYXJkXCIsXG4gICAgXCJSZXZpZXcgbm90ZSBhcyBlYXN5XCI6IFwiUmV2aWV3IG5vdGUgYXMgZWFzeVwiLFxuICAgIFwiUmV2aWV3IG5vdGUgYXMgZ29vZFwiOiBcIlJldmlldyBub3RlIGFzIGdvb2RcIixcbiAgICBcIlJldmlldyBub3RlIGFzIGhhcmRcIjogXCJSZXZpZXcgbm90ZSBhcyBoYXJkXCIsXG4gICAgXCJWaWV3IHN0YXRpc3RpY3NcIjogXCJWaWV3IHN0YXRpc3RpY3NcIixcbiAgICBub3RlOiBcIm5vdGVcIixcbiAgICBub3RlczogXCJub3Rlc1wiLFxuICAgIGNhcmQ6IFwiY2FyZFwiLFxuICAgIGNhcmRzOiBcImNhcmRzXCIsXG4gICAgXCJQbGVhc2UgdGFnIHRoZSBub3RlIGFwcHJvcHJpYXRlbHkgZm9yIHJldmlld2luZyAoaW4gc2V0dGluZ3MpLlwiOlxuICAgICAgICBcIlBsZWFzZSB0YWcgdGhlIG5vdGUgYXBwcm9wcmlhdGVseSBmb3IgcmV2aWV3aW5nIChpbiBzZXR0aW5ncykuXCIsXG4gICAgXCJZb3UncmUgYWxsIGNhdWdodCB1cCBub3cgOkQuXCI6IFwiWW91J3JlIGFsbCBjYXVnaHQgdXAgbm93IDpELlwiLFxuICAgIFwiUmVzcG9uc2UgcmVjZWl2ZWQuXCI6IFwiUmVzcG9uc2UgcmVjZWl2ZWQuXCIsXG5cbiAgICAvLyBzY2hlZHVsaW5nLnRzXG4gICAgZGF5OiBcImRheVwiLFxuICAgIGRheXM6IFwiZGF5c1wiLFxuICAgIG1vbnRoOiBcIm1vbnRoXCIsXG4gICAgbW9udGhzOiBcIm1vbnRoc1wiLFxuICAgIHllYXI6IFwieWVhclwiLFxuICAgIHllYXJzOiBcInllYXJzXCIsXG5cbiAgICAvLyBzZXR0aW5ncy50c1xuICAgIE5vdGVzOiBcIk5vdGVzXCIsXG4gICAgRmxhc2hjYXJkczogXCJGbGFzaGNhcmRzXCIsXG4gICAgXCJTcGFjZWQgUmVwZXRpdGlvbiBQbHVnaW4gLSBTZXR0aW5nc1wiOlxuICAgICAgICBcIlNwYWNlZCBSZXBldGl0aW9uIFBsdWdpbiAtIFNldHRpbmdzXCIsXG4gICAgXCJGb3IgbW9yZSBpbmZvcm1hdGlvbiwgY2hlY2sgdGhlXCI6IFwiRm9yIG1vcmUgaW5mb3JtYXRpb24sIGNoZWNrIHRoZVwiLFxuICAgIHdpa2k6IFwid2lraVwiLFxuICAgIFwiYWxnb3JpdGhtIGltcGxlbWVudGF0aW9uXCI6IFwiYWxnb3JpdGhtIGltcGxlbWVudGF0aW9uXCIsXG4gICAgXCJGbGFzaGNhcmQgdGFnc1wiOiBcIkZsYXNoY2FyZCB0YWdzXCIsXG4gICAgXCJFbnRlciB0YWdzIHNlcGFyYXRlZCBieSBzcGFjZXMgb3IgbmV3bGluZXMgaS5lLiAjZmxhc2hjYXJkcyAjZGVjazIgI2RlY2szLlwiOlxuICAgICAgICBcIkVudGVyIHRhZ3Mgc2VwYXJhdGVkIGJ5IHNwYWNlcyBvciBuZXdsaW5lcyBpLmUuICNmbGFzaGNhcmRzICNkZWNrMiAjZGVjazMuXCIsXG4gICAgXCJDb252ZXJ0IGZvbGRlcnMgdG8gZGVja3MgYW5kIHN1YmRlY2tzP1wiOlxuICAgICAgICBcIkNvbnZlcnQgZm9sZGVycyB0byBkZWNrcyBhbmQgc3ViZGVja3M/XCIsXG4gICAgXCJUaGlzIGlzIGFuIGFsdGVybmF0aXZlIHRvIHRoZSBGbGFzaGNhcmQgdGFncyBvcHRpb24gYWJvdmUuXCI6XG4gICAgICAgIFwiVGhpcyBpcyBhbiBhbHRlcm5hdGl2ZSB0byB0aGUgRmxhc2hjYXJkIHRhZ3Mgb3B0aW9uIGFib3ZlLlwiLFxuICAgIFwiU2F2ZSBzY2hlZHVsaW5nIGNvbW1lbnQgb24gdGhlIHNhbWUgbGluZSBhcyB0aGUgZmxhc2hjYXJkJ3MgbGFzdCBsaW5lP1wiOlxuICAgICAgICBcIlNhdmUgc2NoZWR1bGluZyBjb21tZW50IG9uIHRoZSBzYW1lIGxpbmUgYXMgdGhlIGZsYXNoY2FyZCdzIGxhc3QgbGluZT9cIixcbiAgICBcIlR1cm5pbmcgdGhpcyBvbiB3aWxsIG1ha2UgdGhlIEhUTUwgY29tbWVudHMgbm90IGJyZWFrIGxpc3QgZm9ybWF0dGluZy5cIjpcbiAgICAgICAgXCJUdXJuaW5nIHRoaXMgb24gd2lsbCBtYWtlIHRoZSBIVE1MIGNvbW1lbnRzIG5vdCBicmVhayBsaXN0IGZvcm1hdHRpbmcuXCIsXG4gICAgXCJCdXJ5IHNpYmxpbmcgY2FyZHMgdW50aWwgdGhlIG5leHQgZGF5P1wiOlxuICAgICAgICBcIkJ1cnkgc2libGluZyBjYXJkcyB1bnRpbCB0aGUgbmV4dCBkYXk/XCIsXG4gICAgXCJTaWJsaW5ncyBhcmUgY2FyZHMgZ2VuZXJhdGVkIGZyb20gdGhlIHNhbWUgY2FyZCB0ZXh0IGkuZS4gY2xvemUgZGVsZXRpb25zXCI6XG4gICAgICAgIFwiU2libGluZ3MgYXJlIGNhcmRzIGdlbmVyYXRlZCBmcm9tIHRoZSBzYW1lIGNhcmQgdGV4dCBpLmUuIGNsb3plIGRlbGV0aW9uc1wiLFxuICAgIFwiU2hvdyBjb250ZXh0IGluIGNhcmRzP1wiOiBcIlNob3cgY29udGV4dCBpbiBjYXJkcz9cIixcbiAgICBcImkuZS4gVGl0bGUgPiBIZWFkaW5nIDEgPiBTdWJoZWFkaW5nID4gLi4uID4gU3ViaGVhZGluZ1wiOlxuICAgICAgICBcImkuZS4gVGl0bGUgPiBIZWFkaW5nIDEgPiBTdWJoZWFkaW5nID4gLi4uID4gU3ViaGVhZGluZ1wiLFxuICAgIFwiRmxhc2hjYXJkIEhlaWdodCBQZXJjZW50YWdlXCI6IFwiRmxhc2hjYXJkIEhlaWdodCBQZXJjZW50YWdlXCIsXG4gICAgXCJbRGVza3RvcF0gU2hvdWxkIGJlIHNldCB0byAxMDAlIGlmIHlvdSBoYXZlIHZlcnkgbGFyZ2UgaW1hZ2VzXCI6XG4gICAgICAgIFwiW0Rlc2t0b3BdIFNob3VsZCBiZSBzZXQgdG8gMTAwJSBpZiB5b3UgaGF2ZSB2ZXJ5IGxhcmdlIGltYWdlc1wiLFxuICAgIFwiUmVzZXQgdG8gZGVmYXVsdFwiOiBcIlJlc2V0IHRvIGRlZmF1bHRcIixcbiAgICBcIkZsYXNoY2FyZCBXaWR0aCBQZXJjZW50YWdlXCI6IFwiRmxhc2hjYXJkIFdpZHRoIFBlcmNlbnRhZ2VcIixcbiAgICBcIlNob3cgZmlsZSBuYW1lIGluc3RlYWQgb2YgJ09wZW4gZmlsZScgaW4gZmxhc2hjYXJkIHJldmlldz9cIjpcbiAgICAgICAgXCJTaG93IGZpbGUgbmFtZSBpbnN0ZWFkIG9mICdPcGVuIGZpbGUnIGluIGZsYXNoY2FyZCByZXZpZXc/XCIsXG4gICAgXCJSYW5kb21pemUgY2FyZCBvcmRlciBkdXJpbmcgcmV2aWV3P1wiOlxuICAgICAgICBcIlJhbmRvbWl6ZSBjYXJkIG9yZGVyIGR1cmluZyByZXZpZXc/XCIsXG4gICAgXCJEaXNhYmxlIGNsb3plIGNhcmRzP1wiOiBcIkRpc2FibGUgY2xvemUgY2FyZHM/XCIsXG4gICAgXCJJZiB5b3UncmUgbm90IGN1cnJlbnRseSB1c2luZyAnZW0gJiB3b3VsZCBsaWtlIHRoZSBwbHVnaW4gdG8gcnVuIGEgdGFkIGZhc3Rlci5cIjpcbiAgICAgICAgXCJJZiB5b3UncmUgbm90IGN1cnJlbnRseSB1c2luZyAnZW0gJiB3b3VsZCBsaWtlIHRoZSBwbHVnaW4gdG8gcnVuIGEgdGFkIGZhc3Rlci5cIixcbiAgICBcIlNlcGFyYXRvciBmb3IgaW5saW5lIGZsYXNoY2FyZHNcIjogXCJTZXBhcmF0b3IgZm9yIGlubGluZSBmbGFzaGNhcmRzXCIsXG4gICAgXCJTZXBhcmF0b3IgZm9yIGlubGluZSByZXZlcnNlZCBmbGFzaGNhcmRzXCI6IFwiU2VwYXJhdG9yIGZvciBpbmxpbmUgcmV2ZXJzZWQgZmxhc2hjYXJkc1wiLFxuICAgIFwiU2VwYXJhdG9yIGZvciBtdWx0aWxpbmUgcmV2ZXJzZWQgZmxhc2hjYXJkc1wiOiBcIlNlcGFyYXRvciBmb3IgbXVsdGlsaW5lIHJldmVyc2VkIGZsYXNoY2FyZHNcIixcbiAgICBcIk5vdGUgdGhhdCBhZnRlciBjaGFuZ2luZyB0aGlzIHlvdSBoYXZlIHRvIG1hbnVhbGx5IGVkaXQgYW55IGZsYXNoY2FyZHMgeW91IGFscmVhZHkgaGF2ZS5cIjpcbiAgICAgICAgXCJOb3RlIHRoYXQgYWZ0ZXIgY2hhbmdpbmcgdGhpcyB5b3UgaGF2ZSB0byBtYW51YWxseSBlZGl0IGFueSBmbGFzaGNhcmRzIHlvdSBhbHJlYWR5IGhhdmUuXCIsXG4gICAgXCJTZXBhcmF0b3IgZm9yIG11bHRpbGluZSBmbGFzaGNhcmRzXCI6IFwiU2VwYXJhdG9yIGZvciBtdWx0aWxpbmUgZmxhc2hjYXJkc1wiLFxuICAgIFwiVGFncyB0byByZXZpZXdcIjogXCJUYWdzIHRvIHJldmlld1wiLFxuICAgIFwiRW50ZXIgdGFncyBzZXBhcmF0ZWQgYnkgc3BhY2VzIG9yIG5ld2xpbmVzIGkuZS4gI3JldmlldyAjdGFnMiAjdGFnMy5cIjpcbiAgICAgICAgXCJFbnRlciB0YWdzIHNlcGFyYXRlZCBieSBzcGFjZXMgb3IgbmV3bGluZXMgaS5lLiAjcmV2aWV3ICN0YWcyICN0YWczLlwiLFxuICAgIFwiT3BlbiBhIHJhbmRvbSBub3RlIGZvciByZXZpZXdcIjogXCJPcGVuIGEgcmFuZG9tIG5vdGUgZm9yIHJldmlld1wiLFxuICAgIFwiV2hlbiB5b3UgdHVybiB0aGlzIG9mZiwgbm90ZXMgYXJlIG9yZGVyZWQgYnkgaW1wb3J0YW5jZSAoUGFnZVJhbmspLlwiOlxuICAgICAgICBcIldoZW4geW91IHR1cm4gdGhpcyBvZmYsIG5vdGVzIGFyZSBvcmRlcmVkIGJ5IGltcG9ydGFuY2UgKFBhZ2VSYW5rKS5cIixcbiAgICBcIk9wZW4gbmV4dCBub3RlIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgYSByZXZpZXdcIjpcbiAgICAgICAgXCJPcGVuIG5leHQgbm90ZSBhdXRvbWF0aWNhbGx5IGFmdGVyIGEgcmV2aWV3XCIsXG4gICAgXCJGb3IgZmFzdGVyIHJldmlld3MuXCI6IFwiRm9yIGZhc3RlciByZXZpZXdzLlwiLFxuICAgIFwiRGlzYWJsZSByZXZpZXcgb3B0aW9ucyBpbiB0aGUgZmlsZSBtZW51IGkuZS4gUmV2aWV3OiBFYXN5IEdvb2QgSGFyZFwiOlxuICAgICAgICBcIkRpc2FibGUgcmV2aWV3IG9wdGlvbnMgaW4gdGhlIGZpbGUgbWVudSBpLmUuIFJldmlldzogRWFzeSBHb29kIEhhcmRcIixcbiAgICBcIkFmdGVyIGRpc2FibGluZywgeW91IGNhbiByZXZpZXcgdXNpbmcgdGhlIGNvbW1hbmQgaG90a2V5cy4gUmVsb2FkIE9ic2lkaWFuIGFmdGVyIGNoYW5naW5nIHRoaXMuXCI6XG4gICAgICAgIFwiQWZ0ZXIgZGlzYWJsaW5nLCB5b3UgY2FuIHJldmlldyB1c2luZyB0aGUgY29tbWFuZCBob3RrZXlzLiBSZWxvYWQgT2JzaWRpYW4gYWZ0ZXIgY2hhbmdpbmcgdGhpcy5cIixcbiAgICBcIk1heGltdW0gbnVtYmVyIG9mIGRheXMgdG8gZGlzcGxheSBvbiByaWdodCBwYW5lbFwiOlxuICAgICAgICBcIk1heGltdW0gbnVtYmVyIG9mIGRheXMgdG8gZGlzcGxheSBvbiByaWdodCBwYW5lbFwiLFxuICAgIFwiUmVkdWNlIHRoaXMgZm9yIGEgY2xlYW5lciBpbnRlcmZhY2UuXCI6XG4gICAgICAgIFwiUmVkdWNlIHRoaXMgZm9yIGEgY2xlYW5lciBpbnRlcmZhY2UuXCIsXG4gICAgXCJUaGUgbnVtYmVyIG9mIGRheXMgbXVzdCBiZSBhdCBsZWFzdCAxLlwiOlxuICAgICAgICBcIlRoZSBudW1iZXIgb2YgZGF5cyBtdXN0IGJlIGF0IGxlYXN0IDEuXCIsXG4gICAgXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG51bWJlci5cIjogXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG51bWJlci5cIixcbiAgICBBbGdvcml0aG06IFwiQWxnb3JpdGhtXCIsXG4gICAgXCJCYXNlIGVhc2VcIjogXCJCYXNlIGVhc2VcIixcbiAgICBcIm1pbmltdW0gPSAxMzAsIHByZWZlcnJhYmx5IGFwcHJveGltYXRlbHkgMjUwLlwiOlxuICAgICAgICBcIm1pbmltdW0gPSAxMzAsIHByZWZlcnJhYmx5IGFwcHJveGltYXRlbHkgMjUwLlwiLFxuICAgIFwiVGhlIGJhc2UgZWFzZSBtdXN0IGJlIGF0IGxlYXN0IDEzMC5cIjpcbiAgICAgICAgXCJUaGUgYmFzZSBlYXNlIG11c3QgYmUgYXQgbGVhc3QgMTMwLlwiLFxuICAgIFwiSW50ZXJ2YWwgY2hhbmdlIHdoZW4geW91IHJldmlldyBhIGZsYXNoY2FyZC9ub3RlIGFzIGhhcmRcIjpcbiAgICAgICAgXCJJbnRlcnZhbCBjaGFuZ2Ugd2hlbiB5b3UgcmV2aWV3IGEgZmxhc2hjYXJkL25vdGUgYXMgaGFyZFwiLFxuICAgIFwibmV3SW50ZXJ2YWwgPSBvbGRJbnRlcnZhbCAqIGludGVydmFsQ2hhbmdlIC8gMTAwLlwiOlxuICAgICAgICBcIm5ld0ludGVydmFsID0gb2xkSW50ZXJ2YWwgKiBpbnRlcnZhbENoYW5nZSAvIDEwMC5cIixcbiAgICBcIkVhc3kgYm9udXNcIjogXCJFYXN5IGJvbnVzXCIsXG4gICAgXCJUaGUgZWFzeSBib251cyBhbGxvd3MgeW91IHRvIHNldCB0aGUgZGlmZmVyZW5jZSBpbiBpbnRlcnZhbHMgYmV0d2VlbiBhbnN3ZXJpbmcgR29vZCBhbmQgRWFzeSBvbiBhIGZsYXNoY2FyZC9ub3RlIChtaW5pbXVtID0gMTAwJSkuXCI6XG4gICAgICAgIFwiVGhlIGVhc3kgYm9udXMgYWxsb3dzIHlvdSB0byBzZXQgdGhlIGRpZmZlcmVuY2UgaW4gaW50ZXJ2YWxzIGJldHdlZW4gYW5zd2VyaW5nIEdvb2QgYW5kIEVhc3kgb24gYSBmbGFzaGNhcmQvbm90ZSAobWluaW11bSA9IDEwMCUpLlwiLFxuICAgIFwiVGhlIGVhc3kgYm9udXMgbXVzdCBiZSBhdCBsZWFzdCAxMDAuXCI6XG4gICAgICAgIFwiVGhlIGVhc3kgYm9udXMgbXVzdCBiZSBhdCBsZWFzdCAxMDAuXCIsXG4gICAgXCJNYXhpbXVtIEludGVydmFsXCI6IFwiTWF4aW11bSBJbnRlcnZhbFwiLFxuICAgIFwiQWxsb3dzIHlvdSB0byBwbGFjZSBhbiB1cHBlciBsaW1pdCBvbiB0aGUgaW50ZXJ2YWwgKGRlZmF1bHQgPSAxMDAgeWVhcnMpLlwiOlxuICAgICAgICBcIkFsbG93cyB5b3UgdG8gcGxhY2UgYW4gdXBwZXIgbGltaXQgb24gdGhlIGludGVydmFsIChkZWZhdWx0ID0gMTAwIHllYXJzKS5cIixcbiAgICBcIlRoZSBtYXhpbXVtIGludGVydmFsIG11c3QgYmUgYXQgbGVhc3QgMSBkYXkuXCI6XG4gICAgICAgIFwiVGhlIG1heGltdW0gaW50ZXJ2YWwgbXVzdCBiZSBhdCBsZWFzdCAxIGRheS5cIixcbiAgICBcIk1heGltdW0gbGluayBjb250cmlidXRpb25cIjogXCJNYXhpbXVtIGxpbmsgY29udHJpYnV0aW9uXCIsXG4gICAgXCJNYXhpbXVtIGNvbnRyaWJ1dGlvbiBvZiB0aGUgd2VpZ2h0ZWQgZWFzZSBvZiBsaW5rZWQgbm90ZXMgdG8gdGhlIGluaXRpYWwgZWFzZS5cIjpcbiAgICAgICAgXCJNYXhpbXVtIGNvbnRyaWJ1dGlvbiBvZiB0aGUgd2VpZ2h0ZWQgZWFzZSBvZiBsaW5rZWQgbm90ZXMgdG8gdGhlIGluaXRpYWwgZWFzZS5cIixcblxuICAgIC8vIHNpZGViYXIudHNcbiAgICBOZXc6IFwiTmV3XCIsXG4gICAgWWVzdGVyZGF5OiBcIlllc3RlcmRheVwiLFxuICAgIFRvZGF5OiBcIlRvZGF5XCIsXG4gICAgVG9tb3Jyb3c6IFwiVG9tb3Jyb3dcIixcbiAgICBcIk5vdGVzIFJldmlldyBRdWV1ZVwiOiBcIk5vdGVzIFJldmlldyBRdWV1ZVwiLFxuICAgIENsb3NlOiBcIkNsb3NlXCIsXG5cbiAgICAvLyBzdGF0cy1tb2RhbC50c1xuICAgIFN0YXRpc3RpY3M6IFwiU3RhdGlzdGljc1wiLFxuICAgIFwiTm90ZSB0aGF0IHRoaXMgcmVxdWlyZXMgdGhlIE9ic2lkaWFuIENoYXJ0cyBwbHVnaW4gdG8gd29ya1wiOlxuICAgICAgICBcIk5vdGUgdGhhdCB0aGlzIHJlcXVpcmVzIHRoZSBPYnNpZGlhbiBDaGFydHMgcGx1Z2luIHRvIHdvcmtcIixcbiAgICBGb3JlY2FzdDogXCJGb3JlY2FzdFwiLFxuICAgIFwiVGhlIG51bWJlciBvZiBjYXJkcyBkdWUgaW4gdGhlIGZ1dHVyZVwiOlxuICAgICAgICBcIlRoZSBudW1iZXIgb2YgY2FyZHMgZHVlIGluIHRoZSBmdXR1cmVcIixcbiAgICBcIk51bWJlciBvZiBjYXJkc1wiOiBcIk51bWJlciBvZiBjYXJkc1wiLFxuICAgIFNjaGVkdWxlZDogXCJTY2hlZHVsZWRcIixcbiAgICBSZXZpZXc6IFwiUmV2aWV3XCIsXG4gICAgZHVlOiBcImR1ZVwiLFxuICAgIERheXM6IFwiRGF5c1wiLFxufTtcbiIsIi8vIEJyaXRpc2ggRW5nbGlzaFxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIEVzcGHDsW9sXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gZnJhbsOnYWlzXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g4KS54KS/4KSo4KWN4KSm4KWAXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gQmFoYXNhIEluZG9uZXNpYVxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIEl0YWxpYW5vXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g5pel5pys6KqeXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g7ZWc6rWt7Ja0XG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gTmVkZXJsYW5kc1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIE5vcnNrXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gasSZenlrIHBvbHNraVxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIFBvcnR1Z3XDqnNcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBQb3J0dWd1w6pzIGRvIEJyYXNpbFxuLy8gQnJhemlsaWFuIFBvcnR1Z3Vlc2VcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBSb23Dom7Eg1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vINGA0YPRgdGB0LrQuNC5XG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gVMO8cmvDp2VcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyDnroDkvZPkuK3mlodcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyDnuYHpq5TkuK3mlodcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWdtZXllcnMvb2JzaWRpYW4ta2FuYmFuL2Jsb2IvOTMwMTRjMjUxMjUwN2ZkZTllYWZkMjQxZThkNDM2OGE4ZGZkZjg1My9zcmMvbGFuZy9oZWxwZXJzLnRzXG5cbmltcG9ydCB7IG1vbWVudCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IGFyIGZyb20gXCIuL2xvY2FsZS9hclwiO1xuaW1wb3J0IGN6IGZyb20gXCIuL2xvY2FsZS9jelwiO1xuaW1wb3J0IGRhIGZyb20gXCIuL2xvY2FsZS9kYVwiO1xuaW1wb3J0IGRlIGZyb20gXCIuL2xvY2FsZS9kZVwiO1xuaW1wb3J0IGVuIGZyb20gXCIuL2xvY2FsZS9lblwiO1xuaW1wb3J0IGVuR0IgZnJvbSBcIi4vbG9jYWxlL2VuLWdiXCI7XG5pbXBvcnQgZXMgZnJvbSBcIi4vbG9jYWxlL2VzXCI7XG5pbXBvcnQgZnIgZnJvbSBcIi4vbG9jYWxlL2ZyXCI7XG5pbXBvcnQgaGkgZnJvbSBcIi4vbG9jYWxlL2hpXCI7XG5pbXBvcnQgaWQgZnJvbSBcIi4vbG9jYWxlL2lkXCI7XG5pbXBvcnQgaXQgZnJvbSBcIi4vbG9jYWxlL2l0XCI7XG5pbXBvcnQgamEgZnJvbSBcIi4vbG9jYWxlL2phXCI7XG5pbXBvcnQga28gZnJvbSBcIi4vbG9jYWxlL2tvXCI7XG5pbXBvcnQgbmwgZnJvbSBcIi4vbG9jYWxlL25sXCI7XG5pbXBvcnQgbm8gZnJvbSBcIi4vbG9jYWxlL25vXCI7XG5pbXBvcnQgcGwgZnJvbSBcIi4vbG9jYWxlL3BsXCI7XG5pbXBvcnQgcHQgZnJvbSBcIi4vbG9jYWxlL3B0XCI7XG5pbXBvcnQgcHRCUiBmcm9tIFwiLi9sb2NhbGUvcHQtYnJcIjtcbmltcG9ydCBybyBmcm9tIFwiLi9sb2NhbGUvcm9cIjtcbmltcG9ydCBydSBmcm9tIFwiLi9sb2NhbGUvcnVcIjtcbmltcG9ydCB0ciBmcm9tIFwiLi9sb2NhbGUvdHJcIjtcbmltcG9ydCB6aENOIGZyb20gXCIuL2xvY2FsZS96aC1jblwiO1xuaW1wb3J0IHpoVFcgZnJvbSBcIi4vbG9jYWxlL3poLXR3XCI7XG5cbmNvbnN0IGxvY2FsZU1hcDogeyBbazogc3RyaW5nXTogUGFydGlhbDx0eXBlb2YgZW4+IH0gPSB7XG4gICAgYXIsXG4gICAgY3M6IGN6LFxuICAgIGRhLFxuICAgIGRlLFxuICAgIGVuLFxuICAgIFwiZW4tZ2JcIjogZW5HQixcbiAgICBlcyxcbiAgICBmcixcbiAgICBoaSxcbiAgICBpZCxcbiAgICBpdCxcbiAgICBqYSxcbiAgICBrbyxcbiAgICBubCxcbiAgICBubjogbm8sXG4gICAgcGwsXG4gICAgcHQsXG4gICAgXCJwdC1iclwiOiBwdEJSLFxuICAgIHJvLFxuICAgIHJ1LFxuICAgIHRyLFxuICAgIFwiemgtY25cIjogemhDTixcbiAgICBcInpoLXR3XCI6IHpoVFcsXG59O1xuXG5jb25zdCBsb2NhbGUgPSBsb2NhbGVNYXBbbW9tZW50LmxvY2FsZSgpXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHQoc3RyOiBrZXlvZiB0eXBlb2YgZW4pOiBzdHJpbmcge1xuICAgIGlmICghbG9jYWxlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogU1JTIGxvY2FsZSBub3QgZm91bmRcIiwgbW9tZW50LmxvY2FsZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGxvY2FsZSAmJiBsb2NhbGVbc3RyXSkgfHwgZW5bc3RyXTtcbn1cbiIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgQXBwLCBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgdHlwZSBTUlBsdWdpbiBmcm9tIFwic3JjL21haW5cIjtcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcInNyYy9sb2dnZXJcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwic3JjL2xhbmcvaGVscGVyc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNSU2V0dGluZ3Mge1xuICAgIC8vIGZsYXNoY2FyZHNcbiAgICBmbGFzaGNhcmRUYWdzOiBzdHJpbmdbXTtcbiAgICBjb252ZXJ0Rm9sZGVyc1RvRGVja3M6IGJvb2xlYW47XG4gICAgY2FyZENvbW1lbnRPblNhbWVMaW5lOiBib29sZWFuO1xuICAgIGJ1cnlTaWJsaW5nQ2FyZHM6IGJvb2xlYW47XG4gICAgc2hvd0NvbnRleHRJbkNhcmRzOiBib29sZWFuO1xuICAgIGZsYXNoY2FyZEhlaWdodFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgICBmbGFzaGNhcmRXaWR0aFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgICBzaG93RmlsZU5hbWVJbkZpbGVMaW5rOiBib29sZWFuO1xuICAgIHJhbmRvbWl6ZUNhcmRPcmRlcjogYm9vbGVhbjtcbiAgICBkaXNhYmxlQ2xvemVDYXJkczogYm9vbGVhbjtcbiAgICBzaW5nbGVsaW5lQ2FyZFNlcGFyYXRvcjogc3RyaW5nO1xuICAgIHNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3I6IHN0cmluZztcbiAgICBtdWx0aWxpbmVDYXJkU2VwYXJhdG9yOiBzdHJpbmc7XG4gICAgbXVsdGlsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yOiBzdHJpbmc7XG4gICAgLy8gbm90ZXNcbiAgICB0YWdzVG9SZXZpZXc6IHN0cmluZ1tdO1xuICAgIG9wZW5SYW5kb21Ob3RlOiBib29sZWFuO1xuICAgIGF1dG9OZXh0Tm90ZTogYm9vbGVhbjtcbiAgICBkaXNhYmxlRmlsZU1lbnVSZXZpZXdPcHRpb25zOiBib29sZWFuO1xuICAgIG1heE5EYXlzTm90ZXNSZXZpZXdRdWV1ZTogbnVtYmVyO1xuICAgIC8vIGFsZ29yaXRobVxuICAgIGJhc2VFYXNlOiBudW1iZXI7XG4gICAgbGFwc2VzSW50ZXJ2YWxDaGFuZ2U6IG51bWJlcjtcbiAgICBlYXN5Qm9udXM6IG51bWJlcjtcbiAgICBtYXhpbXVtSW50ZXJ2YWw6IG51bWJlcjtcbiAgICBtYXhMaW5rRmFjdG9yOiBudW1iZXI7XG4gICAgLy8gbG9nZ2luZ1xuICAgIGxvZ0xldmVsOiBMb2dMZXZlbDtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNSU2V0dGluZ3MgPSB7XG4gICAgLy8gZmxhc2hjYXJkc1xuICAgIGZsYXNoY2FyZFRhZ3M6IFtcIiNmbGFzaGNhcmRzXCJdLFxuICAgIGNvbnZlcnRGb2xkZXJzVG9EZWNrczogZmFsc2UsXG4gICAgY2FyZENvbW1lbnRPblNhbWVMaW5lOiBmYWxzZSxcbiAgICBidXJ5U2libGluZ0NhcmRzOiBmYWxzZSxcbiAgICBzaG93Q29udGV4dEluQ2FyZHM6IHRydWUsXG4gICAgZmxhc2hjYXJkSGVpZ2h0UGVyY2VudGFnZTogUGxhdGZvcm0uaXNEZXNrdG9wID8gODAgOiAxMDAsXG4gICAgZmxhc2hjYXJkV2lkdGhQZXJjZW50YWdlOiBQbGF0Zm9ybS5pc0Rlc2t0b3AgPyA0MCA6IDEwMCxcbiAgICBzaG93RmlsZU5hbWVJbkZpbGVMaW5rOiBmYWxzZSxcbiAgICByYW5kb21pemVDYXJkT3JkZXI6IHRydWUsXG4gICAgZGlzYWJsZUNsb3plQ2FyZHM6IGZhbHNlLFxuICAgIHNpbmdsZWxpbmVDYXJkU2VwYXJhdG9yOiBcIjo6XCIsXG4gICAgc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcjogXCI6OjpcIixcbiAgICBtdWx0aWxpbmVDYXJkU2VwYXJhdG9yOiBcIj9cIixcbiAgICBtdWx0aWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3I6IFwiPz9cIixcbiAgICAvLyBub3Rlc1xuICAgIHRhZ3NUb1JldmlldzogW1wiI3Jldmlld1wiXSxcbiAgICBvcGVuUmFuZG9tTm90ZTogZmFsc2UsXG4gICAgYXV0b05leHROb3RlOiBmYWxzZSxcbiAgICBkaXNhYmxlRmlsZU1lbnVSZXZpZXdPcHRpb25zOiBmYWxzZSxcbiAgICBtYXhORGF5c05vdGVzUmV2aWV3UXVldWU6IDM2NSxcbiAgICAvLyBhbGdvcml0aG1cbiAgICBiYXNlRWFzZTogMjUwLFxuICAgIGxhcHNlc0ludGVydmFsQ2hhbmdlOiAwLjUsXG4gICAgZWFzeUJvbnVzOiAxLjMsXG4gICAgbWF4aW11bUludGVydmFsOiAzNjUyNSxcbiAgICBtYXhMaW5rRmFjdG9yOiAxLjAsXG4gICAgLy8gbG9nZ2luZ1xuICAgIGxvZ0xldmVsOiBMb2dMZXZlbC5XYXJuLFxufTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21nbWV5ZXJzL29ic2lkaWFuLWthbmJhbi9ibG9iL21haW4vc3JjL1NldHRpbmdzLnRzXG5sZXQgYXBwbHlEZWJvdW5jZVRpbWVyOiBudW1iZXIgPSAwO1xuZnVuY3Rpb24gYXBwbHlTZXR0aW5nc1VwZGF0ZShjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICBjbGVhclRpbWVvdXQoYXBwbHlEZWJvdW5jZVRpbWVyKTtcbiAgICBhcHBseURlYm91bmNlVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgNTEyKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNSU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIHByaXZhdGUgcGx1Z2luOiBTUlBsdWdpbjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFNSUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgfVxuXG4gICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoKS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgXCI8aDI+XCIgKyB0KFwiU3BhY2VkIFJlcGV0aXRpb24gUGx1Z2luIC0gU2V0dGluZ3NcIikgKyBcIjwvaDI+XCI7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KCkuaW5uZXJIVE1MID1cbiAgICAgICAgICAgIHQoXCJGb3IgbW9yZSBpbmZvcm1hdGlvbiwgY2hlY2sgdGhlXCIpICtcbiAgICAgICAgICAgICcgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdDN2M25tdy9vYnNpZGlhbi1zcGFjZWQtcmVwZXRpdGlvbi93aWtpXCI+JyArXG4gICAgICAgICAgICB0KFwid2lraVwiKSArXG4gICAgICAgICAgICBcIjwvYT4uXCI7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KCkuaW5uZXJIVE1MID0gXCI8aDM+XCIgKyB0KFwiRmxhc2hjYXJkc1wiKSArIFwiPC9oMz5cIjtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJGbGFzaGNhcmQgdGFnc1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiRW50ZXIgdGFncyBzZXBhcmF0ZWQgYnkgc3BhY2VzIG9yIG5ld2xpbmVzIGkuZS4gI2ZsYXNoY2FyZHMgI2RlY2syICNkZWNrMy5cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUZXh0QXJlYSgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmZsYXNoY2FyZFRhZ3Muam9pbihcIiBcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5U2V0dGluZ3NVcGRhdGUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZmxhc2hjYXJkVGFncyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJDb252ZXJ0IGZvbGRlcnMgdG8gZGVja3MgYW5kIHN1YmRlY2tzP1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXCJUaGlzIGlzIGFuIGFsdGVybmF0aXZlIHRvIHRoZSBGbGFzaGNhcmQgdGFncyBvcHRpb24gYWJvdmUuXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmNvbnZlcnRGb2xkZXJzVG9EZWNrcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5jb252ZXJ0Rm9sZGVyc1RvRGVja3MgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXG4gICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgXCJTYXZlIHNjaGVkdWxpbmcgY29tbWVudCBvbiB0aGUgc2FtZSBsaW5lIGFzIHRoZSBmbGFzaGNhcmQncyBsYXN0IGxpbmU/XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBcIlR1cm5pbmcgdGhpcyBvbiB3aWxsIG1ha2UgdGhlIEhUTUwgY29tbWVudHMgbm90IGJyZWFrIGxpc3QgZm9ybWF0dGluZy5cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuY2FyZENvbW1lbnRPblNhbWVMaW5lKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmNhcmRDb21tZW50T25TYW1lTGluZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiQnVyeSBzaWJsaW5nIGNhcmRzIHVudGlsIHRoZSBuZXh0IGRheT9cIikpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBcIlNpYmxpbmdzIGFyZSBjYXJkcyBnZW5lcmF0ZWQgZnJvbSB0aGUgc2FtZSBjYXJkIHRleHQgaS5lLiBjbG96ZSBkZWxldGlvbnNcIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYnVyeVNpYmxpbmdDYXJkcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5idXJ5U2libGluZ0NhcmRzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJTaG93IGNvbnRleHQgaW4gY2FyZHM/XCIpKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcImkuZS4gVGl0bGUgPiBIZWFkaW5nIDEgPiBTdWJoZWFkaW5nID4gLi4uID4gU3ViaGVhZGluZ1wiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaG93Q29udGV4dEluQ2FyZHMpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2hvd0NvbnRleHRJbkNhcmRzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJGbGFzaGNhcmQgSGVpZ2h0IFBlcmNlbnRhZ2VcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBcIltEZXNrdG9wXSBTaG91bGQgYmUgc2V0IHRvIDEwMCUgaWYgeW91IGhhdmUgdmVyeSBsYXJnZSBpbWFnZXNcIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT5cbiAgICAgICAgICAgICAgICBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgLnNldExpbWl0cygxMCwgMTAwLCA1KVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmZsYXNoY2FyZEhlaWdodFBlcmNlbnRhZ2VcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmZsYXNoY2FyZEhlaWdodFBlcmNlbnRhZ2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZmxhc2hjYXJkSGVpZ2h0UGVyY2VudGFnZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5mbGFzaGNhcmRIZWlnaHRQZXJjZW50YWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIkZsYXNoY2FyZCBXaWR0aCBQZXJjZW50YWdlXCIpKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgXCJbRGVza3RvcF0gU2hvdWxkIGJlIHNldCB0byAxMDAlIGlmIHlvdSBoYXZlIHZlcnkgbGFyZ2UgaW1hZ2VzXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+XG4gICAgICAgICAgICAgICAgc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMTAsIDEwMCwgNSlcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRXaWR0aFBlcmNlbnRhZ2VcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmZsYXNoY2FyZFdpZHRoUGVyY2VudGFnZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRXaWR0aFBlcmNlbnRhZ2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1MuZmxhc2hjYXJkV2lkdGhQZXJjZW50YWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXG4gICAgICAgICAgICAgICAgdChcIlNob3cgZmlsZSBuYW1lIGluc3RlYWQgb2YgJ09wZW4gZmlsZScgaW4gZmxhc2hjYXJkIHJldmlldz9cIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2hvd0ZpbGVOYW1lSW5GaWxlTGluaylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaG93RmlsZU5hbWVJbkZpbGVMaW5rID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIlJhbmRvbWl6ZSBjYXJkIG9yZGVyIGR1cmluZyByZXZpZXc/XCIpKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5yYW5kb21pemVDYXJkT3JkZXIpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MucmFuZG9taXplQ2FyZE9yZGVyID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJEaXNhYmxlIGNsb3plIGNhcmRzP1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiSWYgeW91J3JlIG5vdCBjdXJyZW50bHkgdXNpbmcgJ2VtICYgd291bGQgbGlrZSB0aGUgcGx1Z2luIHRvIHJ1biBhIHRhZCBmYXN0ZXIuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmRpc2FibGVDbG96ZUNhcmRzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmRpc2FibGVDbG96ZUNhcmRzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJTZXBhcmF0b3IgZm9yIGlubGluZSBmbGFzaGNhcmRzXCIpKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgXCJOb3RlIHRoYXQgYWZ0ZXIgY2hhbmdpbmcgdGhpcyB5b3UgaGF2ZSB0byBtYW51YWxseSBlZGl0IGFueSBmbGFzaGNhcmRzIHlvdSBhbHJlYWR5IGhhdmUuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNpbmdsZWxpbmVDYXJkU2VwYXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBseVNldHRpbmdzVXBkYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNpbmdsZWxpbmVDYXJkU2VwYXJhdG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaW5nbGVsaW5lQ2FyZFNlcGFyYXRvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5zaW5nbGVsaW5lQ2FyZFNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJTZXBhcmF0b3IgZm9yIGlubGluZSByZXZlcnNlZCBmbGFzaGNhcmRzXCIpKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgXCJOb3RlIHRoYXQgYWZ0ZXIgY2hhbmdpbmcgdGhpcyB5b3UgaGF2ZSB0byBtYW51YWxseSBlZGl0IGFueSBmbGFzaGNhcmRzIHlvdSBhbHJlYWR5IGhhdmUuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvclxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5U2V0dGluZ3NVcGRhdGUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5zaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIlNlcGFyYXRvciBmb3IgbXVsdGlsaW5lIGZsYXNoY2FyZHNcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBcIk5vdGUgdGhhdCBhZnRlciBjaGFuZ2luZyB0aGlzIHlvdSBoYXZlIHRvIG1hbnVhbGx5IGVkaXQgYW55IGZsYXNoY2FyZHMgeW91IGFscmVhZHkgaGF2ZS5cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lQ2FyZFNlcGFyYXRvcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlTZXR0aW5nc1VwZGF0ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVDYXJkU2VwYXJhdG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVDYXJkU2VwYXJhdG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX1NFVFRJTkdTLm11bHRpbGluZUNhcmRTZXBhcmF0b3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiU2VwYXJhdG9yIGZvciBtdWx0aWxpbmUgcmV2ZXJzZWQgZmxhc2hjYXJkc1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiTm90ZSB0aGF0IGFmdGVyIGNoYW5naW5nIHRoaXMgeW91IGhhdmUgdG8gbWFudWFsbHkgZWRpdCBhbnkgZmxhc2hjYXJkcyB5b3UgYWxyZWFkeSBoYXZlLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvclxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5U2V0dGluZ3NVcGRhdGUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1MubXVsdGlsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdigpLmlubmVySFRNTCA9IFwiPGgzPlwiICsgdChcIk5vdGVzXCIpICsgXCI8L2gzPlwiO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIlRhZ3MgdG8gcmV2aWV3XCIpKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgXCJFbnRlciB0YWdzIHNlcGFyYXRlZCBieSBzcGFjZXMgb3IgbmV3bGluZXMgaS5lLiAjcmV2aWV3ICN0YWcyICN0YWczLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHRBcmVhKCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MudGFnc1RvUmV2aWV3LmpvaW4oXCIgXCIpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBseVNldHRpbmdzVXBkYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnRhZ3NUb1JldmlldyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJPcGVuIGEgcmFuZG9tIG5vdGUgZm9yIHJldmlld1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiV2hlbiB5b3UgdHVybiB0aGlzIG9mZiwgbm90ZXMgYXJlIG9yZGVyZWQgYnkgaW1wb3J0YW5jZSAoUGFnZVJhbmspLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5vcGVuUmFuZG9tTm90ZSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5vcGVuUmFuZG9tTm90ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiT3BlbiBuZXh0IG5vdGUgYXV0b21hdGljYWxseSBhZnRlciBhIHJldmlld1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKHQoXCJGb3IgZmFzdGVyIHJldmlld3MuXCIpKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5hdXRvTmV4dE5vdGUpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYXV0b05leHROb3RlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiRGlzYWJsZSByZXZpZXcgb3B0aW9ucyBpbiB0aGUgZmlsZSBtZW51IGkuZS4gUmV2aWV3OiBFYXN5IEdvb2QgSGFyZFwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgXCJBZnRlciBkaXNhYmxpbmcsIHlvdSBjYW4gcmV2aWV3IHVzaW5nIHRoZSBjb21tYW5kIGhvdGtleXMuIFJlbG9hZCBPYnNpZGlhbiBhZnRlciBjaGFuZ2luZyB0aGlzLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmRpc2FibGVGaWxlTWVudVJldmlld09wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmRpc2FibGVGaWxlTWVudVJldmlld09wdGlvbnMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiTWF4aW11bSBudW1iZXIgb2YgZGF5cyB0byBkaXNwbGF5IG9uIHJpZ2h0IHBhbmVsXCIpKVxuICAgICAgICAgICAgLnNldERlc2ModChcIlJlZHVjZSB0aGlzIGZvciBhIGNsZWFuZXIgaW50ZXJmYWNlLlwiKSlcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhORGF5c05vdGVzUmV2aWV3UXVldWUudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5U2V0dGluZ3NVcGRhdGUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBudW1WYWx1ZTogbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG51bVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtVmFsdWUgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhlIG51bWJlciBvZiBkYXlzIG11c3QgYmUgYXQgbGVhc3QgMS5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4TkRheXNOb3Rlc1Jldmlld1F1ZXVlLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heE5EYXlzTm90ZXNSZXZpZXdRdWV1ZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHQoXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG51bWJlci5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhORGF5c05vdGVzUmV2aWV3UXVldWUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1MubWF4TkRheXNOb3Rlc1Jldmlld1F1ZXVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdigpLmlubmVySFRNTCA9IFwiPGgzPlwiICsgdChcIkFsZ29yaXRobVwiKSArIFwiPC9oMz5cIjtcblxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoKS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgdChcIkZvciBtb3JlIGluZm9ybWF0aW9uLCBjaGVjayB0aGVcIikgK1xuICAgICAgICAgICAgJyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N0M3Yzbm13L29ic2lkaWFuLXNwYWNlZC1yZXBldGl0aW9uL3dpa2kvU3BhY2VkLVJlcGV0aXRpb24tQWxnb3JpdGhtXCI+JyArXG4gICAgICAgICAgICB0KFwiYWxnb3JpdGhtIGltcGxlbWVudGF0aW9uXCIpICtcbiAgICAgICAgICAgIFwiPC9hPi5cIjtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJCYXNlIGVhc2VcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwibWluaW11bSA9IDEzMCwgcHJlZmVycmFibHkgYXBwcm94aW1hdGVseSAyNTAuXCIpKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5iYXNlRWFzZS50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBseVNldHRpbmdzVXBkYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbnVtVmFsdWU6IG51bWJlciA9IE51bWJlci5wYXJzZUludCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1WYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bVZhbHVlIDwgMTMwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQoXCJUaGUgYmFzZSBlYXNlIG11c3QgYmUgYXQgbGVhc3QgMTMwLlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5iYXNlRWFzZS50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5iYXNlRWFzZSA9IG51bVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodChcIlBsZWFzZSBwcm92aWRlIGEgdmFsaWQgbnVtYmVyLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInJlc2V0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHQoXCJSZXNldCB0byBkZWZhdWx0XCIpKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmJhc2VFYXNlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX1NFVFRJTkdTLmJhc2VFYXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXG4gICAgICAgICAgICAgICAgdChcIkludGVydmFsIGNoYW5nZSB3aGVuIHlvdSByZXZpZXcgYSBmbGFzaGNhcmQvbm90ZSBhcyBoYXJkXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwibmV3SW50ZXJ2YWwgPSBvbGRJbnRlcnZhbCAqIGludGVydmFsQ2hhbmdlIC8gMTAwLlwiKSlcbiAgICAgICAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT5cbiAgICAgICAgICAgICAgICBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgLnNldExpbWl0cygxLCA5OSwgMSlcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5sYXBzZXNJbnRlcnZhbENoYW5nZSAqIDEwMFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWU6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5sYXBzZXNJbnRlcnZhbENoYW5nZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubGFwc2VzSW50ZXJ2YWxDaGFuZ2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1MubGFwc2VzSW50ZXJ2YWxDaGFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiRWFzeSBib251c1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiVGhlIGVhc3kgYm9udXMgYWxsb3dzIHlvdSB0byBzZXQgdGhlIGRpZmZlcmVuY2UgaW4gaW50ZXJ2YWxzIGJldHdlZW4gYW5zd2VyaW5nIEdvb2QgYW5kIEVhc3kgb24gYSBmbGFzaGNhcmQvbm90ZSAobWluaW11bSA9IDEwMCUpLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5lYXN5Qm9udXMgKiAxMDApLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBseVNldHRpbmdzVXBkYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbnVtVmFsdWU6IG51bWJlciA9IE51bWJlci5wYXJzZUludCh2YWx1ZSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1WYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bVZhbHVlIDwgMS4wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhlIGVhc3kgYm9udXMgbXVzdCBiZSBhdCBsZWFzdCAxMDAuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lYXN5Qm9udXMgKiAxMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmVhc3lCb251cyA9IG51bVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodChcIlBsZWFzZSBwcm92aWRlIGEgdmFsaWQgbnVtYmVyLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInJlc2V0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHQoXCJSZXNldCB0byBkZWZhdWx0XCIpKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmVhc3lCb251cyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5lYXN5Qm9udXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiTWF4aW11bSBJbnRlcnZhbFwiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiQWxsb3dzIHlvdSB0byBwbGFjZSBhbiB1cHBlciBsaW1pdCBvbiB0aGUgaW50ZXJ2YWwgKGRlZmF1bHQgPSAxMDAgeWVhcnMpLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heGltdW1JbnRlcnZhbC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlTZXR0aW5nc1VwZGF0ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG51bVZhbHVlOiBudW1iZXIgPSBOdW1iZXIucGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4obnVtVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1WYWx1ZSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUaGUgbWF4aW11bSBpbnRlcnZhbCBtdXN0IGJlIGF0IGxlYXN0IDEgZGF5LlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhpbXVtSW50ZXJ2YWwudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4aW11bUludGVydmFsID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodChcIlBsZWFzZSBwcm92aWRlIGEgdmFsaWQgbnVtYmVyLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInJlc2V0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHQoXCJSZXNldCB0byBkZWZhdWx0XCIpKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heGltdW1JbnRlcnZhbCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5tYXhpbXVtSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiTWF4aW11bSBsaW5rIGNvbnRyaWJ1dGlvblwiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBjb250cmlidXRpb24gb2YgdGhlIHdlaWdodGVkIGVhc2Ugb2YgbGlua2VkIG5vdGVzIHRvIHRoZSBpbml0aWFsIGVhc2UuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+XG4gICAgICAgICAgICAgICAgc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMCwgMTAwLCAxKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhMaW5rRmFjdG9yICogMTAwKVxuICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4TGlua0ZhY3RvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4TGlua0ZhY3RvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5tYXhMaW5rRmFjdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IFNSU2V0dGluZ3MgfSBmcm9tIFwic3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBDYXJkVHlwZSB9IGZyb20gXCJzcmMvdHlwZXNcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwic3JjL2xhbmcvaGVscGVyc1wiO1xuXG5leHBvcnQgZW51bSBSZXZpZXdSZXNwb25zZSB7XG4gICAgRWFzeSxcbiAgICBHb29kLFxuICAgIEhhcmQsXG4gICAgUmVzZXQsXG59XG5cbi8vIEZsYXNoY2FyZHNcblxuZXhwb3J0IGludGVyZmFjZSBDYXJkIHtcbiAgICAvLyBzY2hlZHVsaW5nXG4gICAgaXNEdWU6IGJvb2xlYW47XG4gICAgaW50ZXJ2YWw/OiBudW1iZXI7XG4gICAgZWFzZT86IG51bWJlcjtcbiAgICBkZWxheUJlZm9yZVJldmlldz86IG51bWJlcjtcbiAgICAvLyBub3RlXG4gICAgbm90ZTogVEZpbGU7XG4gICAgbGluZU5vOiBudW1iZXI7XG4gICAgLy8gdmlzdWFsc1xuICAgIGZyb250OiBzdHJpbmc7XG4gICAgYmFjazogc3RyaW5nO1xuICAgIGNhcmRUZXh0OiBzdHJpbmc7XG4gICAgY29udGV4dDogc3RyaW5nO1xuICAgIC8vIHR5cGVzXG4gICAgY2FyZFR5cGU6IENhcmRUeXBlO1xuICAgIC8vIGluZm9ybWF0aW9uIGZvciBzaWJsaW5nIGNhcmRzXG4gICAgc2libGluZ0lkeDogbnVtYmVyO1xuICAgIHNpYmxpbmdzOiBDYXJkW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZShcbiAgICByZXNwb25zZTogUmV2aWV3UmVzcG9uc2UsXG4gICAgaW50ZXJ2YWw6IG51bWJlcixcbiAgICBlYXNlOiBudW1iZXIsXG4gICAgZGVsYXlCZWZvcmVSZXZpZXc6IG51bWJlcixcbiAgICBzZXR0aW5nc09iajogU1JTZXR0aW5ncyxcbiAgICBkdWVEYXRlcz86IFJlY29yZDxudW1iZXIsIG51bWJlcj5cbik6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4ge1xuICAgIGRlbGF5QmVmb3JlUmV2aWV3ID0gTWF0aC5tYXgoXG4gICAgICAgIDAsXG4gICAgICAgIE1hdGguZmxvb3IoZGVsYXlCZWZvcmVSZXZpZXcgLyAoMjQgKiAzNjAwICogMTAwMCkpXG4gICAgKTtcblxuICAgIGlmIChyZXNwb25zZSA9PT0gUmV2aWV3UmVzcG9uc2UuRWFzeSkge1xuICAgICAgICBlYXNlICs9IDIwO1xuICAgICAgICBpbnRlcnZhbCA9ICgoaW50ZXJ2YWwgKyBkZWxheUJlZm9yZVJldmlldykgKiBlYXNlKSAvIDEwMDtcbiAgICAgICAgaW50ZXJ2YWwgKj0gc2V0dGluZ3NPYmouZWFzeUJvbnVzO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgPT09IFJldmlld1Jlc3BvbnNlLkdvb2QpXG4gICAgICAgIGludGVydmFsID0gKChpbnRlcnZhbCArIGRlbGF5QmVmb3JlUmV2aWV3IC8gMikgKiBlYXNlKSAvIDEwMDtcbiAgICBlbHNlIGlmIChyZXNwb25zZSA9PT0gUmV2aWV3UmVzcG9uc2UuSGFyZCkge1xuICAgICAgICBlYXNlID0gTWF0aC5tYXgoMTMwLCBlYXNlIC0gMjApO1xuICAgICAgICBpbnRlcnZhbCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIChpbnRlcnZhbCArIGRlbGF5QmVmb3JlUmV2aWV3IC8gNCkgKlxuICAgICAgICAgICAgICAgIHNldHRpbmdzT2JqLmxhcHNlc0ludGVydmFsQ2hhbmdlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gcmVwbGFjZXMgcmFuZG9tIGZ1enogd2l0aCBsb2FkIGJhbGFuY2luZyBvdmVyIHRoZSBmdXp6IGludGVydmFsXG4gICAgaWYgKGR1ZURhdGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaW50ZXJ2YWwgPSBNYXRoLnJvdW5kKGludGVydmFsKTtcbiAgICAgICAgaWYgKCFkdWVEYXRlcy5oYXNPd25Qcm9wZXJ0eShpbnRlcnZhbCkpIGR1ZURhdGVzW2ludGVydmFsXSA9IDA7XG5cbiAgICAgICAgbGV0IGZ1enpSYW5nZTogW251bWJlciwgbnVtYmVyXTtcbiAgICAgICAgLy8gZGlzYWJsZSBmdXp6aW5nIGZvciBzbWFsbCBpbnRlcnZhbHNcbiAgICAgICAgaWYgKGludGVydmFsIDw9IDQpIGZ1enpSYW5nZSA9IFtpbnRlcnZhbCwgaW50ZXJ2YWxdO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmdXp6OiBudW1iZXI7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPCA3KSBmdXp6ID0gMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGludGVydmFsIDwgMzApXG4gICAgICAgICAgICAgICAgZnV6eiA9IE1hdGgubWF4KDIsIE1hdGguZmxvb3IoaW50ZXJ2YWwgKiAwLjE1KSk7XG4gICAgICAgICAgICBlbHNlIGZ1enogPSBNYXRoLm1heCg0LCBNYXRoLmZsb29yKGludGVydmFsICogMC4wNSkpO1xuICAgICAgICAgICAgZnV6elJhbmdlID0gW2ludGVydmFsIC0gZnV6eiwgaW50ZXJ2YWwgKyBmdXp6XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGl2bCA9IGZ1enpSYW5nZVswXTsgaXZsIDw9IGZ1enpSYW5nZVsxXTsgaXZsKyspIHtcbiAgICAgICAgICAgIGlmICghZHVlRGF0ZXMuaGFzT3duUHJvcGVydHkoaXZsKSkgZHVlRGF0ZXNbaXZsXSA9IDA7XG4gICAgICAgICAgICBpZiAoZHVlRGF0ZXNbaXZsXSA8IGR1ZURhdGVzW2ludGVydmFsXSkgaW50ZXJ2YWwgPSBpdmw7XG4gICAgICAgIH1cblxuICAgICAgICBkdWVEYXRlc1tpbnRlcnZhbF0rKztcbiAgICB9XG5cbiAgICBpbnRlcnZhbCA9IE1hdGgubWluKGludGVydmFsLCBzZXR0aW5nc09iai5tYXhpbXVtSW50ZXJ2YWwpO1xuXG4gICAgcmV0dXJuIHsgaW50ZXJ2YWw6IE1hdGgucm91bmQoaW50ZXJ2YWwgKiAxMCkgLyAxMCwgZWFzZSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dEludGVydmFsKGludGVydmFsOiBudW1iZXIsIGlzTW9iaWxlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBsZXQgbTogbnVtYmVyID0gTWF0aC5yb3VuZChpbnRlcnZhbCAvIDMpIC8gMTAsXG4gICAgICAgIHk6IG51bWJlciA9IE1hdGgucm91bmQoaW50ZXJ2YWwgLyAzNi41KSAvIDEwO1xuXG4gICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIGlmIChpbnRlcnZhbCA8IDMwKSByZXR1cm4gYCR7aW50ZXJ2YWx9ZGA7XG4gICAgICAgIGVsc2UgaWYgKGludGVydmFsIDwgMzY1KSByZXR1cm4gYCR7bX1tYDtcbiAgICAgICAgZWxzZSByZXR1cm4gYCR7eX15YDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW50ZXJ2YWwgPCAzMClcbiAgICAgICAgICAgIHJldHVybiBpbnRlcnZhbCA9PT0gMS4wXG4gICAgICAgICAgICAgICAgPyBcIjEuMCBcIiArIHQoXCJkYXlcIilcbiAgICAgICAgICAgICAgICA6IGludGVydmFsLnRvU3RyaW5nKCkgKyBcIiBcIiArIHQoXCJkYXlzXCIpO1xuICAgICAgICBlbHNlIGlmIChpbnRlcnZhbCA8IDM2NSlcbiAgICAgICAgICAgIHJldHVybiBtID09PSAxLjBcbiAgICAgICAgICAgICAgICA/IFwiMS4wIFwiICsgdChcIm1vbnRoXCIpXG4gICAgICAgICAgICAgICAgOiBtLnRvU3RyaW5nKCkgKyBcIiBcIiArIHQoXCJtb250aHNcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB5ID09PSAxLjBcbiAgICAgICAgICAgICAgICA/IFwiMS4wIFwiICsgdChcInllYXJcIilcbiAgICAgICAgICAgICAgICA6IHkudG9TdHJpbmcoKSArIFwiIFwiICsgdChcInllYXJzXCIpO1xuICAgIH1cbn1cbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9vYnNpZGlhbm1kL29ic2lkaWFuLWFwaS9pc3N1ZXMvMTNcblxuLy8gZmxhc2hjYXJkc1xuXG5leHBvcnQgZW51bSBDYXJkVHlwZSB7XG4gICAgU2luZ2xlTGluZUJhc2ljLFxuICAgIFNpbmdsZUxpbmVSZXZlcnNlZCxcbiAgICBNdWx0aUxpbmVCYXNpYyxcbiAgICBNdWx0aUxpbmVSZXZlcnNlZCxcbiAgICBDbG96ZSxcbn1cbiIsImV4cG9ydCBjb25zdCBTQ0hFRFVMSU5HX0lORk9fUkVHRVg6IFJlZ0V4cCA9XG4gICAgL14tLS1cXG4oKD86LipcXG4pKilzci1kdWU6ICguKylcXG5zci1pbnRlcnZhbDogKFxcZCspXFxuc3ItZWFzZTogKFxcZCspXFxuKCg/Oi4qXFxuKSopLS0tLztcbmV4cG9ydCBjb25zdCBZQU1MX0ZST05UX01BVFRFUl9SRUdFWDogUmVnRXhwID0gL14tLS1cXG4oKD86LipcXG4pKj8pLS0tLztcblxuZXhwb3J0IGNvbnN0IE1VTFRJX1NDSEVEVUxJTkdfRVhUUkFDVE9SOiBSZWdFeHAgPSAvIShbXFxkLV0rKSwoXFxkKyksKFxcZCspL2dtO1xuZXhwb3J0IGNvbnN0IExFR0FDWV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUjogUmVnRXhwID1cbiAgICAvPCEtLVNSOihbXFxkLV0rKSwoXFxkKyksKFxcZCspLS0+L2dtO1xuXG5leHBvcnQgY29uc3QgQ1JPU1NfSEFJUlNfSUNPTjogc3RyaW5nID0gYDxwYXRoIHN0eWxlPVwiIHN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6Y3VycmVudENvbG9yO2ZpbGwtb3BhY2l0eToxO1wiIGQ9XCJNIDk5LjkyMTg3NSA0Ny45NDE0MDYgTCA5My4wNzQyMTkgNDcuOTQxNDA2IEMgOTIuODQzNzUgNDIuMDMxMjUgOTEuMzkwNjI1IDM2LjIzODI4MSA4OC44MDA3ODEgMzAuOTIxODc1IEwgODUuMzY3MTg4IDMyLjU4MjAzMSBDIDg3LjY2Nzk2OSAzNy4zNTU0NjkgODguOTY0ODQ0IDQyLjU1MDc4MSA4OS4xODM1OTQgNDcuODQzNzUgTCA4Mi4yMzgyODEgNDcuODQzNzUgQyA4Mi4wOTc2NTYgNDQuNjE3MTg4IDgxLjU4OTg0NCA0MS40MTc5NjkgODAuNzM0Mzc1IDM4LjMwNDY4OCBMIDc3LjA1MDc4MSAzOS4zMzU5MzggQyA3Ny44MDg1OTQgNDIuMDg5ODQ0IDc4LjI2MTcxOSA0NC45MTc5NjkgNzguNDA2MjUgNDcuNzY5NTMxIEwgNjUuODcxMDk0IDQ3Ljc2OTUzMSBDIDY0LjkxNDA2MiA0MC41MDc4MTIgNTkuMTQ0NTMxIDM0LjgzMjAzMSA1MS44NzEwOTQgMzMuOTk2MDk0IEwgNTEuODcxMDk0IDIxLjM4NjcxOSBDIDU0LjgxNjQwNiAyMS41MDc4MTIgNTcuNzQyMTg4IDIxLjk2MDkzOCA2MC41ODU5MzggMjIuNzM4MjgxIEwgNjEuNjE3MTg4IDE5LjA1ODU5NCBDIDU4LjQzNzUgMTguMTkxNDA2IDU1LjE2NDA2MiAxNy42OTE0MDYgNTEuODcxMDk0IDE3LjU3MDMxMiBMIDUxLjg3MTA5NCAxMC41NTA3ODEgQyA1Ny4xNjQwNjIgMTAuNzY5NTMxIDYyLjM1NTQ2OSAxMi4wNjY0MDYgNjcuMTMyODEyIDE0LjM2MzI4MSBMIDY4Ljc4OTA2MiAxMC45Mjk2ODggQyA2My41IDguMzgyODEyIDU3LjczODI4MSA2Ljk1MzEyNSA1MS44NzEwOTQgNi43MzQzNzUgTCA1MS44NzEwOTQgMC4wMzkwNjI1IEwgNDguMDU0Njg4IDAuMDM5MDYyNSBMIDQ4LjA1NDY4OCA2LjczNDM3NSBDIDQyLjE3OTY4OCA2Ljk3NjU2MiAzNi40MTc5NjkgOC40MzM1OTQgMzEuMTMyODEyIDExLjAwNzgxMiBMIDMyLjc5Mjk2OSAxNC40NDE0MDYgQyAzNy41NjY0MDYgMTIuMTQwNjI1IDQyLjc2MTcxOSAxMC44NDM3NSA0OC4wNTQ2ODggMTAuNjI1IEwgNDguMDU0Njg4IDE3LjU3MDMxMiBDIDQ0LjgyODEyNSAxNy43MTQ4NDQgNDEuNjI4OTA2IDE4LjIxODc1IDM4LjUxNTYyNSAxOS4wNzgxMjUgTCAzOS41NDY4NzUgMjIuNzU3ODEyIEMgNDIuMzI0MjE5IDIxLjk4ODI4MSA0NS4xNzU3ODEgMjEuNTMxMjUgNDguMDU0Njg4IDIxLjM4NjcxOSBMIDQ4LjA1NDY4OCAzNC4wMzEyNSBDIDQwLjc5Njg3NSAzNC45NDkyMTkgMzUuMDg5ODQ0IDQwLjY3OTY4OCAzNC4yMDMxMjUgNDcuOTQxNDA2IEwgMjEuNSA0Ny45NDE0MDYgQyAyMS42MzI4MTIgNDUuMDQyOTY5IDIyLjA4OTg0NCA0Mi4xNzE4NzUgMjIuODU1NDY5IDM5LjM3NSBMIDE5LjE3MTg3NSAzOC4zNDM3NSBDIDE4LjMxMjUgNDEuNDU3MDMxIDE3LjgwODU5NCA0NC42NTYyNSAxNy42NjQwNjIgNDcuODgyODEyIEwgMTAuNjY0MDYyIDQ3Ljg4MjgxMiBDIDEwLjg4MjgxMiA0Mi41ODk4NDQgMTIuMTc5Njg4IDM3LjM5NDUzMSAxNC40ODA0NjkgMzIuNjIxMDk0IEwgMTEuMTIxMDk0IDMwLjkyMTg3NSBDIDguNTM1MTU2IDM2LjIzODI4MSA3LjA3ODEyNSA0Mi4wMzEyNSA2Ljg0NzY1NiA0Ny45NDE0MDYgTCAwIDQ3Ljk0MTQwNiBMIDAgNTEuNzUzOTA2IEwgNi44NDc2NTYgNTEuNzUzOTA2IEMgNy4wODk4NDQgNTcuNjM2NzE5IDguNTQyOTY5IDYzLjQwMjM0NCAxMS4xMjEwOTQgNjguNjk1MzEyIEwgMTQuNTU0Njg4IDY3LjAzNTE1NiBDIDEyLjI1NzgxMiA2Mi4yNjE3MTkgMTAuOTU3MDMxIDU3LjA2NjQwNiAxMC43MzgyODEgNTEuNzczNDM4IEwgMTcuNzQyMTg4IDUxLjc3MzQzOCBDIDE3Ljg1NTQ2OSA1NS4wNDI5NjkgMTguMzQzNzUgNTguMjg5MDYyIDE5LjE5MTQwNiA2MS40NDUzMTIgTCAyMi44NzEwOTQgNjAuNDE0MDYyIEMgMjIuMDg5ODQ0IDU3LjU2MjUgMjEuNjI4OTA2IDU0LjYzMjgxMiAyMS41IDUxLjY3OTY4OCBMIDM0LjIwMzEyNSA1MS42Nzk2ODggQyAzNS4wNTg1OTQgNTguOTY4NzUgNDAuNzczNDM4IDY0LjczODI4MSA0OC4wNTQ2ODggNjUuNjYwMTU2IEwgNDguMDU0Njg4IDc4LjMwODU5NCBDIDQ1LjEwNTQ2OSA3OC4xODc1IDQyLjE4MzU5NCA3Ny43MzA0NjkgMzkuMzM1OTM4IDc2Ljk1NzAzMSBMIDM4LjMwNDY4OCA4MC42MzY3MTkgQyA0MS40ODgyODEgODEuNTExNzE5IDQ0Ljc1NzgxMiA4Mi4wMTU2MjUgNDguMDU0Njg4IDgyLjE0NDUzMSBMIDQ4LjA1NDY4OCA4OS4xNDQ1MzEgQyA0Mi43NjE3MTkgODguOTI1NzgxIDM3LjU2NjQwNiA4Ny42Mjg5MDYgMzIuNzkyOTY5IDg1LjMyODEyNSBMIDMxLjEzMjgxMiA4OC43NjU2MjUgQyAzNi40MjU3ODEgOTEuMzEyNSA0Mi4xODM1OTQgOTIuNzQyMTg4IDQ4LjA1NDY4OCA5Mi45NjA5MzggTCA0OC4wNTQ2ODggOTkuOTYwOTM4IEwgNTEuODcxMDk0IDk5Ljk2MDkzOCBMIDUxLjg3MTA5NCA5Mi45NjA5MzggQyA1Ny43NSA5Mi43MTg3NSA2My41MTk1MzEgOTEuMjY1NjI1IDY4LjgwODU5NCA4OC42ODc1IEwgNjcuMTMyODEyIDg1LjI1MzkwNiBDIDYyLjM1NTQ2OSA4Ny41NTA3ODEgNTcuMTY0MDYyIDg4Ljg1MTU2MiA1MS44NzEwOTQgODkuMDcwMzEyIEwgNTEuODcxMDk0IDgyLjEyNSBDIDU1LjA5Mzc1IDgxLjk4MDQ2OSA1OC4yOTI5NjkgODEuNDc2NTYyIDYxLjQwNjI1IDgwLjYxNzE4OCBMIDYwLjM3ODkwNiA3Ni45Mzc1IEMgNTcuNTc0MjE5IDc3LjcwMzEyNSA1NC42OTUzMTIgNzguMTU2MjUgNTEuNzkyOTY5IDc4LjI4OTA2MiBMIDUxLjc5Mjk2OSA2NS42Nzk2ODggQyA1OS4xMjEwOTQgNjQuODI4MTI1IDY0LjkxMDE1NiA1OS4wNjI1IDY1Ljc5Njg3NSA1MS43MzQzNzUgTCA3OC4zNjcxODggNTEuNzM0Mzc1IEMgNzguMjUgNTQuNzM0Mzc1IDc3Ljc4OTA2MiA1Ny43MTA5MzggNzYuOTkyMTg4IDYwLjYwNTQ2OSBMIDgwLjY3NTc4MSA2MS42MzY3MTkgQyA4MS41NTg1OTQgNTguNDA2MjUgODIuMDY2NDA2IDU1LjA4MjAzMSA4Mi4xODM1OTQgNTEuNzM0Mzc1IEwgODkuMjYxNzE5IDUxLjczNDM3NSBDIDg5LjA0Mjk2OSA1Ny4wMzEyNSA4Ny43NDIxODggNjIuMjIyNjU2IDg1LjQ0NTMxMiA2Ni45OTYwOTQgTCA4OC44Nzg5MDYgNjguNjU2MjUgQyA5MS40NTcwMzEgNjMuMzY3MTg4IDkyLjkxMDE1NiA1Ny41OTc2NTYgOTMuMTUyMzQ0IDUxLjcxODc1IEwgMTAwIDUxLjcxODc1IFogTSA2Mi4wMTk1MzEgNTEuNzM0Mzc1IEMgNjEuMTgzNTk0IDU2Ljk0NTMxMiA1Ny4wODU5MzggNjEuMDIzNDM4IDUxLjg3MTA5NCA2MS44MjgxMjUgTCA1MS44NzEwOTQgNTcuNTE1NjI1IEwgNDguMDU0Njg4IDU3LjUxNTYyNSBMIDQ4LjA1NDY4OCA2MS44MDg1OTQgQyA0Mi45MTAxNTYgNjAuOTQ5MjE5IDM4Ljg4NjcxOSA1Ni45MDIzNDQgMzguMDU4NTk0IDUxLjc1MzkwNiBMIDQyLjMzMjAzMSA1MS43NTM5MDYgTCA0Mi4zMzIwMzEgNDcuOTQxNDA2IEwgMzguMDU4NTk0IDQ3Ljk0MTQwNiBDIDM4Ljg4NjcxOSA0Mi43ODkwNjIgNDIuOTEwMTU2IDM4Ljc0NjA5NCA0OC4wNTQ2ODggMzcuODg2NzE5IEwgNDguMDU0Njg4IDQyLjE3OTY4OCBMIDUxLjg3MTA5NCA0Mi4xNzk2ODggTCA1MS44NzEwOTQgMzcuODQ3NjU2IEMgNTcuMDc4MTI1IDM4LjY0ODQzOCA2MS4xNzk2ODggNDIuNzE4NzUgNjIuMDE5NTMxIDQ3LjkyMTg3NSBMIDU3LjcwNzAzMSA0Ny45MjE4NzUgTCA1Ny43MDcwMzEgNTEuNzM0Mzc1IFogTSA2Mi4wMTk1MzEgNTEuNzM0Mzc1IFwiLz5gO1xuZXhwb3J0IGNvbnN0IENPTExBUFNFX0lDT046IHN0cmluZyA9IGA8c3ZnIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHdpZHRoPVwiOFwiIGhlaWdodD1cIjhcIiBjbGFzcz1cInJpZ2h0LXRyaWFuZ2xlXCI+PHBhdGggZmlsbD1cImN1cnJlbnRDb2xvclwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIGQ9XCJNOTQuOSwyMC44Yy0xLjQtMi41LTQuMS00LjEtNy4xLTQuMUgxMi4yYy0zLDAtNS43LDEuNi03LjEsNC4xYy0xLjMsMi40LTEuMiw1LjIsMC4yLDcuNkw0My4xLDg4YzEuNSwyLjMsNCwzLjcsNi45LDMuNyBzNS40LTEuNCw2LjktMy43bDM3LjgtNTkuNkM5Ni4xLDI2LDk2LjIsMjMuMiw5NC45LDIwLjhMOTQuOSwyMC44elwiPjwvcGF0aD48L3N2Zz5gO1xuIiwidHlwZSBIZXggPSBudW1iZXI7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTQ1OTAwMFxuZXhwb3J0IGNvbnN0IGdldEtleXNQcmVzZXJ2ZVR5cGUgPSBPYmplY3Qua2V5cyBhcyA8VCBleHRlbmRzIG9iamVjdD4oXG4gICAgb2JqOiBUXG4pID0+IEFycmF5PGtleW9mIFQ+O1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjk2OTQ4NlxuZXhwb3J0IGNvbnN0IGVzY2FwZVJlZ2V4U3RyaW5nID0gKHRleHQ6IHN0cmluZykgPT5cbiAgICB0ZXh0LnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUyMTcxNDgwXG5leHBvcnQgZnVuY3Rpb24gY3lyYjUzKHN0cjogc3RyaW5nLCBzZWVkOiBudW1iZXIgPSAwKTogc3RyaW5nIHtcbiAgICBsZXQgaDE6IEhleCA9IDB4ZGVhZGJlZWYgXiBzZWVkLFxuICAgICAgICBoMjogSGV4ID0gMHg0MWM2Y2U1NyBeIHNlZWQ7XG4gICAgZm9yIChsZXQgaSA9IDAsIGNoOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNoID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGgxID0gTWF0aC5pbXVsKGgxIF4gY2gsIDI2NTQ0MzU3NjEpO1xuICAgICAgICBoMiA9IE1hdGguaW11bChoMiBeIGNoLCAxNTk3MzM0Njc3KTtcbiAgICB9XG4gICAgaDEgPVxuICAgICAgICBNYXRoLmltdWwoaDEgXiAoaDEgPj4+IDE2KSwgMjI0NjgyMjUwNykgXlxuICAgICAgICBNYXRoLmltdWwoaDIgXiAoaDIgPj4+IDEzKSwgMzI2NjQ4OTkwOSk7XG4gICAgaDIgPVxuICAgICAgICBNYXRoLmltdWwoaDIgXiAoaDIgPj4+IDE2KSwgMjI0NjgyMjUwNykgXlxuICAgICAgICBNYXRoLmltdWwoaDEgXiAoaDEgPj4+IDEzKSwgMzI2NjQ4OTkwOSk7XG4gICAgcmV0dXJuICg0Mjk0OTY3Mjk2ICogKDIwOTcxNTEgJiBoMikgKyAoaDEgPj4+IDApKS50b1N0cmluZygxNik7XG59XG4iLCJpbXBvcnQge1xuICAgIE1vZGFsLFxuICAgIEFwcCxcbiAgICBNYXJrZG93blJlbmRlcmVyLFxuICAgIE5vdGljZSxcbiAgICBQbGF0Zm9ybSxcbiAgICBURmlsZSxcbiAgICBNYXJrZG93blZpZXcsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgdHlwZSBTUlBsdWdpbiBmcm9tIFwic3JjL21haW5cIjtcbmltcG9ydCB7IENhcmQsIHNjaGVkdWxlLCB0ZXh0SW50ZXJ2YWwsIFJldmlld1Jlc3BvbnNlIH0gZnJvbSBcInNyYy9zY2hlZHVsaW5nXCI7XG5pbXBvcnQgeyBDYXJkVHlwZSB9IGZyb20gXCJzcmMvdHlwZXNcIjtcbmltcG9ydCB7XG4gICAgQ09MTEFQU0VfSUNPTixcbiAgICBNVUxUSV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUixcbiAgICBMRUdBQ1lfU0NIRURVTElOR19FWFRSQUNUT1IsXG59IGZyb20gXCJzcmMvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBlc2NhcGVSZWdleFN0cmluZywgY3lyYjUzIH0gZnJvbSBcInNyYy91dGlsc1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9oZWxwZXJzXCI7XG5cbmV4cG9ydCBlbnVtIEZsYXNoY2FyZE1vZGFsTW9kZSB7XG4gICAgRGVja3NMaXN0LFxuICAgIEZyb250LFxuICAgIEJhY2ssXG4gICAgQ2xvc2VkLFxufVxuXG5leHBvcnQgY2xhc3MgRmxhc2hjYXJkTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gICAgcHVibGljIHBsdWdpbjogU1JQbHVnaW47XG4gICAgcHVibGljIGFuc3dlckJ0bjogSFRNTEVsZW1lbnQ7XG4gICAgcHVibGljIGZsYXNoY2FyZFZpZXc6IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyBoYXJkQnRuOiBIVE1MRWxlbWVudDtcbiAgICBwdWJsaWMgZ29vZEJ0bjogSFRNTEVsZW1lbnQ7XG4gICAgcHVibGljIGVhc3lCdG46IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyByZXNwb25zZURpdjogSFRNTEVsZW1lbnQ7XG4gICAgcHVibGljIGZpbGVMaW5rVmlldzogSFRNTEVsZW1lbnQ7XG4gICAgcHVibGljIHJlc2V0TGlua1ZpZXc6IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyBjb250ZXh0VmlldzogSFRNTEVsZW1lbnQ7XG4gICAgcHVibGljIGN1cnJlbnRDYXJkOiBDYXJkO1xuICAgIHB1YmxpYyBjdXJyZW50Q2FyZElkeDogbnVtYmVyO1xuICAgIHB1YmxpYyBjdXJyZW50RGVjazogRGVjaztcbiAgICBwdWJsaWMgY2hlY2tEZWNrOiBEZWNrO1xuICAgIHB1YmxpYyBtb2RlOiBGbGFzaGNhcmRNb2RhbE1vZGU7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBTUlBsdWdpbikge1xuICAgICAgICBzdXBlcihhcHApO1xuXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuXG4gICAgICAgIHRoaXMudGl0bGVFbC5zZXRUZXh0KHQoXCJEZWNrc1wiKSk7XG5cbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzTW9iaWxlKSB0aGlzLmNvbnRlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB0aGlzLm1vZGFsRWwuc3R5bGUuaGVpZ2h0ID1cbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZmxhc2hjYXJkSGVpZ2h0UGVyY2VudGFnZSArIFwiJVwiO1xuICAgICAgICB0aGlzLm1vZGFsRWwuc3R5bGUud2lkdGggPVxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRXaWR0aFBlcmNlbnRhZ2UgKyBcIiVcIjtcblxuICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAgICAgdGhpcy5jb250ZW50RWwuc3R5bGUuaGVpZ2h0ID0gXCI5MiVcIjtcbiAgICAgICAgdGhpcy5jb250ZW50RWwuYWRkQ2xhc3MoXCJzci1tb2RhbC1jb250ZW50XCIpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkub25rZXlwcmVzcyA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlICE9PSBGbGFzaGNhcmRNb2RhbE1vZGUuRGVja3NMaXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgIT09IEZsYXNoY2FyZE1vZGFsTW9kZS5DbG9zZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgZS5jb2RlID09PSBcIktleVNcIlxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREZWNrLmRlbGV0ZUZsYXNoY2FyZEF0SW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkSWR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5pc0R1ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5jYXJkVHlwZSA9PT0gQ2FyZFR5cGUuQ2xvemUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1cnlTaWJsaW5nQ2FyZHMoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREZWNrLm5leHRDYXJkKHRoaXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZSA9PT0gRmxhc2hjYXJkTW9kYWxNb2RlLkZyb250ICYmXG4gICAgICAgICAgICAgICAgICAgIChlLmNvZGUgPT09IFwiU3BhY2VcIiB8fCBlLmNvZGUgPT09IFwiRW50ZXJcIilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Fuc3dlcigpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gRmxhc2hjYXJkTW9kYWxNb2RlLkJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJOdW1wYWQxXCIgfHwgZS5jb2RlID09PSBcIkRpZ2l0MVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmV2aWV3KFJldmlld1Jlc3BvbnNlLkhhcmQpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY29kZSA9PT0gXCJOdW1wYWQyXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY29kZSA9PT0gXCJEaWdpdDJcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jb2RlID09PSBcIlNwYWNlXCJcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmV2aWV3KFJldmlld1Jlc3BvbnNlLkdvb2QpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChlLmNvZGUgPT09IFwiTnVtcGFkM1wiIHx8IGUuY29kZSA9PT0gXCJEaWdpdDNcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JldmlldyhSZXZpZXdSZXNwb25zZS5FYXN5KTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZS5jb2RlID09PSBcIk51bXBhZDBcIiB8fCBlLmNvZGUgPT09IFwiRGlnaXQwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NSZXZpZXcoUmV2aWV3UmVzcG9uc2UuUmVzZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvbk9wZW4oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVja3NMaXN0KCk7XG4gICAgfVxuXG4gICAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb2RlID0gRmxhc2hjYXJkTW9kYWxNb2RlLkNsb3NlZDtcbiAgICB9XG5cbiAgICBkZWNrc0xpc3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubW9kZSA9IEZsYXNoY2FyZE1vZGFsTW9kZS5EZWNrc0xpc3Q7XG4gICAgICAgIHRoaXMudGl0bGVFbC5zZXRUZXh0KHQoXCJEZWNrc1wiKSk7XG4gICAgICAgIHRoaXMudGl0bGVFbC5pbm5lckhUTUwgKz1cbiAgICAgICAgICAgICc8cCBzdHlsZT1cIm1hcmdpbjowcHg7bGluZS1oZWlnaHQ6MTJweDtcIj4nICtcbiAgICAgICAgICAgICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IzRjYWY1MDtjb2xvcjojZmZmZmZmO1wiIGFyaWEtbGFiZWw9XCInICtcbiAgICAgICAgICAgIHQoXCJEdWUgY2FyZHNcIikgK1xuICAgICAgICAgICAgJ1wiIGNsYXNzPVwidGFnLXBhbmUtdGFnLWNvdW50IHRyZWUtaXRlbS1mbGFpclwiPicgK1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGVja1RyZWUuZHVlRmxhc2hjYXJkc0NvdW50ICtcbiAgICAgICAgICAgIFwiPC9zcGFuPlwiICtcbiAgICAgICAgICAgICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IzIxOTZmMztcIiBhcmlhLWxhYmVsPVwiJyArXG4gICAgICAgICAgICB0KFwiTmV3IGNhcmRzXCIpICtcbiAgICAgICAgICAgICdcIiBjbGFzcz1cInRhZy1wYW5lLXRhZy1jb3VudCB0cmVlLWl0ZW0tZmxhaXIgc3ItZGVjay1jb3VudHNcIj4nICtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmRlY2tUcmVlLm5ld0ZsYXNoY2FyZHNDb3VudCArXG4gICAgICAgICAgICBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiNmZjcwNDM7XCIgYXJpYS1sYWJlbD1cIicgK1xuICAgICAgICAgICAgdChcIlRvdGFsIGNhcmRzXCIpICtcbiAgICAgICAgICAgICdcIiBjbGFzcz1cInRhZy1wYW5lLXRhZy1jb3VudCB0cmVlLWl0ZW0tZmxhaXIgc3ItZGVjay1jb3VudHNcIj4nICtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmRlY2tUcmVlLnRvdGFsRmxhc2hjYXJkcyArXG4gICAgICAgICAgICBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICBcIjwvcD5cIjtcbiAgICAgICAgdGhpcy5jb250ZW50RWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgdGhpcy5jb250ZW50RWwuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzci1mbGFzaGNhcmQtdmlld1wiKTtcblxuICAgICAgICBmb3IgKGxldCBkZWNrIG9mIHRoaXMucGx1Z2luLmRlY2tUcmVlLnN1YmRlY2tzKVxuICAgICAgICAgICAgZGVjay5yZW5kZXIodGhpcy5jb250ZW50RWwsIHRoaXMpO1xuICAgIH1cblxuICAgIHNldHVwQ2FyZHNWaWV3KCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRFbC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMuZmlsZUxpbmtWaWV3ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KFwic3ItbGlua1wiKTtcbiAgICAgICAgdGhpcy5maWxlTGlua1ZpZXcuc2V0VGV4dCh0KFwiT3BlbiBmaWxlXCIpKTtcbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2hvd0ZpbGVOYW1lSW5GaWxlTGluaylcbiAgICAgICAgICAgIHRoaXMuZmlsZUxpbmtWaWV3LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcIk9wZW4gZmlsZVwiKSk7XG4gICAgICAgIHRoaXMuZmlsZUxpbmtWaWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoXykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLm9wZW5GaWxlKFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQubm90ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBhY3RpdmVWaWV3OiBNYXJrZG93blZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldykhO1xuICAgICAgICAgICAgYWN0aXZlVmlldy5lZGl0b3Iuc2V0Q3Vyc29yKHtcbiAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmN1cnJlbnRDYXJkLmxpbmVObyxcbiAgICAgICAgICAgICAgICBjaDogMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlc2V0TGlua1ZpZXcgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoXCJzci1saW5rXCIpO1xuICAgICAgICB0aGlzLnJlc2V0TGlua1ZpZXcuc2V0VGV4dCh0KFwiUmVzZXQgY2FyZCdzIHByb2dyZXNzXCIpKTtcbiAgICAgICAgdGhpcy5yZXNldExpbmtWaWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoXykgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmV2aWV3KFJldmlld1Jlc3BvbnNlLlJlc2V0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzZXRMaW5rVmlldy5zdHlsZS5mbG9hdCA9IFwicmlnaHRcIjtcblxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaG93Q29udGV4dEluQ2FyZHMpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFZpZXcgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFZpZXcuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzci1jb250ZXh0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mbGFzaGNhcmRWaWV3ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmZsYXNoY2FyZFZpZXcuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzci1mbGFzaGNhcmQtdmlld1wiKTtcblxuICAgICAgICB0aGlzLnJlc3BvbnNlRGl2ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KFwic3ItcmVzcG9uc2VcIik7XG5cbiAgICAgICAgdGhpcy5oYXJkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5oYXJkQnRuLnNldEF0dHJpYnV0ZShcImlkXCIsIFwic3ItaGFyZC1idG5cIik7XG4gICAgICAgIHRoaXMuaGFyZEJ0bi5zZXRUZXh0KHQoXCJIYXJkXCIpKTtcbiAgICAgICAgdGhpcy5oYXJkQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoXykgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmV2aWV3KFJldmlld1Jlc3BvbnNlLkhhcmQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNwb25zZURpdi5hcHBlbmRDaGlsZCh0aGlzLmhhcmRCdG4pO1xuXG4gICAgICAgIHRoaXMuZ29vZEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuZ29vZEJ0bi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNyLWdvb2QtYnRuXCIpO1xuICAgICAgICB0aGlzLmdvb2RCdG4uc2V0VGV4dCh0KFwiR29vZFwiKSk7XG4gICAgICAgIHRoaXMuZ29vZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKF8pID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JldmlldyhSZXZpZXdSZXNwb25zZS5Hb29kKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzcG9uc2VEaXYuYXBwZW5kQ2hpbGQodGhpcy5nb29kQnRuKTtcblxuICAgICAgICB0aGlzLmVhc3lCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmVhc3lCdG4uc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzci1lYXN5LWJ0blwiKTtcbiAgICAgICAgdGhpcy5lYXN5QnRuLnNldFRleHQodChcIkVhc3lcIikpO1xuICAgICAgICB0aGlzLmVhc3lCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NSZXZpZXcoUmV2aWV3UmVzcG9uc2UuRWFzeSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlc3BvbnNlRGl2LmFwcGVuZENoaWxkKHRoaXMuZWFzeUJ0bik7XG4gICAgICAgIHRoaXMucmVzcG9uc2VEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIHRoaXMuYW5zd2VyQnRuID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KCk7XG4gICAgICAgIHRoaXMuYW5zd2VyQnRuLnNldEF0dHJpYnV0ZShcImlkXCIsIFwic3Itc2hvdy1hbnN3ZXJcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyQnRuLnNldFRleHQodChcIlNob3cgQW5zd2VyXCIpKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNob3dBbnN3ZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvd0Fuc3dlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb2RlID0gRmxhc2hjYXJkTW9kYWxNb2RlLkJhY2s7XG5cbiAgICAgICAgdGhpcy5hbnN3ZXJCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLnJlc3BvbnNlRGl2LnN0eWxlLmRpc3BsYXkgPSBcImdyaWRcIjtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5pc0R1ZSlcbiAgICAgICAgICAgIHRoaXMucmVzZXRMaW5rVmlldy5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5jYXJkVHlwZSAhPT0gQ2FyZFR5cGUuQ2xvemUpIHtcbiAgICAgICAgICAgIGxldCBocjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIik7XG4gICAgICAgICAgICBoci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNyLWhyLWNhcmQtZGl2aWRlXCIpO1xuICAgICAgICAgICAgdGhpcy5mbGFzaGNhcmRWaWV3LmFwcGVuZENoaWxkKGhyKTtcbiAgICAgICAgfSBlbHNlIHRoaXMuZmxhc2hjYXJkVmlldy5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMucmVuZGVyTWFya2Rvd25XcmFwcGVyKHRoaXMuY3VycmVudENhcmQuYmFjaywgdGhpcy5mbGFzaGNhcmRWaWV3KTtcbiAgICB9XG5cbiAgICBhc3luYyBwcm9jZXNzUmV2aWV3KHJlc3BvbnNlOiBSZXZpZXdSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsZXQgaW50ZXJ2YWw6IG51bWJlciwgZWFzZTogbnVtYmVyLCBkdWU7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50RGVjay5kZWxldGVGbGFzaGNhcmRBdEluZGV4KFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZElkeCxcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuaXNEdWVcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHJlc3BvbnNlICE9PSBSZXZpZXdSZXNwb25zZS5SZXNldCkge1xuICAgICAgICAgICAgLy8gc2NoZWR1bGVkIGNhcmRcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRDYXJkLmlzRHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNjaGVkT2JqOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0gc2NoZWR1bGUoXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLmludGVydmFsISxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5lYXNlISxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5kZWxheUJlZm9yZVJldmlldyEsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmR1ZURhdGVzRmxhc2hjYXJkc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBzY2hlZE9iai5pbnRlcnZhbDtcbiAgICAgICAgICAgICAgICBlYXNlID0gc2NoZWRPYmouZWFzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHNjaGVkT2JqOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0gc2NoZWR1bGUoXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmJhc2VFYXNlLFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kdWVEYXRlc0ZsYXNoY2FyZHNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGludGVydmFsID0gc2NoZWRPYmouaW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgZWFzZSA9IHNjaGVkT2JqLmVhc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGR1ZSA9IHdpbmRvdy5tb21lbnQoRGF0ZS5ub3coKSArIGludGVydmFsICogMjQgKiAzNjAwICogMTAwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLmludGVydmFsID0gMS4wO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5lYXNlID0gdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5iYXNlRWFzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRDYXJkLmlzRHVlKVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2suZHVlRmxhc2hjYXJkcy5wdXNoKHRoaXMuY3VycmVudENhcmQpO1xuICAgICAgICAgICAgZWxzZSB0aGlzLmN1cnJlbnREZWNrLm5ld0ZsYXNoY2FyZHMucHVzaCh0aGlzLmN1cnJlbnRDYXJkKTtcbiAgICAgICAgICAgIGR1ZSA9IHdpbmRvdy5tb21lbnQoRGF0ZS5ub3coKSk7XG4gICAgICAgICAgICBuZXcgTm90aWNlKHQoXCJDYXJkJ3MgcHJvZ3Jlc3MgaGFzIGJlZW4gcmVzZXQuXCIpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2submV4dENhcmQodGhpcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZHVlU3RyaW5nOiBzdHJpbmcgPSBkdWUuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcblxuICAgICAgICBsZXQgZmlsZVRleHQ6IHN0cmluZyA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGhpcy5jdXJyZW50Q2FyZC5ub3RlKTtcbiAgICAgICAgbGV0IHJlcGxhY2VtZW50UmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgZXNjYXBlUmVnZXhTdHJpbmcodGhpcy5jdXJyZW50Q2FyZC5jYXJkVGV4dCksXG4gICAgICAgICAgICBcImdtXCJcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgc2VwOiBzdHJpbmcgPSB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmNhcmRDb21tZW50T25TYW1lTGluZVxuICAgICAgICAgICAgPyBcIiBcIlxuICAgICAgICAgICAgOiBcIlxcblwiO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIHdlJ3JlIGFkZGluZyBzY2hlZHVsaW5nIGluZm9ybWF0aW9uIHRvIHRoZSBmbGFzaGNhcmRcbiAgICAgICAgLy8gZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0Lmxhc3RJbmRleE9mKFwiPCEtLVNSOlwiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQgPVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQgK1xuICAgICAgICAgICAgICAgIHNlcCArXG4gICAgICAgICAgICAgICAgYDwhLS1TUjohJHtkdWVTdHJpbmd9LCR7aW50ZXJ2YWx9LCR7ZWFzZX0tLT5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNjaGVkdWxpbmc6IFJlZ0V4cE1hdGNoQXJyYXlbXSA9IFtcbiAgICAgICAgICAgICAgICAuLi50aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0Lm1hdGNoQWxsKFxuICAgICAgICAgICAgICAgICAgICBNVUxUSV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUlxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgaWYgKHNjaGVkdWxpbmcubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgIHNjaGVkdWxpbmcgPSBbXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuY3VycmVudENhcmQuY2FyZFRleHQubWF0Y2hBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBMRUdBQ1lfU0NIRURVTElOR19FWFRSQUNUT1JcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBsZXQgY3VyckNhcmRTY2hlZDogc3RyaW5nW10gPSBbXG4gICAgICAgICAgICAgICAgXCIwXCIsXG4gICAgICAgICAgICAgICAgZHVlU3RyaW5nLFxuICAgICAgICAgICAgICAgIGludGVydmFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZWFzZS50b1N0cmluZygpLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRDYXJkLmlzRHVlKVxuICAgICAgICAgICAgICAgIHNjaGVkdWxpbmdbdGhpcy5jdXJyZW50Q2FyZC5zaWJsaW5nSWR4XSA9IGN1cnJDYXJkU2NoZWQ7XG4gICAgICAgICAgICBlbHNlIHNjaGVkdWxpbmcucHVzaChjdXJyQ2FyZFNjaGVkKTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5jYXJkVGV4dCA9IHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvPCEtLVNSOi4rLS0+L2dtLFxuICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0ICs9IFwiPCEtLVNSOlwiO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2hlZHVsaW5nLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQgKz0gYCEke3NjaGVkdWxpbmdbaV1bMV19LCR7c2NoZWR1bGluZ1tpXVsyXX0sJHtzY2hlZHVsaW5nW2ldWzNdfWA7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0ICs9IFwiLS0+XCI7XG4gICAgICAgIH1cblxuICAgICAgICBmaWxlVGV4dCA9IGZpbGVUZXh0LnJlcGxhY2UoXG4gICAgICAgICAgICByZXBsYWNlbWVudFJlZ2V4LFxuICAgICAgICAgICAgKF8pID0+IHRoaXMuY3VycmVudENhcmQuY2FyZFRleHRcbiAgICAgICAgKTtcbiAgICAgICAgZm9yIChsZXQgc2libGluZyBvZiB0aGlzLmN1cnJlbnRDYXJkLnNpYmxpbmdzKVxuICAgICAgICAgICAgc2libGluZy5jYXJkVGV4dCA9IHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQ7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmJ1cnlTaWJsaW5nQ2FyZHMpXG4gICAgICAgICAgICB0aGlzLmJ1cnlTaWJsaW5nQ2FyZHModHJ1ZSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KHRoaXMuY3VycmVudENhcmQubm90ZSwgZmlsZVRleHQpO1xuICAgICAgICB0aGlzLmN1cnJlbnREZWNrLm5leHRDYXJkKHRoaXMpO1xuICAgIH1cblxuICAgIGFzeW5jIGJ1cnlTaWJsaW5nQ2FyZHModGlsbE5leHREYXk6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRpbGxOZXh0RGF5KSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLmJ1cnlMaXN0LnB1c2goY3lyYjUzKHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQpKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBzaWJsaW5nIG9mIHRoaXMuY3VycmVudENhcmQuc2libGluZ3MpIHtcbiAgICAgICAgICAgIGxldCBkdWVJZHggPSB0aGlzLmN1cnJlbnREZWNrLmR1ZUZsYXNoY2FyZHMuaW5kZXhPZihzaWJsaW5nKTtcbiAgICAgICAgICAgIGxldCBuZXdJZHggPSB0aGlzLmN1cnJlbnREZWNrLm5ld0ZsYXNoY2FyZHMuaW5kZXhPZihzaWJsaW5nKTtcblxuICAgICAgICAgICAgaWYgKGR1ZUlkeCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGVjay5kZWxldGVGbGFzaGNhcmRBdEluZGV4KFxuICAgICAgICAgICAgICAgICAgICBkdWVJZHgsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2suZHVlRmxhc2hjYXJkc1tkdWVJZHhdLmlzRHVlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld0lkeCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGVjay5kZWxldGVGbGFzaGNhcmRBdEluZGV4KFxuICAgICAgICAgICAgICAgICAgICBuZXdJZHgsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2submV3Rmxhc2hjYXJkc1tuZXdJZHhdLmlzRHVlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNsaWdodGx5IG1vZGlmaWVkIHZlcnNpb24gb2YgdGhlIHJlbmRlck1hcmtkb3duIGZ1bmN0aW9uIGluXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21nbWV5ZXJzL29ic2lkaWFuLWthbmJhbi9ibG9iL21haW4vc3JjL0thbmJhblZpZXcudHN4XG4gICAgYXN5bmMgcmVuZGVyTWFya2Rvd25XcmFwcGVyKFxuICAgICAgICBtYXJrZG93blN0cmluZzogc3RyaW5nLFxuICAgICAgICBjb250YWluZXJFbDogSFRNTEVsZW1lbnRcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgTWFya2Rvd25SZW5kZXJlci5yZW5kZXJNYXJrZG93bihcbiAgICAgICAgICAgIG1hcmtkb3duU3RyaW5nLFxuICAgICAgICAgICAgY29udGFpbmVyRWwsXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLm5vdGUucGF0aCxcbiAgICAgICAgICAgIHRoaXMucGx1Z2luXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRhaW5lckVsLmZpbmRBbGwoXCIuaW50ZXJuYWwtZW1iZWRcIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGxldCBzcmM6IHN0cmluZyA9IGVsLmdldEF0dHJpYnV0ZShcInNyY1wiKSE7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0OiBURmlsZSB8IG51bGwgfCBmYWxzZSA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIHNyYyA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KFxuICAgICAgICAgICAgICAgICAgICBzcmMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQubm90ZS5wYXRoXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBURmlsZSAmJiB0YXJnZXQuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIHtcbiAgICAgICAgICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGVsLmNyZWF0ZUVsKFxuICAgICAgICAgICAgICAgICAgICBcImltZ1wiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiB0aGlzLnBsdWdpbi5hcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKHRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAoaW1nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKFwid2lkdGhcIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5nZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpbWcuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShcImFsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGVsLmdldEF0dHJpYnV0ZShcImFsdFwiKSEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbC5hZGRDbGFzc2VzKFtcImltYWdlLWVtYmVkXCIsIFwiaXMtbG9hZGVkXCJdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlsZSBkb2VzIG5vdCBleGlzdFxuICAgICAgICAgICAgLy8gZGlzcGxheSBkZWFkIGxpbmtcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IG51bGwpIGVsLmlubmVyVGV4dCA9IHNyYztcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVjayB7XG4gICAgcHVibGljIGRlY2tOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIG5ld0ZsYXNoY2FyZHM6IENhcmRbXTtcbiAgICBwdWJsaWMgbmV3Rmxhc2hjYXJkc0NvdW50OiBudW1iZXIgPSAwOyAvLyBjb3VudHMgdGhvc2UgaW4gc3ViZGVja3MgdG9vXG4gICAgcHVibGljIGR1ZUZsYXNoY2FyZHM6IENhcmRbXTtcbiAgICBwdWJsaWMgZHVlRmxhc2hjYXJkc0NvdW50OiBudW1iZXIgPSAwOyAvLyBjb3VudHMgdGhvc2UgaW4gc3ViZGVja3MgdG9vXG4gICAgcHVibGljIHRvdGFsRmxhc2hjYXJkczogbnVtYmVyID0gMDsgLy8gY291bnRzIHRob3NlIGluIHN1YmRlY2tzIHRvb1xuICAgIHB1YmxpYyBzdWJkZWNrczogRGVja1tdO1xuICAgIHB1YmxpYyBwYXJlbnQ6IERlY2sgfCBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoZGVja05hbWU6IHN0cmluZywgcGFyZW50OiBEZWNrIHwgbnVsbCkge1xuICAgICAgICB0aGlzLmRlY2tOYW1lID0gZGVja05hbWU7XG4gICAgICAgIHRoaXMubmV3Rmxhc2hjYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLm5ld0ZsYXNoY2FyZHNDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuZHVlRmxhc2hjYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmR1ZUZsYXNoY2FyZHNDb3VudCA9IDA7XG4gICAgICAgIHRoaXMudG90YWxGbGFzaGNhcmRzID0gMDtcbiAgICAgICAgdGhpcy5zdWJkZWNrcyA9IFtdO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG5cbiAgICBjcmVhdGVEZWNrKGRlY2tQYXRoOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICBpZiAoZGVja1BhdGgubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGRlY2tOYW1lOiBzdHJpbmcgPSBkZWNrUGF0aC5zaGlmdCgpITtcbiAgICAgICAgZm9yIChsZXQgZGVjayBvZiB0aGlzLnN1YmRlY2tzKSB7XG4gICAgICAgICAgICBpZiAoZGVja05hbWUgPT09IGRlY2suZGVja05hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWNrLmNyZWF0ZURlY2soZGVja1BhdGgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWNrOiBEZWNrID0gbmV3IERlY2soZGVja05hbWUsIHRoaXMpO1xuICAgICAgICB0aGlzLnN1YmRlY2tzLnB1c2goZGVjayk7XG4gICAgICAgIGRlY2suY3JlYXRlRGVjayhkZWNrUGF0aCk7XG4gICAgfVxuXG4gICAgaW5zZXJ0Rmxhc2hjYXJkKGRlY2tQYXRoOiBzdHJpbmdbXSwgY2FyZE9iajogQ2FyZCk6IHZvaWQge1xuICAgICAgICBpZiAoY2FyZE9iai5pc0R1ZSkgdGhpcy5kdWVGbGFzaGNhcmRzQ291bnQrKztcbiAgICAgICAgZWxzZSB0aGlzLm5ld0ZsYXNoY2FyZHNDb3VudCsrO1xuICAgICAgICB0aGlzLnRvdGFsRmxhc2hjYXJkcysrO1xuXG4gICAgICAgIGlmIChkZWNrUGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChjYXJkT2JqLmlzRHVlKSB0aGlzLmR1ZUZsYXNoY2FyZHMucHVzaChjYXJkT2JqKTtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5uZXdGbGFzaGNhcmRzLnB1c2goY2FyZE9iaik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGVja05hbWU6IHN0cmluZyA9IGRlY2tQYXRoLnNoaWZ0KCkhO1xuICAgICAgICBmb3IgKGxldCBkZWNrIG9mIHRoaXMuc3ViZGVja3MpIHtcbiAgICAgICAgICAgIGlmIChkZWNrTmFtZSA9PT0gZGVjay5kZWNrTmFtZSkge1xuICAgICAgICAgICAgICAgIGRlY2suaW5zZXJ0Rmxhc2hjYXJkKGRlY2tQYXRoLCBjYXJkT2JqKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb3VudCBmbGFzaGNhcmRzIHRoYXQgaGF2ZSBlaXRoZXIgYmVlbiBidXJpZWRcbiAgICAvLyBvciBhcmVuJ3QgZHVlIHlldFxuICAgIGNvdW50Rmxhc2hjYXJkKGRlY2tQYXRoOiBzdHJpbmdbXSwgbjogbnVtYmVyID0gMSk6IHZvaWQge1xuICAgICAgICB0aGlzLnRvdGFsRmxhc2hjYXJkcyArPSBuO1xuXG4gICAgICAgIGxldCBkZWNrTmFtZTogc3RyaW5nID0gZGVja1BhdGguc2hpZnQoKSE7XG4gICAgICAgIGZvciAobGV0IGRlY2sgb2YgdGhpcy5zdWJkZWNrcykge1xuICAgICAgICAgICAgaWYgKGRlY2tOYW1lID09PSBkZWNrLmRlY2tOYW1lKSB7XG4gICAgICAgICAgICAgICAgZGVjay5jb3VudEZsYXNoY2FyZChkZWNrUGF0aCwgbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlRmxhc2hjYXJkQXRJbmRleChpbmRleDogbnVtYmVyLCBjYXJkSXNEdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKGNhcmRJc0R1ZSkgdGhpcy5kdWVGbGFzaGNhcmRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGVsc2UgdGhpcy5uZXdGbGFzaGNhcmRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgbGV0IGRlY2s6IERlY2sgfCBudWxsID0gdGhpcztcbiAgICAgICAgd2hpbGUgKGRlY2sgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjYXJkSXNEdWUpIGRlY2suZHVlRmxhc2hjYXJkc0NvdW50LS07XG4gICAgICAgICAgICBlbHNlIGRlY2submV3Rmxhc2hjYXJkc0NvdW50LS07XG4gICAgICAgICAgICBkZWNrID0gZGVjay5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0U3ViZGVja3NMaXN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YmRlY2tzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLmRlY2tOYW1lIDwgYi5kZWNrTmFtZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgZWxzZSBpZiAoYS5kZWNrTmFtZSA+IGIuZGVja05hbWUpIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGRlY2sgb2YgdGhpcy5zdWJkZWNrcykgZGVjay5zb3J0U3ViZGVja3NMaXN0KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgbW9kYWw6IEZsYXNoY2FyZE1vZGFsKTogdm9pZCB7XG4gICAgICAgIGxldCBkZWNrVmlldzogSFRNTEVsZW1lbnQgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoXCJ0cmVlLWl0ZW1cIik7XG5cbiAgICAgICAgbGV0IGRlY2tWaWV3U2VsZjogSFRNTEVsZW1lbnQgPSBkZWNrVmlldy5jcmVhdGVEaXYoXG4gICAgICAgICAgICBcInRyZWUtaXRlbS1zZWxmIHRhZy1wYW5lLXRhZyBpcy1jbGlja2FibGVcIlxuICAgICAgICApO1xuICAgICAgICBsZXQgY29sbGFwc2VkOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgbGV0IGNvbGxhcHNlSWNvbkVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5zdWJkZWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb2xsYXBzZUljb25FbCA9IGRlY2tWaWV3U2VsZi5jcmVhdGVEaXYoXG4gICAgICAgICAgICAgICAgXCJ0cmVlLWl0ZW0taWNvbiBjb2xsYXBzZS1pY29uXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb2xsYXBzZUljb25FbC5pbm5lckhUTUwgPSBDT0xMQVBTRV9JQ09OO1xuICAgICAgICAgICAgKGNvbGxhcHNlSWNvbkVsLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgXCJyb3RhdGUoLTkwZGVnKVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlY2tWaWV3SW5uZXI6IEhUTUxFbGVtZW50ID1cbiAgICAgICAgICAgIGRlY2tWaWV3U2VsZi5jcmVhdGVEaXYoXCJ0cmVlLWl0ZW0taW5uZXJcIik7XG4gICAgICAgIGRlY2tWaWV3SW5uZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfKSA9PiB7XG4gICAgICAgICAgICBtb2RhbC5jdXJyZW50RGVjayA9IHRoaXM7XG4gICAgICAgICAgICBtb2RhbC5jaGVja0RlY2sgPSB0aGlzLnBhcmVudCE7XG4gICAgICAgICAgICBtb2RhbC5zZXR1cENhcmRzVmlldygpO1xuICAgICAgICAgICAgdGhpcy5uZXh0Q2FyZChtb2RhbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGVja1ZpZXdJbm5lclRleHQ6IEhUTUxFbGVtZW50ID1cbiAgICAgICAgICAgIGRlY2tWaWV3SW5uZXIuY3JlYXRlRGl2KFwidGFnLXBhbmUtdGFnLXRleHRcIik7XG4gICAgICAgIGRlY2tWaWV3SW5uZXJUZXh0LmlubmVySFRNTCArPSBgPHNwYW4gY2xhc3M9XCJ0YWctcGFuZS10YWctc2VsZlwiPiR7dGhpcy5kZWNrTmFtZX08L3NwYW4+YDtcbiAgICAgICAgbGV0IGRlY2tWaWV3T3V0ZXI6IEhUTUxFbGVtZW50ID0gZGVja1ZpZXdTZWxmLmNyZWF0ZURpdihcbiAgICAgICAgICAgIFwidHJlZS1pdGVtLWZsYWlyLW91dGVyXCJcbiAgICAgICAgKTtcbiAgICAgICAgZGVja1ZpZXdPdXRlci5pbm5lckhUTUwgKz1cbiAgICAgICAgICAgICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IzRjYWY1MDtcIiBjbGFzcz1cInRhZy1wYW5lLXRhZy1jb3VudCB0cmVlLWl0ZW0tZmxhaXIgc3ItZGVjay1jb3VudHNcIj4nICtcbiAgICAgICAgICAgIHRoaXMuZHVlRmxhc2hjYXJkc0NvdW50ICtcbiAgICAgICAgICAgIFwiPC9zcGFuPlwiICtcbiAgICAgICAgICAgICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IzIxOTZmMztcIiBjbGFzcz1cInRhZy1wYW5lLXRhZy1jb3VudCB0cmVlLWl0ZW0tZmxhaXIgc3ItZGVjay1jb3VudHNcIj4nICtcbiAgICAgICAgICAgIHRoaXMubmV3Rmxhc2hjYXJkc0NvdW50ICtcbiAgICAgICAgICAgIFwiPC9zcGFuPlwiICtcbiAgICAgICAgICAgICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6I2ZmNzA0MztcIiBjbGFzcz1cInRhZy1wYW5lLXRhZy1jb3VudCB0cmVlLWl0ZW0tZmxhaXIgc3ItZGVjay1jb3VudHNcIj4nICtcbiAgICAgICAgICAgIHRoaXMudG90YWxGbGFzaGNhcmRzICtcbiAgICAgICAgICAgIFwiPC9zcGFuPlwiO1xuXG4gICAgICAgIGxldCBkZWNrVmlld0NoaWxkcmVuOiBIVE1MRWxlbWVudCA9XG4gICAgICAgICAgICBkZWNrVmlldy5jcmVhdGVEaXYoXCJ0cmVlLWl0ZW0tY2hpbGRyZW5cIik7XG4gICAgICAgIGRlY2tWaWV3Q2hpbGRyZW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBpZiAodGhpcy5zdWJkZWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb2xsYXBzZUljb25FbCEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZUljb25FbCEuY2hpbGROb2Rlc1swXSBhcyBIVE1MRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICApLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGRlY2tWaWV3Q2hpbGRyZW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZUljb25FbCEuY2hpbGROb2Rlc1swXSBhcyBIVE1MRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICApLnN0eWxlLnRyYW5zZm9ybSA9IFwicm90YXRlKC05MGRlZylcIjtcbiAgICAgICAgICAgICAgICAgICAgZGVja1ZpZXdDaGlsZHJlbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbGxhcHNlZCA9ICFjb2xsYXBzZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBkZWNrIG9mIHRoaXMuc3ViZGVja3MpIGRlY2sucmVuZGVyKGRlY2tWaWV3Q2hpbGRyZW4sIG1vZGFsKTtcbiAgICB9XG5cbiAgICBuZXh0Q2FyZChtb2RhbDogRmxhc2hjYXJkTW9kYWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmV3Rmxhc2hjYXJkcy5sZW5ndGggKyB0aGlzLmR1ZUZsYXNoY2FyZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kdWVGbGFzaGNhcmRzQ291bnQgKyB0aGlzLm5ld0ZsYXNoY2FyZHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkZWNrIG9mIHRoaXMuc3ViZGVja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2suZHVlRmxhc2hjYXJkc0NvdW50ICsgZGVjay5uZXdGbGFzaGNhcmRzQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50RGVjayA9IGRlY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWNrLm5leHRDYXJkKG1vZGFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50ID09IG1vZGFsLmNoZWNrRGVjaykgbW9kYWwuZGVja3NMaXN0KCk7XG4gICAgICAgICAgICBlbHNlIHRoaXMucGFyZW50IS5uZXh0Q2FyZChtb2RhbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtb2RhbC5yZXNwb25zZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIG1vZGFsLnJlc2V0TGlua1ZpZXcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBtb2RhbC50aXRsZUVsLnNldFRleHQoXG4gICAgICAgICAgICBgJHt0aGlzLmRlY2tOYW1lfSAtICR7XG4gICAgICAgICAgICAgICAgdGhpcy5kdWVGbGFzaGNhcmRzQ291bnQgKyB0aGlzLm5ld0ZsYXNoY2FyZHNDb3VudFxuICAgICAgICAgICAgfWBcbiAgICAgICAgKTtcblxuICAgICAgICBtb2RhbC5hbnN3ZXJCdG4uc3R5bGUuZGlzcGxheSA9IFwiaW5pdGlhbFwiO1xuICAgICAgICBtb2RhbC5mbGFzaGNhcmRWaWV3LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIG1vZGFsLm1vZGUgPSBGbGFzaGNhcmRNb2RhbE1vZGUuRnJvbnQ7XG5cbiAgICAgICAgaWYgKHRoaXMuZHVlRmxhc2hjYXJkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAobW9kYWwucGx1Z2luLmRhdGEuc2V0dGluZ3MucmFuZG9taXplQ2FyZE9yZGVyKVxuICAgICAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkSWR4ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIHRoaXMuZHVlRmxhc2hjYXJkcy5sZW5ndGhcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgZWxzZSBtb2RhbC5jdXJyZW50Q2FyZElkeCA9IDA7XG4gICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZCA9IHRoaXMuZHVlRmxhc2hjYXJkc1ttb2RhbC5jdXJyZW50Q2FyZElkeF07XG4gICAgICAgICAgICBtb2RhbC5yZW5kZXJNYXJrZG93bldyYXBwZXIoXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmQuZnJvbnQsXG4gICAgICAgICAgICAgICAgbW9kYWwuZmxhc2hjYXJkVmlld1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbGV0IGhhcmRJbnRlcnZhbDogbnVtYmVyID0gc2NoZWR1bGUoXG4gICAgICAgICAgICAgICAgUmV2aWV3UmVzcG9uc2UuSGFyZCxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5pbnRlcnZhbCEsXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmQuZWFzZSEsXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmQuZGVsYXlCZWZvcmVSZXZpZXchLFxuICAgICAgICAgICAgICAgIG1vZGFsLnBsdWdpbi5kYXRhLnNldHRpbmdzXG4gICAgICAgICAgICApLmludGVydmFsO1xuICAgICAgICAgICAgbGV0IGdvb2RJbnRlcnZhbDogbnVtYmVyID0gc2NoZWR1bGUoXG4gICAgICAgICAgICAgICAgUmV2aWV3UmVzcG9uc2UuR29vZCxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5pbnRlcnZhbCEsXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmQuZWFzZSEsXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmQuZGVsYXlCZWZvcmVSZXZpZXchLFxuICAgICAgICAgICAgICAgIG1vZGFsLnBsdWdpbi5kYXRhLnNldHRpbmdzXG4gICAgICAgICAgICApLmludGVydmFsO1xuICAgICAgICAgICAgbGV0IGVhc3lJbnRlcnZhbDogbnVtYmVyID0gc2NoZWR1bGUoXG4gICAgICAgICAgICAgICAgUmV2aWV3UmVzcG9uc2UuRWFzeSxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5pbnRlcnZhbCEsXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmQuZWFzZSEsXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmQuZGVsYXlCZWZvcmVSZXZpZXchLFxuICAgICAgICAgICAgICAgIG1vZGFsLnBsdWdpbi5kYXRhLnNldHRpbmdzXG4gICAgICAgICAgICApLmludGVydmFsO1xuXG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5oYXJkQnRuLnNldFRleHQodGV4dEludGVydmFsKGhhcmRJbnRlcnZhbCwgdHJ1ZSkpO1xuICAgICAgICAgICAgICAgIG1vZGFsLmdvb2RCdG4uc2V0VGV4dCh0ZXh0SW50ZXJ2YWwoZ29vZEludGVydmFsLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgbW9kYWwuZWFzeUJ0bi5zZXRUZXh0KHRleHRJbnRlcnZhbChlYXN5SW50ZXJ2YWwsIHRydWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuaGFyZEJ0bi5zZXRUZXh0KFxuICAgICAgICAgICAgICAgICAgICB0KFwiSGFyZFwiKSArIFwiIC0gXCIgKyB0ZXh0SW50ZXJ2YWwoaGFyZEludGVydmFsLCBmYWxzZSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIG1vZGFsLmdvb2RCdG4uc2V0VGV4dChcbiAgICAgICAgICAgICAgICAgICAgdChcIkdvb2RcIikgKyBcIiAtIFwiICsgdGV4dEludGVydmFsKGdvb2RJbnRlcnZhbCwgZmFsc2UpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5lYXN5QnRuLnNldFRleHQoXG4gICAgICAgICAgICAgICAgICAgIHQoXCJFYXN5XCIpICsgXCIgLSBcIiArIHRleHRJbnRlcnZhbChlYXN5SW50ZXJ2YWwsIGZhbHNlKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5uZXdGbGFzaGNhcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChtb2RhbC5wbHVnaW4uZGF0YS5zZXR0aW5ncy5yYW5kb21pemVDYXJkT3JkZXIpXG4gICAgICAgICAgICAgICAgbW9kYWwuY3VycmVudENhcmRJZHggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogdGhpcy5uZXdGbGFzaGNhcmRzLmxlbmd0aFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlbHNlIG1vZGFsLmN1cnJlbnRDYXJkSWR4ID0gMDtcbiAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkID0gdGhpcy5uZXdGbGFzaGNhcmRzW21vZGFsLmN1cnJlbnRDYXJkSWR4XTtcbiAgICAgICAgICAgIG1vZGFsLnJlbmRlck1hcmtkb3duV3JhcHBlcihcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5mcm9udCxcbiAgICAgICAgICAgICAgICBtb2RhbC5mbGFzaGNhcmRWaWV3XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5oYXJkQnRuLnNldFRleHQoXCIxLjBkXCIpO1xuICAgICAgICAgICAgICAgIG1vZGFsLmdvb2RCdG4uc2V0VGV4dChcIjIuNWRcIik7XG4gICAgICAgICAgICAgICAgbW9kYWwuZWFzeUJ0bi5zZXRUZXh0KFwiMy41ZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuaGFyZEJ0bi5zZXRUZXh0KHQoXCJIYXJkXCIpICsgXCIgLSAxLjAgXCIgKyB0KFwiZGF5XCIpKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5nb29kQnRuLnNldFRleHQodChcIkdvb2RcIikgKyBcIiAtIDIuNSBcIiArIHQoXCJkYXlzXCIpKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5lYXN5QnRuLnNldFRleHQodChcIkVhc3lcIikgKyBcIiAtIDMuNSBcIiArIHQoXCJkYXlzXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb2RhbC5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaG93Q29udGV4dEluQ2FyZHMpXG4gICAgICAgICAgICBtb2RhbC5jb250ZXh0Vmlldy5zZXRUZXh0KG1vZGFsLmN1cnJlbnRDYXJkLmNvbnRleHQpO1xuICAgICAgICBpZiAobW9kYWwucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2hvd0ZpbGVOYW1lSW5GaWxlTGluaylcbiAgICAgICAgICAgIG1vZGFsLmZpbGVMaW5rVmlldy5zZXRUZXh0KG1vZGFsLmN1cnJlbnRDYXJkLm5vdGUuYmFzZW5hbWUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE1vZGFsLCBBcHAsIE1hcmtkb3duUmVuZGVyZXIsIFBsYXRmb3JtIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBTUlBsdWdpbiBmcm9tIFwic3JjL21haW5cIjtcbmltcG9ydCB7IGdldEtleXNQcmVzZXJ2ZVR5cGUgfSBmcm9tIFwic3JjL3V0aWxzXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcInNyYy9sYW5nL2hlbHBlcnNcIjtcblxuZXhwb3J0IGNsYXNzIFN0YXRzTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gICAgcHJpdmF0ZSBwbHVnaW46IFNSUGx1Z2luO1xuICAgIHByaXZhdGUgZHVlRGF0ZXNGbGFzaGNhcmRzOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFwcDogQXBwLFxuICAgICAgICBkdWVEYXRlc0ZsYXNoY2FyZHM6IFJlY29yZDxudW1iZXIsIG51bWJlcj4sXG4gICAgICAgIHBsdWdpbjogU1JQbHVnaW5cbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcblxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHMgPSBkdWVEYXRlc0ZsYXNoY2FyZHM7XG5cbiAgICAgICAgdGhpcy50aXRsZUVsLnNldFRleHQodChcIlN0YXRpc3RpY3NcIikpO1xuXG4gICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZSkge1xuICAgICAgICAgICAgdGhpcy5tb2RhbEVsLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgdGhpcy5tb2RhbEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tb2RhbEVsLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgdGhpcy5tb2RhbEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk9wZW4oKTogdm9pZCB7XG4gICAgICAgIGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcblxuICAgICAgICBjb250ZW50RWwuaW5uZXJIVE1MICs9XG4gICAgICAgICAgICBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyJz5cIiArXG4gICAgICAgICAgICBcIjxzcGFuPlwiICtcbiAgICAgICAgICAgIHQoXCJOb3RlIHRoYXQgdGhpcyByZXF1aXJlcyB0aGUgT2JzaWRpYW4gQ2hhcnRzIHBsdWdpbiB0byB3b3JrXCIpICtcbiAgICAgICAgICAgIFwiPC9zcGFuPlwiICtcbiAgICAgICAgICAgIFwiPGgyIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcic+XCIgK1xuICAgICAgICAgICAgdChcIkZvcmVjYXN0XCIpICtcbiAgICAgICAgICAgIFwiPC9oMj5cIiArXG4gICAgICAgICAgICBcIjxoNCBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXInPlwiICtcbiAgICAgICAgICAgIHQoXCJUaGUgbnVtYmVyIG9mIGNhcmRzIGR1ZSBpbiB0aGUgZnV0dXJlXCIpICtcbiAgICAgICAgICAgIFwiPC9oND5cIiArXG4gICAgICAgICAgICBcIjwvZGl2PlwiO1xuXG4gICAgICAgIGxldCBtYXhOOiBudW1iZXIgPSBNYXRoLm1heChcbiAgICAgICAgICAgIC4uLmdldEtleXNQcmVzZXJ2ZVR5cGUodGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHMpXG4gICAgICAgICk7XG4gICAgICAgIGZvciAobGV0IGR1ZU9mZnNldCA9IDA7IGR1ZU9mZnNldCA8PSBtYXhOOyBkdWVPZmZzZXQrKykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmR1ZURhdGVzRmxhc2hjYXJkcy5oYXNPd25Qcm9wZXJ0eShkdWVPZmZzZXQpKVxuICAgICAgICAgICAgICAgIHRoaXMuZHVlRGF0ZXNGbGFzaGNhcmRzW2R1ZU9mZnNldF0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGR1ZURhdGVzRmxhc2hjYXJkc0NvcHk6IFJlY29yZDxudW1iZXIsIG51bWJlcj4gPSB7IDA6IDAgfTtcbiAgICAgICAgZm9yIChsZXQgW2R1ZU9mZnNldCwgZHVlQ291bnRdIG9mIE9iamVjdC5lbnRyaWVzKFxuICAgICAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHNcbiAgICAgICAgKSkge1xuICAgICAgICAgICAgaWYgKGR1ZU9mZnNldCA8PSAwKSBkdWVEYXRlc0ZsYXNoY2FyZHNDb3B5WzBdICs9IGR1ZUNvdW50O1xuICAgICAgICAgICAgZWxzZSBkdWVEYXRlc0ZsYXNoY2FyZHNDb3B5W2R1ZU9mZnNldF0gPSBkdWVDb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPVxuICAgICAgICAgICAgXCJgYGBjaGFydFxcblwiICtcbiAgICAgICAgICAgIFwiXFx0dHlwZTogYmFyXFxuXCIgK1xuICAgICAgICAgICAgYFxcdGxhYmVsczogWyR7T2JqZWN0LmtleXMoZHVlRGF0ZXNGbGFzaGNhcmRzQ29weSl9XVxcbmAgK1xuICAgICAgICAgICAgXCJcXHRzZXJpZXM6XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHQtIHRpdGxlOiBcIiArXG4gICAgICAgICAgICB0KFwiU2NoZWR1bGVkXCIpICtcbiAgICAgICAgICAgIGBcXG5cXHRcXHQgIGRhdGE6IFske09iamVjdC52YWx1ZXMoZHVlRGF0ZXNGbGFzaGNhcmRzQ29weSl9XVxcbmAgK1xuICAgICAgICAgICAgXCJcXHR4VGl0bGU6IFwiICtcbiAgICAgICAgICAgIHQoXCJEYXlzXCIpICtcbiAgICAgICAgICAgIFwiXFxuXFx0eVRpdGxlOiBcIiArXG4gICAgICAgICAgICB0KFwiTnVtYmVyIG9mIGNhcmRzXCIpICtcbiAgICAgICAgICAgIFwiXFxuXFx0bGVnZW5kOiBmYWxzZVxcblwiICtcbiAgICAgICAgICAgIFwiXFx0c3RhY2tlZDogdHJ1ZVxcblwiICtcbiAgICAgICAgICAgIFwiYGBgYFwiO1xuXG4gICAgICAgIE1hcmtkb3duUmVuZGVyZXIucmVuZGVyTWFya2Rvd24odGV4dCwgY29udGVudEVsLCBcIlwiLCB0aGlzLnBsdWdpbik7XG4gICAgfVxuXG4gICAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgICAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJdGVtVmlldywgV29ya3NwYWNlTGVhZiwgTWVudSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHR5cGUgU1JQbHVnaW4gZnJvbSBcInNyYy9tYWluXCI7XG5pbXBvcnQgeyBDT0xMQVBTRV9JQ09OIH0gZnJvbSBcInNyYy9jb25zdGFudHNcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwic3JjL2xhbmcvaGVscGVyc1wiO1xuXG5leHBvcnQgY29uc3QgUkVWSUVXX1FVRVVFX1ZJRVdfVFlQRTogc3RyaW5nID0gXCJyZXZpZXctcXVldWUtbGlzdC12aWV3XCI7XG5cbmV4cG9ydCBjbGFzcyBSZXZpZXdRdWV1ZUxpc3RWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICAgIHByaXZhdGUgcGx1Z2luOiBTUlBsdWdpbjtcbiAgICBwcml2YXRlIGFjdGl2ZUZvbGRlcnM6IFNldDxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcGx1Z2luOiBTUlBsdWdpbikge1xuICAgICAgICBzdXBlcihsZWFmKTtcblxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5hY3RpdmVGb2xkZXJzID0gbmV3IFNldChbdChcIlRvZGF5XCIpXSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoXzogYW55KSA9PiB0aGlzLnJlZHJhdygpKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICAgICAgICB0aGlzLmFwcC52YXVsdC5vbihcInJlbmFtZVwiLCAoXzogYW55KSA9PiB0aGlzLnJlZHJhdygpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gUkVWSUVXX1FVRVVFX1ZJRVdfVFlQRTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHQoXCJOb3RlcyBSZXZpZXcgUXVldWVcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEljb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiY3Jvc3NoYWlyc1wiO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkhlYWRlck1lbnUobWVudTogTWVudSk6IHZvaWQge1xuICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUodChcIkNsb3NlXCIpKVxuICAgICAgICAgICAgICAgIC5zZXRJY29uKFwiY3Jvc3NcIilcbiAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5kZXRhY2hMZWF2ZXNPZlR5cGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVZJRVdfUVVFVUVfVklFV19UWVBFXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWRyYXcoKTogdm9pZCB7XG4gICAgICAgIGxldCBvcGVuRmlsZTogVEZpbGUgfCBudWxsID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcblxuICAgICAgICBsZXQgcm9vdEVsOiBIVE1MRWxlbWVudCA9IGNyZWF0ZURpdihcIm5hdi1mb2xkZXIgbW9kLXJvb3RcIiksXG4gICAgICAgICAgICBjaGlsZHJlbkVsOiBIVE1MRWxlbWVudCA9IHJvb3RFbC5jcmVhdGVEaXYoXCJuYXYtZm9sZGVyLWNoaWxkcmVuXCIpO1xuXG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5uZXdOb3Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgbmV3Tm90ZXNGb2xkZXJFbDogSFRNTEVsZW1lbnQgPSB0aGlzLmNyZWF0ZVJpZ2h0UGFuZUZvbGRlcihcbiAgICAgICAgICAgICAgICBjaGlsZHJlbkVsLFxuICAgICAgICAgICAgICAgIHQoXCJOZXdcIiksXG4gICAgICAgICAgICAgICAgIXRoaXMuYWN0aXZlRm9sZGVycy5oYXModChcIk5ld1wiKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IG5ld0ZpbGUgb2YgdGhpcy5wbHVnaW4ubmV3Tm90ZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJpZ2h0UGFuZUZpbGUoXG4gICAgICAgICAgICAgICAgICAgIG5ld05vdGVzRm9sZGVyRWwsXG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbGUsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5GaWxlICE9PSBudWxsICYmIG5ld0ZpbGUucGF0aCA9PT0gb3BlbkZpbGUucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuYWN0aXZlRm9sZGVycy5oYXModChcIk5ld1wiKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNjaGVkdWxlZE5vdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBub3c6IG51bWJlciA9IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgY3VyclVuaXg6IG51bWJlciA9IC0xO1xuICAgICAgICAgICAgbGV0IGZvbGRlckVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsLFxuICAgICAgICAgICAgICAgIGZvbGRlclRpdGxlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IG1heERheXNUb1JlbmRlcjogbnVtYmVyID1cbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heE5EYXlzTm90ZXNSZXZpZXdRdWV1ZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgc05vdGUgb2YgdGhpcy5wbHVnaW4uc2NoZWR1bGVkTm90ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc05vdGUuZHVlVW5peCAhPT0gY3VyclVuaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5EYXlzOiBudW1iZXIgPSBNYXRoLmNlaWwoXG4gICAgICAgICAgICAgICAgICAgICAgICAoc05vdGUuZHVlVW5peCAtIG5vdykgLyAoMjQgKiAzNjAwICogMTAwMClcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobkRheXMgPiBtYXhEYXlzVG9SZW5kZXIpIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvbGRlclRpdGxlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5EYXlzID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdChcIlllc3RlcmRheVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbkRheXMgPT09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHQoXCJUb2RheVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbkRheXMgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHQoXCJUb21vcnJvd1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV3IERhdGUoc05vdGUuZHVlVW5peCkudG9EYXRlU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyRWwgPSB0aGlzLmNyZWF0ZVJpZ2h0UGFuZUZvbGRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuRWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXJUaXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLmFjdGl2ZUZvbGRlcnMuaGFzKGZvbGRlclRpdGxlKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjdXJyVW5peCA9IHNOb3RlLmR1ZVVuaXg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSaWdodFBhbmVGaWxlKFxuICAgICAgICAgICAgICAgICAgICBmb2xkZXJFbCEsXG4gICAgICAgICAgICAgICAgICAgIHNOb3RlLm5vdGUsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5GaWxlICE9PSBudWxsICYmIHNOb3RlLm5vdGUucGF0aCA9PT0gb3BlbkZpbGUucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuYWN0aXZlRm9sZGVycy5oYXMoZm9sZGVyVGl0bGUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb250ZW50RWw6IEVsZW1lbnQgPSB0aGlzLmNvbnRhaW5lckVsLmNoaWxkcmVuWzFdO1xuICAgICAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICAgICAgY29udGVudEVsLmFwcGVuZENoaWxkKHJvb3RFbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVSaWdodFBhbmVGb2xkZXIoXG4gICAgICAgIHBhcmVudEVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgZm9sZGVyVGl0bGU6IHN0cmluZyxcbiAgICAgICAgY29sbGFwc2VkOiBib29sZWFuXG4gICAgKTogSFRNTEVsZW1lbnQge1xuICAgICAgICBsZXQgZm9sZGVyRWw6IEhUTUxEaXZFbGVtZW50ID0gcGFyZW50RWwuY3JlYXRlRGl2KFwibmF2LWZvbGRlclwiKSxcbiAgICAgICAgICAgIGZvbGRlclRpdGxlRWw6IEhUTUxEaXZFbGVtZW50ID1cbiAgICAgICAgICAgICAgICBmb2xkZXJFbC5jcmVhdGVEaXYoXCJuYXYtZm9sZGVyLXRpdGxlXCIpLFxuICAgICAgICAgICAgY2hpbGRyZW5FbDogSFRNTERpdkVsZW1lbnQgPSBmb2xkZXJFbC5jcmVhdGVEaXYoXG4gICAgICAgICAgICAgICAgXCJuYXYtZm9sZGVyLWNoaWxkcmVuXCJcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBjb2xsYXBzZUljb25FbDogSFRNTERpdkVsZW1lbnQgPSBmb2xkZXJUaXRsZUVsLmNyZWF0ZURpdihcbiAgICAgICAgICAgICAgICBcIm5hdi1mb2xkZXItY29sbGFwc2UtaW5kaWNhdG9yIGNvbGxhcHNlLWljb25cIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICBjb2xsYXBzZUljb25FbC5pbm5lckhUTUwgPSBDT0xMQVBTRV9JQ09OO1xuICAgICAgICBpZiAoY29sbGFwc2VkKVxuICAgICAgICAgICAgKGNvbGxhcHNlSWNvbkVsLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgXCJyb3RhdGUoLTkwZGVnKVwiO1xuXG4gICAgICAgIGZvbGRlclRpdGxlRWxcbiAgICAgICAgICAgIC5jcmVhdGVEaXYoXCJuYXYtZm9sZGVyLXRpdGxlLWNvbnRlbnRcIilcbiAgICAgICAgICAgIC5zZXRUZXh0KGZvbGRlclRpdGxlKTtcblxuICAgICAgICBmb2xkZXJUaXRsZUVsLm9uQ2xpY2tFdmVudCgoXykgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW5FbC5jaGlsZE5vZGVzIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+KSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5zdHlsZS5kaXNwbGF5ID09PSBcImJsb2NrXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9PT0gXCJcIlxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlSWNvbkVsLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgKS5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZSgtOTBkZWcpXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlRm9sZGVycy5kZWxldGUoZm9sZGVyVGl0bGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlSWNvbkVsLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgKS5zdHlsZS50cmFuc2Zvcm0gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUZvbGRlcnMuYWRkKGZvbGRlclRpdGxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmb2xkZXJFbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVJpZ2h0UGFuZUZpbGUoXG4gICAgICAgIGZvbGRlckVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgZmlsZTogVEZpbGUsXG4gICAgICAgIGZpbGVFbEFjdGl2ZTogYm9vbGVhbixcbiAgICAgICAgaGlkZGVuOiBib29sZWFuXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGxldCBuYXZGaWxlRWw6IEhUTUxFbGVtZW50ID0gZm9sZGVyRWxcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmF2LWZvbGRlci1jaGlsZHJlblwiKVswXVxuICAgICAgICAgICAgLmNyZWF0ZURpdihcIm5hdi1maWxlXCIpO1xuICAgICAgICBpZiAoaGlkZGVuKSBuYXZGaWxlRWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGxldCBuYXZGaWxlVGl0bGU6IEhUTUxFbGVtZW50ID0gbmF2RmlsZUVsLmNyZWF0ZURpdihcIm5hdi1maWxlLXRpdGxlXCIpO1xuICAgICAgICBpZiAoZmlsZUVsQWN0aXZlKSBuYXZGaWxlVGl0bGUuYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG5cbiAgICAgICAgbmF2RmlsZVRpdGxlLmNyZWF0ZURpdihcIm5hdi1maWxlLXRpdGxlLWNvbnRlbnRcIikuc2V0VGV4dChmaWxlLmJhc2VuYW1lKTtcbiAgICAgICAgbmF2RmlsZVRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLm9wZW5GaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIG5hdkZpbGVUaXRsZS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjb250ZXh0bWVudVwiLFxuICAgICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZU1lbnU6IE1lbnUgPSBuZXcgTWVudSh0aGlzLmFwcCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoXG4gICAgICAgICAgICAgICAgICAgIFwiZmlsZS1tZW51XCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVNZW51LFxuICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICBcIm15LWNvbnRleHQtbWVudVwiLFxuICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBmaWxlTWVudS5zaG93QXRQb3NpdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIHg6IGV2ZW50LnBhZ2VYLFxuICAgICAgICAgICAgICAgICAgICB5OiBldmVudC5wYWdlWSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYXJkVHlwZSB9IGZyb20gXCJzcmMvdHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKFxuICAgIGZpbGVUZXh0OiBzdHJpbmcsXG4gICAgc2luZ2xlbGluZUNhcmRTZXBhcmF0b3I6IHN0cmluZyxcbiAgICBzaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yOiBzdHJpbmcsXG4gICAgbXVsdGlsaW5lQ2FyZFNlcGFyYXRvcjogc3RyaW5nLFxuICAgIG11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcjogc3RyaW5nXG4pOiBbQ2FyZFR5cGUsIHN0cmluZywgbnVtYmVyXVtdIHtcbiAgICBsZXQgY2FyZFRleHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgbGV0IGNhcmRzOiBbQ2FyZFR5cGUsIHN0cmluZywgbnVtYmVyXVtdID0gW107XG4gICAgbGV0IGNhcmRUeXBlOiBDYXJkVHlwZSB8IG51bGwgPSBudWxsO1xuICAgIGxldCBsaW5lTm86IG51bWJlciA9IDA7XG5cbiAgICBsZXQgbGluZXM6IHN0cmluZ1tdID0gZmlsZVRleHQuc3BsaXQoXCJcXG5cIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobGluZXNbaV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoY2FyZFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXJkcy5wdXNoKFtjYXJkVHlwZSwgY2FyZFRleHQsIGxpbmVOb10pO1xuICAgICAgICAgICAgICAgIGNhcmRUeXBlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FyZFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBsaW5lc1tpXS5zdGFydHNXaXRoKFwiPCEtLVwiKSAmJlxuICAgICAgICAgICAgIWxpbmVzW2ldLnN0YXJ0c1dpdGgoXCI8IS0tU1I6XCIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgd2hpbGUgKGkgKyAxIDwgbGluZXMubGVuZ3RoICYmICFsaW5lc1tpICsgMV0uaW5jbHVkZXMoXCItLT5cIikpIGkrKztcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhcmRUZXh0Lmxlbmd0aCA+IDApIGNhcmRUZXh0ICs9IFwiXFxuXCI7XG4gICAgICAgIGNhcmRUZXh0ICs9IGxpbmVzW2ldO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGxpbmVzW2ldLmluY2x1ZGVzKHNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IpIHx8XG4gICAgICAgICAgICBsaW5lc1tpXS5pbmNsdWRlcyhzaW5nbGVsaW5lQ2FyZFNlcGFyYXRvcilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjYXJkVHlwZSA9IGxpbmVzW2ldLmluY2x1ZGVzKHNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IpXG4gICAgICAgICAgICAgICAgPyBDYXJkVHlwZS5TaW5nbGVMaW5lUmV2ZXJzZWRcbiAgICAgICAgICAgICAgICA6IENhcmRUeXBlLlNpbmdsZUxpbmVCYXNpYztcbiAgICAgICAgICAgIGNhcmRUZXh0ID0gbGluZXNbaV07XG4gICAgICAgICAgICBsaW5lTm8gPSBpO1xuICAgICAgICAgICAgaWYgKGkgKyAxIDwgbGluZXMubGVuZ3RoICYmIGxpbmVzW2kgKyAxXS5zdGFydHNXaXRoKFwiPCEtLVNSOlwiKSkge1xuICAgICAgICAgICAgICAgIGNhcmRUZXh0ICs9IFwiXFxuXCIgKyBsaW5lc1tpICsgMV07XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FyZHMucHVzaChbY2FyZFR5cGUsIGNhcmRUZXh0LCBsaW5lTm9dKTtcbiAgICAgICAgICAgIGNhcmRUeXBlID0gbnVsbDtcbiAgICAgICAgICAgIGNhcmRUZXh0ID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChjYXJkVHlwZSA9PT0gbnVsbCAmJiAvPT0uKj89PS9nbS50ZXN0KGxpbmVzW2ldKSkge1xuICAgICAgICAgICAgY2FyZFR5cGUgPSBDYXJkVHlwZS5DbG96ZTtcbiAgICAgICAgICAgIGxpbmVObyA9IGk7XG4gICAgICAgIH0gZWxzZSBpZiAobGluZXNbaV0gPT09IG11bHRpbGluZUNhcmRTZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIGNhcmRUeXBlID0gQ2FyZFR5cGUuTXVsdGlMaW5lQmFzaWM7XG4gICAgICAgICAgICBsaW5lTm8gPSBpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpbmVzW2ldID09PSBtdWx0aWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIGNhcmRUeXBlID0gQ2FyZFR5cGUuTXVsdGlMaW5lUmV2ZXJzZWQ7XG4gICAgICAgICAgICBsaW5lTm8gPSBpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpbmVzW2ldLnN0YXJ0c1dpdGgoXCJgYGBcIikpIHtcbiAgICAgICAgICAgIHdoaWxlIChpICsgMSA8IGxpbmVzLmxlbmd0aCAmJiAhbGluZXNbaSArIDFdLnN0YXJ0c1dpdGgoXCJgYGBcIikpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY2FyZFRleHQgKz0gXCJcXG5cIiArIGxpbmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FyZFRleHQgKz0gXCJcXG5cIiArIFwiYGBgXCI7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2FyZFR5cGUgJiYgY2FyZFRleHQpIGNhcmRzLnB1c2goW2NhcmRUeXBlLCBjYXJkVGV4dCwgbGluZU5vXSk7XG5cbiAgICByZXR1cm4gY2FyZHM7XG59XG4iLCJpbXBvcnQge1xyXG4gICAgTm90aWNlLFxyXG4gICAgUGx1Z2luLFxyXG4gICAgYWRkSWNvbixcclxuICAgIFRBYnN0cmFjdEZpbGUsXHJcbiAgICBURmlsZSxcclxuICAgIEhlYWRpbmdDYWNoZSxcclxuICAgIGdldEFsbFRhZ3MsXHJcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCAqIGFzIGdyYXBoIGZyb20gXCJwYWdlcmFuay5qc1wiO1xyXG5cclxuaW1wb3J0IHsgU1JTZXR0aW5nVGFiLCBTUlNldHRpbmdzLCBERUZBVUxUX1NFVFRJTkdTIH0gZnJvbSBcInNyYy9zZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBGbGFzaGNhcmRNb2RhbCwgRGVjayB9IGZyb20gXCJzcmMvZmxhc2hjYXJkLW1vZGFsXCI7XHJcbmltcG9ydCB7IFN0YXRzTW9kYWwgfSBmcm9tIFwic3JjL3N0YXRzLW1vZGFsXCI7XHJcbmltcG9ydCB7IFJldmlld1F1ZXVlTGlzdFZpZXcsIFJFVklFV19RVUVVRV9WSUVXX1RZUEUgfSBmcm9tIFwic3JjL3NpZGViYXJcIjtcclxuaW1wb3J0IHsgQ2FyZCwgUmV2aWV3UmVzcG9uc2UsIHNjaGVkdWxlIH0gZnJvbSBcInNyYy9zY2hlZHVsaW5nXCI7XHJcbmltcG9ydCB7IENhcmRUeXBlIH0gZnJvbSBcInNyYy90eXBlc1wiO1xyXG5pbXBvcnQge1xyXG4gICAgQ1JPU1NfSEFJUlNfSUNPTixcclxuICAgIFlBTUxfRlJPTlRfTUFUVEVSX1JFR0VYLFxyXG4gICAgU0NIRURVTElOR19JTkZPX1JFR0VYLFxyXG4gICAgTEVHQUNZX1NDSEVEVUxJTkdfRVhUUkFDVE9SLFxyXG4gICAgTVVMVElfU0NIRURVTElOR19FWFRSQUNUT1IsXHJcbn0gZnJvbSBcInNyYy9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgZXNjYXBlUmVnZXhTdHJpbmcsIGN5cmI1MyB9IGZyb20gXCJzcmMvdXRpbHNcIjtcclxuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9oZWxwZXJzXCI7XHJcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSBcInNyYy9wYXJzZXJcIjtcclxuaW1wb3J0IHsgTG9nZ2VyLCBjcmVhdGVMb2dnZXIgfSBmcm9tIFwic3JjL2xvZ2dlclwiO1xyXG5cclxuaW50ZXJmYWNlIFBsdWdpbkRhdGEge1xyXG4gICAgc2V0dGluZ3M6IFNSU2V0dGluZ3M7XHJcbiAgICBidXJ5RGF0ZTogc3RyaW5nO1xyXG4gICAgLy8gaGFzaGVzIG9mIGNhcmQgdGV4dHNcclxuICAgIC8vIHNob3VsZCB3b3JrIGFzIGxvbmcgYXMgdXNlciBkb2Vzbid0IG1vZGlmeSBjYXJkJ3MgdGV4dFxyXG4gICAgLy8gd2hpY2ggY292ZXJzIG1vc3Qgb2YgdGhlIGNhc2VzXHJcbiAgICBidXJ5TGlzdDogc3RyaW5nW107XHJcbiAgICBjYWNoZTogUmVjb3JkPHN0cmluZywgU1JGaWxlQ2FjaGU+OyAvLyBSZWNvcmQ8bGFzdCBrbm93biBwYXRoLCBTUkZpbGVDYWNoZT5cclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9EQVRBOiBQbHVnaW5EYXRhID0ge1xyXG4gICAgc2V0dGluZ3M6IERFRkFVTFRfU0VUVElOR1MsXHJcbiAgICBidXJ5RGF0ZTogXCJcIixcclxuICAgIGJ1cnlMaXN0OiBbXSxcclxuICAgIGNhY2hlOiB7fSxcclxufTtcclxuXHJcbmludGVyZmFjZSBTUkZpbGVDYWNoZSB7XHJcbiAgICB0b3RhbENhcmRzOiBudW1iZXI7XHJcbiAgICBoYXNOZXdDYXJkczogYm9vbGVhbjtcclxuICAgIG5leHREdWVEYXRlOiBzdHJpbmc7XHJcbiAgICBsYXN0VXBkYXRlZDogbnVtYmVyO1xyXG4gICAgZHVlRGF0ZXNGbGFzaGNhcmRzOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVkTm90ZSB7XHJcbiAgICBub3RlOiBURmlsZTtcclxuICAgIGR1ZVVuaXg6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMaW5rU3RhdCB7XHJcbiAgICBzb3VyY2VQYXRoOiBzdHJpbmc7XHJcbiAgICBsaW5rQ291bnQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1JQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG4gICAgcHJpdmF0ZSBzdGF0dXNCYXI6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZXZpZXdRdWV1ZVZpZXc6IFJldmlld1F1ZXVlTGlzdFZpZXc7XHJcbiAgICBwdWJsaWMgZGF0YTogUGx1Z2luRGF0YTtcclxuICAgIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcclxuXHJcbiAgICBwdWJsaWMgbmV3Tm90ZXM6IFRGaWxlW10gPSBbXTtcclxuICAgIHB1YmxpYyBzY2hlZHVsZWROb3RlczogU2NoZWROb3RlW10gPSBbXTtcclxuICAgIHByaXZhdGUgZWFzZUJ5UGF0aDogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBpbmNvbWluZ0xpbmtzOiBSZWNvcmQ8c3RyaW5nLCBMaW5rU3RhdFtdPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBwYWdlcmFua3M6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcclxuICAgIHByaXZhdGUgZHVlTm90ZXNDb3VudDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBkdWVEYXRlc05vdGVzOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+ID0ge307IC8vIFJlY29yZDwjIG9mIGRheXMgaW4gZnV0dXJlLCBkdWUgY291bnQ+XHJcblxyXG4gICAgcHVibGljIGRlY2tUcmVlOiBEZWNrID0gbmV3IERlY2soXCJyb290XCIsIG51bGwpO1xyXG4gICAgcHVibGljIGR1ZURhdGVzRmxhc2hjYXJkczogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9OyAvLyBSZWNvcmQ8IyBvZiBkYXlzIGluIGZ1dHVyZSwgZHVlIGNvdW50PlxyXG5cclxuICAgIC8vIHByZXZlbnQgY2FsbGluZyB0aGVzZSBmdW5jdGlvbnMgaWYgYW5vdGhlciBpbnN0YW5jZSBpcyBhbHJlYWR5IHJ1bm5pbmdcclxuICAgIHByaXZhdGUgbm90ZXNTeW5jTG9jazogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBmbGFzaGNhcmRzU3luY0xvY2s6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkUGx1Z2luRGF0YSgpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gY3JlYXRlTG9nZ2VyKGNvbnNvbGUsIHRoaXMuZGF0YS5zZXR0aW5ncy5sb2dMZXZlbCk7XHJcblxyXG4gICAgICAgIGFkZEljb24oXCJjcm9zc2hhaXJzXCIsIENST1NTX0hBSVJTX0lDT04pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXR1c0JhciA9IHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLmNsYXNzTGlzdC5hZGQoXCJtb2QtY2xpY2thYmxlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcIk9wZW4gYSBub3RlIGZvciByZXZpZXdcIikpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWwtcG9zaXRpb25cIiwgXCJ0b3BcIik7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNCYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm5vdGVzU3luY0xvY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3luYygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXZpZXdOZXh0Tm90ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImNyb3NzaGFpcnNcIiwgdChcIlJldmlldyBmbGFzaGNhcmRzXCIpLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5mbGFzaGNhcmRzU3luY0xvY2spIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmxhc2hjYXJkc19zeW5jKCk7XHJcbiAgICAgICAgICAgICAgICBuZXcgRmxhc2hjYXJkTW9kYWwodGhpcy5hcHAsIHRoaXMpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcclxuICAgICAgICAgICAgUkVWSUVXX1FVRVVFX1ZJRVdfVFlQRSxcclxuICAgICAgICAgICAgKGxlYWYpID0+XHJcbiAgICAgICAgICAgICAgICAodGhpcy5yZXZpZXdRdWV1ZVZpZXcgPSBuZXcgUmV2aWV3UXVldWVMaXN0VmlldyhsZWFmLCB0aGlzKSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZGF0YS5zZXR0aW5ncy5kaXNhYmxlRmlsZU1lbnVSZXZpZXdPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudChcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcclxuICAgICAgICAgICAgICAgICAgICBcImZpbGUtbWVudVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIChtZW51LCBmaWxlaXNoOiBUQWJzdHJhY3RGaWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVpc2ggaW5zdGFuY2VvZiBURmlsZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZWlzaC5leHRlbnNpb24gPT09IFwibWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUodChcIlJldmlldzogRWFzeVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJjcm9zc2hhaXJzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKChfKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVSZXZpZXdSZXNwb25zZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlaXNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJldmlld1Jlc3BvbnNlLkVhc3lcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRUaXRsZSh0KFwiUmV2aWV3OiBHb29kXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcImNyb3NzaGFpcnNcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKF8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVJldmlld1Jlc3BvbnNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVpc2gsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmV2aWV3UmVzcG9uc2UuR29vZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHQoXCJSZXZpZXc6IEhhcmRcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwiY3Jvc3NoYWlyc1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoXykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlUmV2aWV3UmVzcG9uc2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZWlzaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXZpZXdSZXNwb25zZS5IYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6IFwic3JzLW5vdGUtcmV2aWV3LW9wZW4tbm90ZVwiLFxyXG4gICAgICAgICAgICBuYW1lOiB0KFwiT3BlbiBhIG5vdGUgZm9yIHJldmlld1wiKSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5ub3Rlc1N5bmNMb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZpZXdOZXh0Tm90ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogXCJzcnMtbm90ZS1yZXZpZXctZWFzeVwiLFxyXG4gICAgICAgICAgICBuYW1lOiB0KFwiUmV2aWV3IG5vdGUgYXMgZWFzeVwiKSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBvcGVuRmlsZTogVEZpbGUgfCBudWxsID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVuRmlsZSAmJiBvcGVuRmlsZS5leHRlbnNpb24gPT09IFwibWRcIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVSZXZpZXdSZXNwb25zZShvcGVuRmlsZSwgUmV2aWV3UmVzcG9uc2UuRWFzeSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgICAgICAgIGlkOiBcInNycy1ub3RlLXJldmlldy1nb29kXCIsXHJcbiAgICAgICAgICAgIG5hbWU6IHQoXCJSZXZpZXcgbm90ZSBhcyBnb29kXCIpLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wZW5GaWxlOiBURmlsZSB8IG51bGwgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZW5GaWxlICYmIG9wZW5GaWxlLmV4dGVuc2lvbiA9PT0gXCJtZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVJldmlld1Jlc3BvbnNlKG9wZW5GaWxlLCBSZXZpZXdSZXNwb25zZS5Hb29kKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6IFwic3JzLW5vdGUtcmV2aWV3LWhhcmRcIixcclxuICAgICAgICAgICAgbmFtZTogdChcIlJldmlldyBub3RlIGFzIGhhcmRcIiksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3BlbkZpbGU6IFRGaWxlIHwgbnVsbCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlbkZpbGUgJiYgb3BlbkZpbGUuZXh0ZW5zaW9uID09PSBcIm1kXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlUmV2aWV3UmVzcG9uc2Uob3BlbkZpbGUsIFJldmlld1Jlc3BvbnNlLkhhcmQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogXCJzcnMtcmV2aWV3LWZsYXNoY2FyZHNcIixcclxuICAgICAgICAgICAgbmFtZTogdChcIlJldmlldyBmbGFzaGNhcmRzXCIpLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZsYXNoY2FyZHNTeW5jTG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmxhc2hjYXJkc19zeW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEZsYXNoY2FyZE1vZGFsKHRoaXMuYXBwLCB0aGlzKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgICAgICAgIGlkOiBcInNycy12aWV3LXN0YXRzXCIsXHJcbiAgICAgICAgICAgIG5hbWU6IHQoXCJWaWV3IHN0YXRpc3RpY3NcIiksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXcgU3RhdHNNb2RhbCh0aGlzLmFwcCwgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHMsIHRoaXMpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBTUlNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zeW5jKCksIDIwMDApO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZmxhc2hjYXJkc19zeW5jKCksIDIwMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9udW5sb2FkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZVxyXG4gICAgICAgICAgICAuZ2V0TGVhdmVzT2ZUeXBlKFJFVklFV19RVUVVRV9WSUVXX1RZUEUpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChsZWFmKSA9PiBsZWFmLmRldGFjaCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzeW5jKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGlmICh0aGlzLm5vdGVzU3luY0xvY2spIHJldHVybjtcclxuICAgICAgICB0aGlzLm5vdGVzU3luY0xvY2sgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgbm90ZXM6IFRGaWxlW10gPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZWROb3RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZWFzZUJ5UGF0aCA9IHt9O1xyXG4gICAgICAgIHRoaXMubmV3Tm90ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmluY29taW5nTGlua3MgPSB7fTtcclxuICAgICAgICB0aGlzLnBhZ2VyYW5rcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuZHVlTm90ZXNDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5kdWVEYXRlc05vdGVzID0ge307XHJcblxyXG4gICAgICAgIGxldCBub3c6IG51bWJlciA9IERhdGUubm93KCk7XHJcbiAgICAgICAgZm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbmNvbWluZ0xpbmtzW25vdGUucGF0aF0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb21pbmdMaW5rc1tub3RlLnBhdGhdID0gW107XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlua3MgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLnJlc29sdmVkTGlua3Nbbm90ZS5wYXRoXSB8fCB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgdGFyZ2V0UGF0aCBpbiBsaW5rcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5jb21pbmdMaW5rc1t0YXJnZXRQYXRoXSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jb21pbmdMaW5rc1t0YXJnZXRQYXRoXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1hcmtkb3duIGZpbGVzIG9ubHlcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRQYXRoLnNwbGl0KFwiLlwiKS5wb3AoKSEudG9Mb3dlckNhc2UoKSA9PT0gXCJtZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNvbWluZ0xpbmtzW3RhcmdldFBhdGhdLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VQYXRoOiBub3RlLnBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtDb3VudDogbGlua3NbdGFyZ2V0UGF0aF0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLmxpbmsobm90ZS5wYXRoLCB0YXJnZXRQYXRoLCBsaW5rc1t0YXJnZXRQYXRoXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBmaWxlQ2FjaGVkRGF0YSA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShub3RlKSB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIGxldCBmcm9udG1hdHRlciA9XHJcbiAgICAgICAgICAgICAgICBmaWxlQ2FjaGVkRGF0YS5mcm9udG1hdHRlciB8fCA8UmVjb3JkPHN0cmluZywgYW55Pj57fTtcclxuICAgICAgICAgICAgbGV0IHRhZ3MgPSBnZXRBbGxUYWdzKGZpbGVDYWNoZWREYXRhKSB8fCBbXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG91bGRJZ25vcmU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBvdXRlcjogZm9yIChsZXQgdGFnIG9mIHRhZ3MpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHRhZ1RvUmV2aWV3IG9mIHRoaXMuZGF0YS5zZXR0aW5ncy50YWdzVG9SZXZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZyA9PT0gdGFnVG9SZXZpZXcgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnLnN0YXJ0c1dpdGgodGFnVG9SZXZpZXcgKyBcIi9cIilcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkSWdub3JlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNob3VsZElnbm9yZSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAvLyBmaWxlIGhhcyBubyBzY2hlZHVsaW5nIGluZm9ybWF0aW9uXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICEoXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbnRtYXR0ZXIuaGFzT3duUHJvcGVydHkoXCJzci1kdWVcIikgJiZcclxuICAgICAgICAgICAgICAgICAgICBmcm9udG1hdHRlci5oYXNPd25Qcm9wZXJ0eShcInNyLWludGVydmFsXCIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbnRtYXR0ZXIuaGFzT3duUHJvcGVydHkoXCJzci1lYXNlXCIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdOb3Rlcy5wdXNoKG5vdGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBkdWVVbml4OiBudW1iZXIgPSB3aW5kb3dcclxuICAgICAgICAgICAgICAgIC5tb21lbnQoZnJvbnRtYXR0ZXJbXCJzci1kdWVcIl0sIFtcclxuICAgICAgICAgICAgICAgICAgICBcIllZWVktTU0tRERcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRELU1NLVlZWVlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRkZCBNTU0gREQgWVlZWVwiLFxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgIC52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkTm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBub3RlLFxyXG4gICAgICAgICAgICAgICAgZHVlVW5peCxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVhc2VCeVBhdGhbbm90ZS5wYXRoXSA9IGZyb250bWF0dGVyW1wic3ItZWFzZVwiXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkdWVVbml4IDw9IG5vdykgdGhpcy5kdWVOb3Rlc0NvdW50Kys7XHJcbiAgICAgICAgICAgIGxldCBuRGF5czogbnVtYmVyID0gTWF0aC5jZWlsKChkdWVVbml4IC0gbm93KSAvICgyNCAqIDM2MDAgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kdWVEYXRlc05vdGVzLmhhc093blByb3BlcnR5KG5EYXlzKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVlRGF0ZXNOb3Rlc1tuRGF5c10gPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmR1ZURhdGVzTm90ZXNbbkRheXNdKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncmFwaC5yYW5rKDAuODUsIDAuMDAwMDAxLCAobm9kZTogc3RyaW5nLCByYW5rOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlcmFua3Nbbm9kZV0gPSByYW5rICogMTAwMDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHNvcnQgbmV3IG5vdGVzIGJ5IGltcG9ydGFuY2VcclxuICAgICAgICB0aGlzLm5ld05vdGVzID0gdGhpcy5uZXdOb3Rlcy5zb3J0KFxyXG4gICAgICAgICAgICAoYTogVEZpbGUsIGI6IFRGaWxlKSA9PlxyXG4gICAgICAgICAgICAgICAgKHRoaXMucGFnZXJhbmtzW2IucGF0aF0gfHwgMCkgLSAodGhpcy5wYWdlcmFua3NbYS5wYXRoXSB8fCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIHNvcnQgc2NoZWR1bGVkIG5vdGVzIGJ5IGRhdGUgJiB3aXRoaW4gdGhvc2UgZGF5cywgc29ydCB0aGVtIGJ5IGltcG9ydGFuY2VcclxuICAgICAgICB0aGlzLnNjaGVkdWxlZE5vdGVzID0gdGhpcy5zY2hlZHVsZWROb3Rlcy5zb3J0KFxyXG4gICAgICAgICAgICAoYTogU2NoZWROb3RlLCBiOiBTY2hlZE5vdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IGEuZHVlVW5peCAtIGIuZHVlVW5peDtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBhZ2VyYW5rc1tiLm5vdGUucGF0aF0gfHwgMCkgLVxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBhZ2VyYW5rc1thLm5vdGUucGF0aF0gfHwgMClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgbm90ZUNvdW50VGV4dDogc3RyaW5nID1cclxuICAgICAgICAgICAgdGhpcy5kdWVOb3Rlc0NvdW50ID09PSAxID8gdChcIm5vdGVcIikgOiB0KFwibm90ZXNcIik7XHJcbiAgICAgICAgbGV0IGNhcmRDb3VudFRleHQ6IHN0cmluZyA9XHJcbiAgICAgICAgICAgIHRoaXMuZGVja1RyZWUuZHVlRmxhc2hjYXJkc0NvdW50ID09PSAxID8gdChcImNhcmRcIikgOiB0KFwiY2FyZHNcIik7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0VGV4dChcclxuICAgICAgICAgICAgdChcIlJldmlld1wiKSArXHJcbiAgICAgICAgICAgICAgICBgOiAke3RoaXMuZHVlTm90ZXNDb3VudH0gJHtub3RlQ291bnRUZXh0fSwgYCArXHJcbiAgICAgICAgICAgICAgICBgJHt0aGlzLmRlY2tUcmVlLmR1ZUZsYXNoY2FyZHNDb3VudH0gJHtjYXJkQ291bnRUZXh0fSBgICtcclxuICAgICAgICAgICAgICAgIHQoXCJkdWVcIilcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmV2aWV3UXVldWVWaWV3LnJlZHJhdygpO1xyXG5cclxuICAgICAgICB0aGlzLm5vdGVzU3luY0xvY2sgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzYXZlUmV2aWV3UmVzcG9uc2UoXHJcbiAgICAgICAgbm90ZTogVEZpbGUsXHJcbiAgICAgICAgcmVzcG9uc2U6IFJldmlld1Jlc3BvbnNlXHJcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgZmlsZUNhY2hlZERhdGEgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShub3RlKSB8fCB7fTtcclxuICAgICAgICBsZXQgZnJvbnRtYXR0ZXIgPSBmaWxlQ2FjaGVkRGF0YS5mcm9udG1hdHRlciB8fCA8UmVjb3JkPHN0cmluZywgYW55Pj57fTtcclxuXHJcbiAgICAgICAgbGV0IHRhZ3MgPSBnZXRBbGxUYWdzKGZpbGVDYWNoZWREYXRhKSB8fCBbXTtcclxuICAgICAgICBsZXQgc2hvdWxkSWdub3JlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBvdXRlcjogZm9yIChsZXQgdGFnIG9mIHRhZ3MpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgdGFnVG9SZXZpZXcgb2YgdGhpcy5kYXRhLnNldHRpbmdzLnRhZ3NUb1Jldmlldykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhZyA9PT0gdGFnVG9SZXZpZXcgfHwgdGFnLnN0YXJ0c1dpdGgodGFnVG9SZXZpZXcgKyBcIi9cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG91bGRJZ25vcmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNob3VsZElnbm9yZSkge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKFxyXG4gICAgICAgICAgICAgICAgdChcclxuICAgICAgICAgICAgICAgICAgICBcIlBsZWFzZSB0YWcgdGhlIG5vdGUgYXBwcm9wcmlhdGVseSBmb3IgcmV2aWV3aW5nIChpbiBzZXR0aW5ncykuXCJcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZpbGVUZXh0OiBzdHJpbmcgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKG5vdGUpO1xyXG4gICAgICAgIGxldCBlYXNlOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGludGVydmFsOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGRlbGF5QmVmb3JlUmV2aWV3OiBudW1iZXIsXHJcbiAgICAgICAgICAgIG5vdzogbnVtYmVyID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAvLyBuZXcgbm90ZVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgIShcclxuICAgICAgICAgICAgICAgIGZyb250bWF0dGVyLmhhc093blByb3BlcnR5KFwic3ItZHVlXCIpICYmXHJcbiAgICAgICAgICAgICAgICBmcm9udG1hdHRlci5oYXNPd25Qcm9wZXJ0eShcInNyLWludGVydmFsXCIpICYmXHJcbiAgICAgICAgICAgICAgICBmcm9udG1hdHRlci5oYXNPd25Qcm9wZXJ0eShcInNyLWVhc2VcIilcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsZXQgbGlua1RvdGFsOiBudW1iZXIgPSAwLFxyXG4gICAgICAgICAgICAgICAgbGlua1BHVG90YWw6IG51bWJlciA9IDAsXHJcbiAgICAgICAgICAgICAgICB0b3RhbExpbmtDb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHN0YXRPYmogb2YgdGhpcy5pbmNvbWluZ0xpbmtzW25vdGUucGF0aF0gfHwgW10pIHtcclxuICAgICAgICAgICAgICAgIGxldCBlYXNlOiBudW1iZXIgPSB0aGlzLmVhc2VCeVBhdGhbc3RhdE9iai5zb3VyY2VQYXRoXTtcclxuICAgICAgICAgICAgICAgIGlmIChlYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua1RvdGFsICs9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRPYmoubGlua0NvdW50ICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlcmFua3Nbc3RhdE9iai5zb3VyY2VQYXRoXSAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua1BHVG90YWwgKz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlcmFua3Nbc3RhdE9iai5zb3VyY2VQYXRoXSAqIHN0YXRPYmoubGlua0NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsTGlua0NvdW50ICs9IHN0YXRPYmoubGlua0NvdW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgb3V0Z29pbmdMaW5rcyA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLnJlc29sdmVkTGlua3Nbbm90ZS5wYXRoXSB8fCB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbGlua2VkRmlsZVBhdGggaW4gb3V0Z29pbmdMaW5rcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVhc2U6IG51bWJlciA9IHRoaXMuZWFzZUJ5UGF0aFtsaW5rZWRGaWxlUGF0aF07XHJcbiAgICAgICAgICAgICAgICBpZiAoZWFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmtUb3RhbCArPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ0xpbmtzW2xpbmtlZEZpbGVQYXRoXSAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZXJhbmtzW2xpbmtlZEZpbGVQYXRoXSAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua1BHVG90YWwgKz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlcmFua3NbbGlua2VkRmlsZVBhdGhdICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdMaW5rc1tsaW5rZWRGaWxlUGF0aF07XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxMaW5rQ291bnQgKz0gb3V0Z29pbmdMaW5rc1tsaW5rZWRGaWxlUGF0aF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBsaW5rQ29udHJpYnV0aW9uOiBudW1iZXIgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzLm1heExpbmtGYWN0b3IgKlxyXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oMS4wLCBNYXRoLmxvZyh0b3RhbExpbmtDb3VudCArIDAuNSkgLyBNYXRoLmxvZyg2NCkpO1xyXG4gICAgICAgICAgICBlYXNlID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgICAgICAgICgxLjAgLSBsaW5rQ29udHJpYnV0aW9uKSAqIHRoaXMuZGF0YS5zZXR0aW5ncy5iYXNlRWFzZSArXHJcbiAgICAgICAgICAgICAgICAgICAgKHRvdGFsTGlua0NvdW50ID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IChsaW5rQ29udHJpYnV0aW9uICogbGlua1RvdGFsKSAvIGxpbmtQR1RvdGFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbGlua0NvbnRyaWJ1dGlvbiAqIHRoaXMuZGF0YS5zZXR0aW5ncy5iYXNlRWFzZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaW50ZXJ2YWwgPSAxO1xyXG4gICAgICAgICAgICBkZWxheUJlZm9yZVJldmlldyA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW50ZXJ2YWwgPSBmcm9udG1hdHRlcltcInNyLWludGVydmFsXCJdO1xyXG4gICAgICAgICAgICBlYXNlID0gZnJvbnRtYXR0ZXJbXCJzci1lYXNlXCJdO1xyXG4gICAgICAgICAgICBkZWxheUJlZm9yZVJldmlldyA9XHJcbiAgICAgICAgICAgICAgICBub3cgLVxyXG4gICAgICAgICAgICAgICAgd2luZG93XHJcbiAgICAgICAgICAgICAgICAgICAgLm1vbWVudChmcm9udG1hdHRlcltcInNyLWR1ZVwiXSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIllZWVktTU0tRERcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJERC1NTS1ZWVlZXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGRkIE1NTSBERCBZWVlZXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICAudmFsdWVPZigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNjaGVkT2JqOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0gc2NoZWR1bGUoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLFxyXG4gICAgICAgICAgICBpbnRlcnZhbCxcclxuICAgICAgICAgICAgZWFzZSxcclxuICAgICAgICAgICAgZGVsYXlCZWZvcmVSZXZpZXcsXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncyxcclxuICAgICAgICAgICAgdGhpcy5kdWVEYXRlc05vdGVzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpbnRlcnZhbCA9IHNjaGVkT2JqLmludGVydmFsO1xyXG4gICAgICAgIGVhc2UgPSBzY2hlZE9iai5lYXNlO1xyXG5cclxuICAgICAgICBsZXQgZHVlID0gd2luZG93Lm1vbWVudChub3cgKyBpbnRlcnZhbCAqIDI0ICogMzYwMCAqIDEwMDApO1xyXG4gICAgICAgIGxldCBkdWVTdHJpbmc6IHN0cmluZyA9IGR1ZS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG5cclxuICAgICAgICAvLyBjaGVjayBpZiBzY2hlZHVsaW5nIGluZm8gZXhpc3RzXHJcbiAgICAgICAgaWYgKFNDSEVEVUxJTkdfSU5GT19SRUdFWC50ZXN0KGZpbGVUZXh0KSkge1xyXG4gICAgICAgICAgICBsZXQgc2NoZWR1bGluZ0luZm8gPSBTQ0hFRFVMSU5HX0lORk9fUkVHRVguZXhlYyhmaWxlVGV4dCkhO1xyXG4gICAgICAgICAgICBmaWxlVGV4dCA9IGZpbGVUZXh0LnJlcGxhY2UoXHJcbiAgICAgICAgICAgICAgICBTQ0hFRFVMSU5HX0lORk9fUkVHRVgsXHJcbiAgICAgICAgICAgICAgICBgLS0tXFxuJHtzY2hlZHVsaW5nSW5mb1sxXX1zci1kdWU6ICR7ZHVlU3RyaW5nfVxcbmAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBzci1pbnRlcnZhbDogJHtpbnRlcnZhbH1cXG5zci1lYXNlOiAke2Vhc2V9XFxuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYCR7c2NoZWR1bGluZ0luZm9bNV19LS0tYFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoWUFNTF9GUk9OVF9NQVRURVJfUkVHRVgudGVzdChmaWxlVGV4dCkpIHtcclxuICAgICAgICAgICAgLy8gbmV3IG5vdGUgd2l0aCBleGlzdGluZyBZQU1MIGZyb250IG1hdHRlclxyXG4gICAgICAgICAgICBsZXQgZXhpc3RpbmdZYW1sID0gWUFNTF9GUk9OVF9NQVRURVJfUkVHRVguZXhlYyhmaWxlVGV4dCkhO1xyXG4gICAgICAgICAgICBmaWxlVGV4dCA9IGZpbGVUZXh0LnJlcGxhY2UoXHJcbiAgICAgICAgICAgICAgICBZQU1MX0ZST05UX01BVFRFUl9SRUdFWCxcclxuICAgICAgICAgICAgICAgIGAtLS1cXG4ke2V4aXN0aW5nWWFtbFsxXX1zci1kdWU6ICR7ZHVlU3RyaW5nfVxcbmAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBzci1pbnRlcnZhbDogJHtpbnRlcnZhbH1cXG5zci1lYXNlOiAke2Vhc2V9XFxuLS0tYFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBmaWxlVGV4dCA9XHJcbiAgICAgICAgICAgICAgICBgLS0tXFxuc3ItZHVlOiAke2R1ZVN0cmluZ31cXG5zci1pbnRlcnZhbDogJHtpbnRlcnZhbH1cXG5gICtcclxuICAgICAgICAgICAgICAgIGBzci1lYXNlOiAke2Vhc2V9XFxuLS0tXFxuXFxuJHtmaWxlVGV4dH1gO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnNldHRpbmdzLmJ1cnlTaWJsaW5nQ2FyZHMpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5maW5kRmxhc2hjYXJkcyhub3RlLCBbXSwgdHJ1ZSk7IC8vIGJ1cnkgYWxsIGNhcmRzIGluIGN1cnJlbnQgbm90ZVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmVQbHVnaW5EYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShub3RlLCBmaWxlVGV4dCk7XHJcblxyXG4gICAgICAgIG5ldyBOb3RpY2UodChcIlJlc3BvbnNlIHJlY2VpdmVkLlwiKSk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMubm90ZXNTeW5jTG9jaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zeW5jKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLnNldHRpbmdzLmF1dG9OZXh0Tm90ZSkgdGhpcy5yZXZpZXdOZXh0Tm90ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZXZpZXdOZXh0Tm90ZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBpZiAodGhpcy5kdWVOb3Rlc0NvdW50ID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuZGF0YS5zZXR0aW5ncy5vcGVuUmFuZG9tTm90ZVxyXG4gICAgICAgICAgICAgICAgPyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmR1ZU5vdGVzQ291bnQpXHJcbiAgICAgICAgICAgICAgICA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLm9wZW5GaWxlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZWROb3Rlc1tpbmRleF0ubm90ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5uZXdOb3Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5kYXRhLnNldHRpbmdzLm9wZW5SYW5kb21Ob3RlXHJcbiAgICAgICAgICAgICAgICA/IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMubmV3Tm90ZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgOiAwO1xyXG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi5vcGVuRmlsZSh0aGlzLm5ld05vdGVzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ldyBOb3RpY2UodChcIllvdSdyZSBhbGwgY2F1Z2h0IHVwIG5vdyA6RC5cIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGZsYXNoY2FyZHNfc3luYygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBpZiAodGhpcy5mbGFzaGNhcmRzU3luY0xvY2spIHJldHVybjtcclxuICAgICAgICB0aGlzLmZsYXNoY2FyZHNTeW5jTG9jayA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBub3RlczogVEZpbGVbXSA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWNrVHJlZSA9IG5ldyBEZWNrKFwicm9vdFwiLCBudWxsKTtcclxuICAgICAgICB0aGlzLmR1ZURhdGVzRmxhc2hjYXJkcyA9IHt9O1xyXG5cclxuICAgICAgICBsZXQgbm93ID0gd2luZG93Lm1vbWVudChEYXRlLm5vdygpKTtcclxuICAgICAgICBsZXQgdG9kYXlEYXRlOiBzdHJpbmcgPSBub3cuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgICAvLyBjbGVhciBsaXN0IGlmIHdlJ3ZlIGNoYW5nZWQgZGF0ZXNcclxuICAgICAgICBpZiAodG9kYXlEYXRlICE9PSB0aGlzLmRhdGEuYnVyeURhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmJ1cnlEYXRlID0gdG9kYXlEYXRlO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYnVyeUxpc3QgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBub3RlUGF0aHNTZXQ6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xyXG4gICAgICAgIGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcclxuICAgICAgICAgICAgbm90ZVBhdGhzU2V0LmFkZChub3RlLnBhdGgpO1xyXG5cclxuICAgICAgICAgICAgLy8gZmluZCBkZWNrIHBhdGhcclxuICAgICAgICAgICAgbGV0IGRlY2tQYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLnNldHRpbmdzLmNvbnZlcnRGb2xkZXJzVG9EZWNrcykge1xyXG4gICAgICAgICAgICAgICAgZGVja1BhdGggPSBub3RlLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgZGVja1BhdGgucG9wKCk7IC8vIHJlbW92ZSBmaWxlbmFtZVxyXG4gICAgICAgICAgICAgICAgaWYgKGRlY2tQYXRoLmxlbmd0aCA9PT0gMCkgZGVja1BhdGggPSBbXCIvXCJdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVDYWNoZWREYXRhID1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShub3RlKSB8fCB7fTtcclxuICAgICAgICAgICAgICAgIGxldCB0YWdzID0gZ2V0QWxsVGFncyhmaWxlQ2FjaGVkRGF0YSkgfHwgW107XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0ZXI6IGZvciAobGV0IHRhZyBvZiB0YWdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdGFnVG9SZXZpZXcgb2YgdGhpcy5kYXRhLnNldHRpbmdzLmZsYXNoY2FyZFRhZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnID09PSB0YWdUb1JldmlldyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnLnN0YXJ0c1dpdGgodGFnVG9SZXZpZXcgKyBcIi9cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNrUGF0aCA9IHRhZy5zdWJzdHJpbmcoMSkuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgb3V0ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkZWNrUGF0aC5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5jYWNoZS5oYXNPd25Qcm9wZXJ0eShub3RlLnBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZUNhY2hlOiBTUkZpbGVDYWNoZSA9IHRoaXMuZGF0YS5jYWNoZVtub3RlLnBhdGhdO1xyXG4gICAgICAgICAgICAgICAgLy8gSGFzIGZpbGUgY2hhbmdlZD9cclxuICAgICAgICAgICAgICAgIGlmIChmaWxlQ2FjaGUubGFzdFVwZGF0ZWQgPT09IG5vdGUuc3RhdC5tdGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlQ2FjaGUudG90YWxDYXJkcyA9PT0gMCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFmaWxlQ2FjaGUuaGFzTmV3Q2FyZHMgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93LnZhbHVlT2YoKSA8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubW9tZW50KGZpbGVDYWNoZS5uZXh0RHVlRGF0ZSwgXCJZWVlZLU1NLUREXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbHVlT2YoKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2tUcmVlLmNyZWF0ZURlY2soWy4uLmRlY2tQYXRoXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVja1RyZWUuY291bnRGbGFzaGNhcmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNrUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVDYWNoZS50b3RhbENhcmRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGF3YWl0IHRoaXMuZmluZEZsYXNoY2FyZHMobm90ZSwgZGVja1BhdGgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGF3YWl0IHRoaXMuZmluZEZsYXNoY2FyZHMobm90ZSwgZGVja1BhdGgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgYXdhaXQgdGhpcy5maW5kRmxhc2hjYXJkcyhub3RlLCBkZWNrUGF0aCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBbbkRheSwgY291bnRdIG9mIE9iamVjdC5lbnRyaWVzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLmNhY2hlW25vdGUucGF0aF0uZHVlRGF0ZXNGbGFzaGNhcmRzXHJcbiAgICAgICAgICAgICkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHMuaGFzT3duUHJvcGVydHkobkRheSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHNbbkRheV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHNbbkRheV0gKz0gY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB1bnVzZWQgY2FjaGUgZW50cmllc1xyXG4gICAgICAgIGZvciAobGV0IGNhY2hlZFBhdGggaW4gdGhpcy5kYXRhLmNhY2hlKSB7XHJcbiAgICAgICAgICAgIGlmICghbm90ZVBhdGhzU2V0LmhhcyhjYWNoZWRQYXRoKSlcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRhdGEuY2FjaGVbY2FjaGVkUGF0aF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYEZsYXNoY2FyZCBzeW5jIHRvb2sgJHtEYXRlLm5vdygpIC0gbm93LnZhbHVlT2YoKX1tc2ApO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZVBsdWdpbkRhdGEoKTtcclxuXHJcbiAgICAgICAgLy8gc29ydCB0aGUgZGVjayBuYW1lc1xyXG4gICAgICAgIHRoaXMuZGVja1RyZWUuc29ydFN1YmRlY2tzTGlzdCgpO1xyXG5cclxuICAgICAgICBsZXQgbm90ZUNvdW50VGV4dDogc3RyaW5nID1cclxuICAgICAgICAgICAgdGhpcy5kdWVOb3Rlc0NvdW50ID09PSAxID8gdChcIm5vdGVcIikgOiB0KFwibm90ZXNcIik7XHJcbiAgICAgICAgbGV0IGNhcmRDb3VudFRleHQ6IHN0cmluZyA9XHJcbiAgICAgICAgICAgIHRoaXMuZGVja1RyZWUuZHVlRmxhc2hjYXJkc0NvdW50ID09PSAxID8gdChcImNhcmRcIikgOiB0KFwiY2FyZHNcIik7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0VGV4dChcclxuICAgICAgICAgICAgdChcIlJldmlld1wiKSArXHJcbiAgICAgICAgICAgICAgICBgOiAke3RoaXMuZHVlTm90ZXNDb3VudH0gJHtub3RlQ291bnRUZXh0fSwgYCArXHJcbiAgICAgICAgICAgICAgICBgJHt0aGlzLmRlY2tUcmVlLmR1ZUZsYXNoY2FyZHNDb3VudH0gJHtjYXJkQ291bnRUZXh0fSBgICtcclxuICAgICAgICAgICAgICAgIHQoXCJkdWVcIilcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmZsYXNoY2FyZHNTeW5jTG9jayA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGZpbmRGbGFzaGNhcmRzKFxyXG4gICAgICAgIG5vdGU6IFRGaWxlLFxyXG4gICAgICAgIGRlY2tQYXRoOiBzdHJpbmdbXSxcclxuICAgICAgICBidXJ5T25seTogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgZmlsZVRleHQ6IHN0cmluZyA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQobm90ZSk7XHJcbiAgICAgICAgbGV0IGZpbGVDYWNoZWREYXRhID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUobm90ZSkgfHwge307XHJcbiAgICAgICAgbGV0IGhlYWRpbmdzOiBIZWFkaW5nQ2FjaGVbXSA9IGZpbGVDYWNoZWREYXRhLmhlYWRpbmdzIHx8IFtdO1xyXG4gICAgICAgIGxldCBmaWxlQ2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgICAgICBkZWNrQWRkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gY2FjaGluZyBpbmZvcm1hdGlvblxyXG4gICAgICAgIGxldCBoYXNOZXdDYXJkczogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgICAgICB0b3RhbENhcmRzOiBudW1iZXIgPSAwLFxyXG4gICAgICAgICAgICBuZXh0RHVlRGF0ZTogbnVtYmVyID0gSW5maW5pdHksIC8vIDAzOjE0OjA3IFVUQywgSmFudWFyeSAxOSAyMDM4IGhhaGFcclxuICAgICAgICAgICAgZHVlRGF0ZXNGbGFzaGNhcmRzOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+ID0ge307XHJcblxyXG4gICAgICAgIGxldCBub3c6IG51bWJlciA9IERhdGUubm93KCk7XHJcbiAgICAgICAgbGV0IHBhcnNlZENhcmRzOiBbQ2FyZFR5cGUsIHN0cmluZywgbnVtYmVyXVtdID0gcGFyc2UoXHJcbiAgICAgICAgICAgIGZpbGVUZXh0LFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZUNhcmRTZXBhcmF0b3IsXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncy5zaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lQ2FyZFNlcGFyYXRvcixcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzLm11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvclxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhwYXJzZWRDYXJkcyk7XHJcbiAgICAgICAgZm9yIChsZXQgcGFyc2VkQ2FyZCBvZiBwYXJzZWRDYXJkcykge1xyXG4gICAgICAgICAgICBsZXQgY2FyZFR5cGU6IENhcmRUeXBlID0gcGFyc2VkQ2FyZFswXSxcclxuICAgICAgICAgICAgICAgIGNhcmRUZXh0OiBzdHJpbmcgPSBwYXJzZWRDYXJkWzFdLFxyXG4gICAgICAgICAgICAgICAgbGluZU5vOiBudW1iZXIgPSBwYXJzZWRDYXJkWzJdO1xyXG5cclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgY2FyZFR5cGUgPT09IENhcmRUeXBlLkNsb3plICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3MuZGlzYWJsZUNsb3plQ2FyZHNcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FyZFRleHRIYXNoOiBzdHJpbmcgPSBjeXJiNTMoY2FyZFRleHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJ1cnlPbmx5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuYnVyeUxpc3QucHVzaChjYXJkVGV4dEhhc2gpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZGVja0FkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2tUcmVlLmNyZWF0ZURlY2soWy4uLmRlY2tQYXRoXSk7XHJcbiAgICAgICAgICAgICAgICBkZWNrQWRkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgc2libGluZ01hdGNoZXM6IFtzdHJpbmcsIHN0cmluZ11bXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoY2FyZFR5cGUgPT09IENhcmRUeXBlLkNsb3plKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnJvbnQ6IHN0cmluZywgYmFjazogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBjYXJkVGV4dC5tYXRjaEFsbCgvPT0oLio/KT09L2dtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWxldGlvblN0YXJ0OiBudW1iZXIgPSBtLmluZGV4ISxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRpb25FbmQ6IG51bWJlciA9IGRlbGV0aW9uU3RhcnQgKyBtWzBdLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBmcm9udCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRUZXh0LnN1YnN0cmluZygwLCBkZWxldGlvblN0YXJ0KSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gc3R5bGU9J2NvbG9yOiMyMTk2ZjMnPlsuLi5dPC9zcGFuPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZFRleHQuc3Vic3RyaW5nKGRlbGV0aW9uRW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBmcm9udCA9IGZyb250LnJlcGxhY2UoLz09L2dtLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZFRleHQuc3Vic3RyaW5nKDAsIGRlbGV0aW9uU3RhcnQpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBzdHlsZT0nY29sb3I6IzIxOTZmMyc+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dC5zdWJzdHJpbmcoZGVsZXRpb25TdGFydCwgZGVsZXRpb25FbmQpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8L3NwYW4+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dC5zdWJzdHJpbmcoZGVsZXRpb25FbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2sgPSBiYWNrLnJlcGxhY2UoLz09L2dtLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5nTWF0Y2hlcy5wdXNoKFtmcm9udCwgYmFja10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhcmRUeXBlID09PSBDYXJkVHlwZS5TaW5nbGVMaW5lQmFzaWMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHggPSBjYXJkVGV4dC5pbmRleE9mKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZUNhcmRTZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpYmxpbmdNYXRjaGVzLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dC5zdWJzdHJpbmcoMCwgaWR4KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZFRleHQuc3Vic3RyaW5nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4ICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZUNhcmRTZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYXJkVHlwZSA9PT0gQ2FyZFR5cGUuU2luZ2xlTGluZVJldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gY2FyZFRleHQuaW5kZXhPZihcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzLnNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaWRlMTogc3RyaW5nID0gY2FyZFRleHQuc3Vic3RyaW5nKDAsIGlkeCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZGUyOiBzdHJpbmcgPSBjYXJkVGV4dC5zdWJzdHJpbmcoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHggK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvci5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5nTWF0Y2hlcy5wdXNoKFtzaWRlMSwgc2lkZTJdKTtcclxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5nTWF0Y2hlcy5wdXNoKFtzaWRlMiwgc2lkZTFdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2FyZFR5cGUgPT09IENhcmRUeXBlLk11bHRpTGluZUJhc2ljKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gY2FyZFRleHQuaW5kZXhPZihcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5cIiArIHRoaXMuZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVDYXJkU2VwYXJhdG9yICsgXCJcXG5cIlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2libGluZ01hdGNoZXMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRUZXh0LnN1YnN0cmluZygwLCBpZHgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dC5zdWJzdHJpbmcoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHggK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVDYXJkU2VwYXJhdG9yLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYXJkVHlwZSA9PT0gQ2FyZFR5cGUuTXVsdGlMaW5lUmV2ZXJzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHggPSBjYXJkVGV4dC5pbmRleE9mKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5cIlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNpZGUxOiBzdHJpbmcgPSBjYXJkVGV4dC5zdWJzdHJpbmcoMCwgaWR4KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkZTI6IHN0cmluZyA9IGNhcmRUZXh0LnN1YnN0cmluZyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkeCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tdWx0aWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2libGluZ01hdGNoZXMucHVzaChbc2lkZTEsIHNpZGUyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2libGluZ01hdGNoZXMucHVzaChbc2lkZTIsIHNpZGUxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBzY2hlZHVsaW5nOiBSZWdFeHBNYXRjaEFycmF5W10gPSBbXHJcbiAgICAgICAgICAgICAgICAuLi5jYXJkVGV4dC5tYXRjaEFsbChNVUxUSV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUiksXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGlmIChzY2hlZHVsaW5nLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgIHNjaGVkdWxpbmcgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uY2FyZFRleHQubWF0Y2hBbGwoTEVHQUNZX1NDSEVEVUxJTkdfRVhUUkFDVE9SKSxcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAvLyB3ZSBoYXZlIHNvbWUgZXh0cmEgc2NoZWR1bGluZyBkYXRlcyB0byBkZWxldGVcclxuICAgICAgICAgICAgaWYgKHNjaGVkdWxpbmcubGVuZ3RoID4gc2libGluZ01hdGNoZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaWR4U2NoZWQ6IG51bWJlciA9IGNhcmRUZXh0Lmxhc3RJbmRleE9mKFwiPCEtLVNSOlwiKSArIDc7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3Q2FyZFRleHQ6IHN0cmluZyA9IGNhcmRUZXh0LnN1YnN0cmluZygwLCBpZHhTY2hlZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpYmxpbmdNYXRjaGVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NhcmRUZXh0ICs9IGAhJHtzY2hlZHVsaW5nW2ldWzFdfSwke3NjaGVkdWxpbmdbaV1bMl19LCR7c2NoZWR1bGluZ1tpXVszXX1gO1xyXG4gICAgICAgICAgICAgICAgbmV3Q2FyZFRleHQgKz0gXCItLT5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcmVwbGFjZW1lbnRSZWdleCA9IG5ldyBSZWdFeHAoXHJcbiAgICAgICAgICAgICAgICAgICAgZXNjYXBlUmVnZXhTdHJpbmcoY2FyZFRleHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZ21cIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGZpbGVUZXh0ID0gZmlsZVRleHQucmVwbGFjZShcclxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudFJlZ2V4LFxyXG4gICAgICAgICAgICAgICAgICAgIChfKSA9PiBuZXdDYXJkVGV4dFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGZpbGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGNvbnRleHQ6IHN0cmluZyA9IHRoaXMuZGF0YS5zZXR0aW5ncy5zaG93Q29udGV4dEluQ2FyZHNcclxuICAgICAgICAgICAgICAgID8gZ2V0Q2FyZENvbnRleHQobGluZU5vLCBoZWFkaW5ncylcclxuICAgICAgICAgICAgICAgIDogXCJcIjtcclxuICAgICAgICAgICAgbGV0IHNpYmxpbmdzOiBDYXJkW10gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWJsaW5nTWF0Y2hlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250OiBzdHJpbmcgPSBzaWJsaW5nTWF0Y2hlc1tpXVswXS50cmltKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYmFjazogc3RyaW5nID0gc2libGluZ01hdGNoZXNbaV1bMV0udHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjYXJkT2JqOiBDYXJkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRHVlOiBpIDwgc2NoZWR1bGluZy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgbm90ZSxcclxuICAgICAgICAgICAgICAgICAgICBsaW5lTm8sXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFjayxcclxuICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhcmRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpYmxpbmdJZHg6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgc2libGluZ3MsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRvdGFsQ2FyZHMrKztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYXJkIHNjaGVkdWxlZFxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBzY2hlZHVsaW5nLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkdWVVbml4OiBudW1iZXIgPSB3aW5kb3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1vbWVudChzY2hlZHVsaW5nW2ldWzFdLCBbXCJZWVlZLU1NLUREXCIsIFwiREQtTU0tWVlZWVwiXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnZhbHVlT2YoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZHVlVW5peCA8IG5leHREdWVEYXRlKSBuZXh0RHVlRGF0ZSA9IGR1ZVVuaXg7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5EYXlzOiBudW1iZXIgPSBNYXRoLmNlaWwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChkdWVVbml4IC0gbm93KSAvICgyNCAqIDM2MDAgKiAxMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkdWVEYXRlc0ZsYXNoY2FyZHMuaGFzT3duUHJvcGVydHkobkRheXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdWVEYXRlc0ZsYXNoY2FyZHNbbkRheXNdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBkdWVEYXRlc0ZsYXNoY2FyZHNbbkRheXNdKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5idXJ5TGlzdC5pbmNsdWRlcyhjYXJkVGV4dEhhc2gpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVja1RyZWUuY291bnRGbGFzaGNhcmQoWy4uLmRlY2tQYXRoXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGR1ZVVuaXggPD0gbm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRPYmouaW50ZXJ2YWwgPSBwYXJzZUludChzY2hlZHVsaW5nW2ldWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZE9iai5lYXNlID0gcGFyc2VJbnQoc2NoZWR1bGluZ1tpXVszXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRPYmouZGVsYXlCZWZvcmVSZXZpZXcgPSBub3cgLSBkdWVVbml4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2tUcmVlLmluc2VydEZsYXNoY2FyZChbLi4uZGVja1BhdGhdLCBjYXJkT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2tUcmVlLmNvdW50Rmxhc2hjYXJkKFsuLi5kZWNrUGF0aF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzTmV3Q2FyZHMpIGhhc05ld0NhcmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLmJ1cnlMaXN0LmluY2x1ZGVzKGN5cmI1MyhjYXJkVGV4dCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVja1RyZWUuY291bnRGbGFzaGNhcmQoWy4uLmRlY2tQYXRoXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2tUcmVlLmluc2VydEZsYXNoY2FyZChbLi4uZGVja1BhdGhdLCBjYXJkT2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzaWJsaW5ncy5wdXNoKGNhcmRPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWJ1cnlPbmx5KVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuY2FjaGVbbm90ZS5wYXRoXSA9IHtcclxuICAgICAgICAgICAgICAgIHRvdGFsQ2FyZHMsXHJcbiAgICAgICAgICAgICAgICBoYXNOZXdDYXJkcyxcclxuICAgICAgICAgICAgICAgIG5leHREdWVEYXRlOlxyXG4gICAgICAgICAgICAgICAgICAgIG5leHREdWVEYXRlICE9PSBJbmZpbml0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHdpbmRvdy5tb21lbnQobmV4dER1ZURhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgbGFzdFVwZGF0ZWQ6IG5vdGUuc3RhdC5tdGltZSxcclxuICAgICAgICAgICAgICAgIGR1ZURhdGVzRmxhc2hjYXJkcyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGZpbGVDaGFuZ2VkKSBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkobm90ZSwgZmlsZVRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWRQbHVnaW5EYXRhKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfREFUQSwgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUyxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzYXZlUGx1Z2luRGF0YSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoUkVWSUVXX1FVRVVFX1ZJRVdfVFlQRSkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpLnNldFZpZXdTdGF0ZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IFJFVklFV19RVUVVRV9WSUVXX1RZUEUsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2FyZENvbnRleHQoY2FyZExpbmU6IG51bWJlciwgaGVhZGluZ3M6IEhlYWRpbmdDYWNoZVtdKTogc3RyaW5nIHtcclxuICAgIGxldCBzdGFjazogSGVhZGluZ0NhY2hlW10gPSBbXTtcclxuICAgIGZvciAobGV0IGhlYWRpbmcgb2YgaGVhZGluZ3MpIHtcclxuICAgICAgICBpZiAoaGVhZGluZy5wb3NpdGlvbi5zdGFydC5saW5lID4gY2FyZExpbmUpIGJyZWFrO1xyXG5cclxuICAgICAgICB3aGlsZSAoXHJcbiAgICAgICAgICAgIHN0YWNrLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgICAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0ubGV2ZWwgPj0gaGVhZGluZy5sZXZlbFxyXG4gICAgICAgIClcclxuICAgICAgICAgICAgc3RhY2sucG9wKCk7XHJcblxyXG4gICAgICAgIHN0YWNrLnB1c2goaGVhZGluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNvbnRleHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBmb3IgKGxldCBoZWFkaW5nT2JqIG9mIHN0YWNrKSBjb250ZXh0ICs9IGhlYWRpbmdPYmouaGVhZGluZyArIFwiID4gXCI7XHJcbiAgICByZXR1cm4gY29udGV4dC5zbGljZSgwLCAtMyk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIm1vbWVudCIsIlBsYXRmb3JtIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJOb3RpY2UiLCJNb2RhbCIsIk1hcmtkb3duVmlldyIsIk1hcmtkb3duUmVuZGVyZXIiLCJURmlsZSIsIkl0ZW1WaWV3IiwiTWVudSIsIlBsdWdpbiIsImFkZEljb24iLCJncmFwaC5yZXNldCIsImdyYXBoLmxpbmsiLCJnZXRBbGxUYWdzIiwiZ3JhcGgucmFuayJdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLFNB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

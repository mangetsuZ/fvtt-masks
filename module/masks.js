/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import {MasksActor} from "./actor.js";
import {MasksItemSheet} from "./item-sheet.js";
import {MasksActorSheet} from "./actor-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
    console.log(`Initializing Masks: A New Generation System`);

    /**
     * Set an initiative formula for the system
     * @type {String}
     */
    CONFIG.Combat.initiative = {
        formula: "1d20",
        decimals: 2
    };

    // Define custom Entity classes
    CONFIG.Actor.entityClass = MasksActor;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("masks", MasksActorSheet, {makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("masks", MasksItemSheet, {makeDefault: true});

    // Register system settings
    game.settings.register("masks", "macroShorthand", {
        name: "Shortened Macro Syntax",
        hint: "Enable a shortened macro syntax which allows referencing attributes directly, for example @str instead of @attributes.str.value. Disable this setting if you need the ability to reference the full attribute model, for example @attributes.str.label.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register("masks", "enableUnboundSupplement", {
        name: "Enable Unbound Supplement",
        hint: "Enable playbooks, moves, compendiums and other content from the Unbound supplement for Masks.",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    game.settings.register("masks", "enableHeraldSupplement", {
        name: "Enable Halcyon City Herald Collection Supplement",
        hint: "Enable playbooks, moves, compendiums and other content from the Halcyon City Herald Collection supplement for Masks.",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    game.settings.register("masks", "enableAegisSupplement", {
        name: "Enable Secrets of AEGIS Supplement",
        hint: "Enable playbooks, moves, compendiums and other content from the Secrets of AEGIS supplement for Masks.",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });
});

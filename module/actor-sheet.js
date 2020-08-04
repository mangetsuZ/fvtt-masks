import { PlaybookList, CONSTANTS } from './config.js';


/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MasksActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["masks", "sheet", "actor"],
            template: "systems/masks/templates/actor-sheet.html",
            width: 840,
            height: 780,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];

        if (this.actor.data.type == 'character') {
            data.data.playbooklist = PlaybookList.getPlaybooks();
        }

        // Prepare items.
        this._prepareCharacterItems(data);
        // this._prepareNpcItems(data);

        return data;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} sheetData The actorsheet data to draw from.
     *
     * @return {undefined}
     *
     * uses actorData to set the actor's data directly
     */
    _prepareCharacterItems(sheetData) {
        // Initialize containers.
        const moves = [];
        const basicMoves = [];
        const peripheralMoves = [];
        const adultMoves = [];
        const playbookMoves = [];
        const advances = [];
        const later_advances =[];


    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false)
            );
        });
    }
}

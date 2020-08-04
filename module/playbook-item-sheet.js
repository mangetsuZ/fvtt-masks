import { ItemSheet } from './item-sheet.js';
import { Utility } from './utility.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class PlaybookItemSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["masks", "sheet", "item", "playbook"],
            width: 960,
            height: 640,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }],
            submitOnChange: true,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    get template() {
        const path = "systems/masks/templates/items";
        return `${path}/${this.item.data.type}-sheet.html`;
    }

    async getData() {
        const data = await super.getData();
        let advancesObjects = await this.item._getadvancesObjects();
        for (let [group, group_items] of Object.entries(advancesObjects)) {
            data.data.advances[group]['objects'] = group_items;
        }
        return data;
    }

    async activateListeners(html) {
        super.activateListeners(html);

        // Add drag events.
        html.find('.drop-area')
            .on('dragover', this._onDragOver.bind(this))
            .on('dragleave', this._onDragLeave.bind(this))
            .on('drop', this._onDrop.bind(this));

        // Delete advances.
        html.find('.delete-advances').on('click', this._onItemDelete.bind(this));
    }

    /* -------------------------------------------- */

    async _onDragOver(ev) {
        let $self = $(ev.originalEvent.target);
        let $dropTarget = $self;
        $dropTarget.addClass('drop-hover');
        return false;
    }

    async _onDragLeave(ev) {
        let $self = $(ev.originalEvent.target);
        let $dropTarget = $self;
        $dropTarget.removeClass('drop-hover');
        return false;
    }

    async _onDrop(ev) {
        // Get the journal ID and drop target.
        // let journalId = ev.originalEvent.dataTransfer.getData('gm-screen-id');
        let $self = $(ev.originalEvent.target);
        let $dropTarget = $self;
        let updated = false;

        // Get data.
        let data;
        try {
            data = JSON.parse(ev.originalEvent.dataTransfer.getData('text/plain'));
            if (data.type !== "Item") return;
        } catch (err) {
            return false;
        }

        let group = $dropTarget.data('group');
        this._createadvances(data.id, group);

        $dropTarget.removeClass('drop-hover');

        return false;
    }

    async _onItemDelete(event) {
        event.preventDefault();
        const item = event.currentTarget.closest('.tag');
        const itemId = item.dataset.itemId;
        const group = event.currentTarget.closest('.item-container');
        const groupId = group.dataset.group;
        this._deleteadvances(item.dataset.itemId, groupId);
    }

    async _deleteadvances(advancesId, groupId) {
        let itemData = duplicate(this.item.data);

        // Filter items.
        let newItems = itemData.data.advances[groupId]['items'].filter(i => i != advancesId);
        itemData.data.advances[groupId]['items'] = newItems;

        // Update the entity.
        await this.item.update(itemData, { diff: false });
        this.render(true);
    }

    async _createadvances(advancesId, groupId) {
        let itemData = duplicate(this.item.data);

        // Filter items.
        let existing_items = [];

        if (!Utility.isEmpty(itemData.data.advances[groupId]['items'])) {
            existing_items = itemData.data.advances[groupId]['items'];
        }
        else {
            existing_items = [];
        }
        // Append our item.
        if (!existing_items.includes(advancesId)) {
            existing_items.push(advancesId);
            itemData.data.advances[groupId]['items'] = existing_items;
            // Update the entity.
            await this.item.update(itemData, { diff: false });
            this.render(true);
        }

    }

}
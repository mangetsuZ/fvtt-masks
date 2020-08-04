export class Utility {
    static isEmpty(arg) {
        return [null, false, undefined, 0, ''].includes(arg);
    }

    static cleanPlaybook(string) {
        //Lower case everything
        string = string.toLowerCase();
        //Make alphanumeric (removes all other characters)
        string = string.replace(/[^a-z0-9\s]/g, "");
        //Convert whitespaces and underscore to dash
        string = string.replace(/[\s\_]/g, "-");
        //Clean up multiple dashes or whitespaces
        string = string.replace(/[\s\-]+/g, "-");
        return string;
    };

    static async getAdvances(update = false) {
        if (typeof game.items == 'undefined') {
            return false;
        }

        // Cache results.
        if (game.masks.advances && !update) {
            return game.masks.advances;
        }

        // Load new results.
        let items = game.items.filter(i => i.type == 'advances');
        for (let pack of game.packs) {
            if (pack.metadata.name.includes('advances')) {
                if (pack) {
                    items = items.concat(await pack.getContent());
                }
            }
        }

        game.masks.advances = items;
        return items;
    }
}

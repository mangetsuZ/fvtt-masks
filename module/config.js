export const CONSTANTS = {};

CONSTANTS.moveList = ["Basic", "Peripheral", "Adult"];
CONSTANTS.labels = ["Danger", "Freak", "Savior", "Superior", "Mundane", "Extra"];
CONSTANTS.conditions = ["Afraid", "Hopeless", "Insecure", "Guilty", "Angry", "Extra"];
CONSTANTS.teamStoryLabel = "When our team first came together...";
CONSTANTS.looksHelpText = "Think about your look, how you physically appear to others—how you\n" +
    "present yourself, what you regularly wear, and so on. Choose as many from\n" +
    "each list as apply. You might also choose some options differentiating how you\n" +
    "look in your heroic persona and how you look the rest of the time.";

export class PlaybookList {
    static async getPlaybooks(labels_only = true) {
        // First, retrieve any custom or overridden playbooks so that we can
        // prioritize those.
        let playbooks = game.items.entities.filter(item => item.type == 'playbook');
        // Next, retrieve compendium playbooks and merge them in.
        for (let c of game.packs) {
            if (c.metadata.entity && c.metadata.entity == 'Item' && c.metadata.name == 'playbooks') {
                let items = c ? await c.getContent() : [];
                playbooks = playbooks.concat(items);
            }
        }
        // Reduce duplicates. Because item playbooks happen first, this will prevent
        // duplicate compendium entries from overriding the items.
        let charPlaybookNames = [];
        for (let charplaybook of playbooks) {
            let charplaybookName = charplaybook.data.name;
            if (charPlaybookNames.includes(charplaybookName) !== false) {
                playbooks = playbooks.filter(item => item._id != charplaybook._id);
            } else {
                charPlaybookNames.push(charplaybookName);
            }
        }

        // Sort + return the charPlaybookNames list.
        if (labels_only) {
            charPlaybookNames.sort((a, b) => {
                const aSort = a.toLowerCase();
                const bSort = b.toLowerCase();
                if (aSort < bSort) {
                    return -1;
                }
                if (aSort > bSort) {
                    return 1;
                }
                return 0;
            });

            return charPlaybookNames;
        }
        // Sort + return the playbook objects list.
        else {
            playbooks.sort((a, b) => {
                const aSort = a.data.name.toLowerCase();
                const bSort = b.data.name.toLowerCase();
                if (aSort < bSort) {
                    return -1;
                }
                if (aSort > bSort) {
                    return 1;
                }
                return 0;
            });

            return playbooks;
        }
    }
}
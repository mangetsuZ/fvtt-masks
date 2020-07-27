/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MasksActor extends Actor {

  /** @override */
  getRollData() {
    const data = super.getRollData();
    const shorthand = game.settings.get("masks", "macroShorthand");
    const unbound = game.settings.get("masks", "enableUnboundSupplement");
    const herald = game.settings.get("masks", "enableHeraldSupplement");
    const aegis = game.settings.get("masks", "enableAegisSupplement");

    // Re-map all attributes onto the base roll data
    if ( !!shorthand ) {
      for ( let [k, v] of Object.entries(data.attributes) ) {
        if ( !(k in data) ) data[k] = v.value;
      }
      delete data.attributes;
    }

    // Map all items data using their slugified names
    data.items = this.data.items.reduce((obj, i) => {
      let key = i.name.slugify({strict: true});
      let itemData = duplicate(i.data);
      if ( !!shorthand ) {
        for ( let [k, v] of Object.entries(itemData.attributes) ) {
          if ( !(k in itemData) ) itemData[k] = v.value;
        }
        delete itemData["attributes"];
      }
      obj[key] = itemData;
      return obj;
    }, {});
    return data;
  }

  /** @override */
  static async create(data, options) {
    // If the created actor has items (only applicable to duplicated actors) bypass the new actor creation logic
    if (data.items)
    {
      return super.create(data, options);
    }

    // Initialize empty items
    data.items = [];

    // Default auto calculation to true
    data.flags =
        {
        };

    // If character, automatically add basic skills and money items
    if (data.type == "hero")
    {
      for (let sk of basicSkills) // Add basic skills
      {
        data.items.push(sk);
      }
      for (let m of moneyItems)   // Add money items, with a quantity of 0
      {
        m.data.quantity.value = 0;
        data.items.push(m);
      }
      super.create(data, options); // Follow through the the rest of the Actor creation process upstream
    }
  }
}

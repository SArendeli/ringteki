const RoleCard = require('../../rolecard.js');

class KeeperOfWater extends RoleCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                afterConflict: (event, context) => event.conflict.elements.some(element => this.hasTrait(element)) &&
                                                   event.conflict.winner === context.player &&
                                                   event.conflict.defendingPlayer === context.player
            },
            gameAction: ability.actions.gainFate()
        });
    }
}

KeeperOfWater.id = 'keeper-of-water';

module.exports = KeeperOfWater;

const DrawCard = require('../../drawcard.js');

class KakitaBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.currentDuel && this.game.currentDuel.isInvolved(this.parent),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
        this.reaction({
            title: 'Gain honor on duel win',
            when:{
                afterDuel: (event, context) => event.winner === context.source.parent
            },
            gameAction: ability.actions.gainHonor()
        });
    }
}

KakitaBlade.id = 'kakita-blade';

module.exports = KakitaBlade;

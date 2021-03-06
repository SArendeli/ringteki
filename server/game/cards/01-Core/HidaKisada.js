const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { Locations, CardTypes, EventNames, AbilityTypes } = require('../../Constants');

class HidaKisada extends DrawCard {
    setupCardAbilities() {
        this.canCancel = false;
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([{
            [EventNames.OnCardAbilityInitiated + ':' + AbilityTypes.OtherEffects]: 'onCardAbilityInitiatedOtherEffects'
        }]);
        this.abilityRegistrar.register([
            EventNames.OnCardAbilityTriggered,
            EventNames.OnConflictDeclared,
            EventNames.OnConflictFinished
        ]);
    }

    onCardAbilityInitiatedOtherEffects(event) {
        if(this.canCancel && event.context.ability.abilityType === 'action' && !event.context.ability.cannotBeCancelled && event.context.player !== this.controller) {
            if(!event.cancelled && this.location === Locations.PlayArea && !this.isBlank() && !this.game.conflictRecord.some(conflict => conflict.winner === this.controller.opponent)) {
                event.cancel();
                this.game.addMessage('{0} attempts to initiate {1}{2}, but {3} cancels it', event.context.player, event.card, event.card.type === CardTypes.Event ? '' : '\'s ability', this);
            }
            this.canCancel = false;
        }
    }

    onCardAbilityTriggered(event) {
        if(this.canCancel && event.ability.abilityType === 'action' && event.player !== this.controller) {
            this.canCancel = false;
        }
    }

    onConflictFinished() {
        this.canCancel = false;
    }

    onConflictDeclared() {
        this.canCancel = true;
    }
}

HidaKisada.id = 'hida-kisada';

module.exports = HidaKisada;

const CardGameAction = require('./CardGameAction');
const { Locations, Durations, EventNames } = require('../Constants');

class LastingEffectCardAction extends CardGameAction {
    setDefaultProperties() {
        this.duration = Durations.UntilEndOfConflict;
        this.condition = null;
        this.until = null;
        this.effect = [];
        this.targetLocation = null;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect to {0}';
    }

    update(context) {
        super.update(context);
        let effect = this.effect;
        if(!Array.isArray(effect)) {
            effect = [effect];
        }
        let effectProperties = {
            condition: this.condition,
            duration: this.duration,
            targetLocation: this.targetLocation,
            until: this.until
        };
        this.effect = effect.map(factory => factory(context.game, context.source, effectProperties));
    }

    canAffect(card, context) {
        if(card.location !== Locations.PlayArea && this.targetLocation !== Locations.Provinces) {
            return false;
        }
        if(!this.effect.some(effect => effect.effect.canBeApplied(card))) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let { effect } = this.propertyFactory(context);
        let properties = {
            condition: this.condition,
            effect: effect,
            match: card,
            targetLocation: this.targetLocation,
            until: this.until
        };
        return super.createEvent(EventNames.OnEffectApplied, { card: card, context: context }, event => event.context.source[this.duration](() => properties));
    }
}

module.exports = LastingEffectCardAction;

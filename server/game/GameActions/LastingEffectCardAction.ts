import { CardGameAction } from './CardGameAction';
import { Durations, Players, EventNames, Locations } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import { LastingEffectGeneralProperties } from './LastingEffectAction';

export interface LastingEffectCardProperties extends LastingEffectGeneralProperties {
    targetLocation?: Locations | Locations[];
}

export class LastingEffectCardAction extends CardGameAction {
    name = 'applyLastingEffect';
    eventName = EventNames.OnEffectApplied;
    effect = 'apply a lasting effect to {0}';
    defaultProperties: LastingEffectCardProperties = {
        duration: Durations.UntilEndOfConflict,
        effect: []
    };
    constructor(properties: LastingEffectCardProperties | ((context: AbilityContext) => LastingEffectCardProperties)) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): LastingEffectCardProperties {
        let properties = super.getProperties(context, additionalProperties) as LastingEffectCardProperties;
        if(!Array.isArray(properties.effect)) {
            properties.effect = [properties.effect];
        }
        return properties;
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(card.location !== Locations.PlayArea && properties.targetLocation !== Locations.Provinces) {
            return false;
        }
        properties.effect = properties.effect.map(factory => factory(context.game, context.source, properties));
        if(!properties.effect.some(effect => effect.effect.canBeApplied(card))) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties);
        event.context.source[properties.duration](() => Object.assign({ match: event.card }, properties));
    }
}

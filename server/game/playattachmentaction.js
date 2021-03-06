const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const AttachAction = require('./GameActions/AttachAction');
const { Phases, PlayTypes, EventNames } = require('./Constants');

class PlayAttachmentAction extends BaseAction {
    constructor(card) {
        super(card, [Costs.payTargetDependentFateCost('target', PlayTypes.PlayFromHand), Costs.playLimited()], {
            gameAction: new AttachAction(context => ({ attachment: context.source })),
            cardCondition: (card, context) => context.source.canPlayOn(card)
        });
        this.title = 'Play this attachment';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('phase') && context.game.currentPhase === Phases.Dynasty) {
            return 'phase';
        }
        if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, PlayTypes.PlayFromHand)) {
            return 'location';
        }
        if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context, PlayTypes.PlayFromHand)) {
            return 'cannotTrigger';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location,
            playType: PlayTypes.PlayFromHand
        });
        context.game.openEventWindow([new AttachAction({ attachment: context.source }).getEvent(context.target, context), cardPlayedEvent]);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayAttachmentAction;


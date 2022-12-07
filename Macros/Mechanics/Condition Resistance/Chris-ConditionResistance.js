let effectData = {
	'label': 'Condition Advantage',
	'icon': 'icons/magic/time/arrows-circling-green.webp',
	'duration': {
		'turns': 1
	},
	'changes': [
		{
			'key': 'flags.midi-qol.advantage.ability.save.all',
			'value': '1',
			'mode': 5,
			'priority': 120
		}
	]
};
let cleanUpList = [];
Hooks.on('midi-qol.preItemRoll', async workflow => {
    if (workflow.targets.size === 0) return;
    if (workflow.item.system.save?.dc === null || workflow.item.system.save === undefined) return;
    if (workflow.item.effects.size === 0) return;
    let itemConditions = new Set();
    workflow.item.effects.forEach(effect => {
        effect.changes.forEach(element => {
            if (element.key === 'macro.CE') itemConditions.add(element.value.toLowerCase());
        });
    });
//    console.log(itemConditions);
    if (itemConditions.size === 0) return;
    workflow.targets.forEach(tokenDoc => {
//        console.log(tokenDoc);
        itemConditions.forEach(async condition => {
            if (tokenDoc.document.actor.flags.world?.CR?.[condition] === 1) {
//                console.log('Adding advantage.');
                await MidiQOL.socket().executeAsGM('createEffects', {'actorUuid': tokenDoc.document.actor.uuid, 'effects': [effectData]});
                cleanUpList.push(tokenDoc.document.actor);
            }
        });
    });
});
Hooks.on('midi-qol.RollComplete', async workflow => {
    for (let i=0; cleanUpList.length > i; i++) {
        let effect = cleanUpList[i].effects.find(eff => eff.label === 'Condition Advantage');
        if (!effect) continue;
        await MidiQOL.socket().executeAsGM('removeEffects', {'actorUuid': cleanUpList[i].uuid, 'effects': [effect.id]});
    }
    cleanUpList = [];
});
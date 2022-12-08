if (this.item.type != 'spell') return;
if (this.item.system.level === 0) return;
let preparation = this.item.system.preparation.mode;
let invalidPreparation = ['atwill', 'innate'];
if (invalidPreparation.includes(preparation)) return;
let validTypes = ['acid', 'cold', 'fire', 'lightning', 'posion'];
let damageType = this.defaultDamageType;
if (!validTypes.includes(damageType)) return;
let damageFormula = this.damageRoll._formula + ' + 1d6[' + damageType + ']';
this.damageRoll = await new Roll(damageFormula).roll({async: true});
this.damageTotal = this.damageRoll.total;
this.damageRollHTML = await this.damageRoll.render();
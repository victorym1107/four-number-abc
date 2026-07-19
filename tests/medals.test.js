const assert = require('assert')
const {
  createInitialMedalState,
  buildMedalCards,
  applyChallengeSuccess,
  applyDoubleSuccess,
  applyFailure,
  applyTrainingCompletion
} = require('../utils/medals')

let state = createInitialMedalState()

state = applyChallengeSuccess(state, { attempts: 2 }).state
assert.strictEqual(state.challengeStreak, 1)
assert.strictEqual(state.counts.firstSteps, 0)

let result = applyChallengeSuccess(state, { attempts: 3 })
state = result.state
assert.deepStrictEqual(result.awarded.map((item) => item.id), ['firstSteps'])
assert.strictEqual(state.counts.firstSteps, 1)

state = createInitialMedalState()
for (let index = 0; index < 5; index += 1) {
  result = applyChallengeSuccess(state, { attempts: 2 })
  state = result.state
}
assert.strictEqual(state.counts.expert, 1)
assert.strictEqual(state.counts.firstSteps, 1)

for (let index = 0; index < 5; index += 1) {
  result = applyChallengeSuccess(state, { attempts: 2 })
  state = result.state
}
assert.strictEqual(state.counts.god, 1)
assert.strictEqual(state.counts.expert, 2)

state = applyFailure(state, 'single')
assert.strictEqual(state.challengeStreak, 0)

state = createInitialMedalState()
for (let index = 0; index < 10; index += 1) {
  result = applyDoubleSuccess(state)
  state = result.state
}
assert.strictEqual(state.doubleStreak, 10)
assert.strictEqual(state.counts.leader, 2)

state = createInitialMedalState()
result = applyTrainingCompletion(state, 100)
state = result.state
assert.strictEqual(state.counts.allReady, 1)

state.counts.god = 1
state.counts.leader = 1
result = applyTrainingCompletion(state, 100)
state = result.state
assert.strictEqual(state.counts.invincible, 1)
assert.strictEqual(state.counts.lonely, 0)

state.counts.god = 3
state.counts.leader = 3
result = applyTrainingCompletion(state, 100)
state = result.state
assert.strictEqual(state.counts.invincible, 1)
assert.strictEqual(state.counts.lonely, 1)

state = createInitialMedalState()
result = applyChallengeSuccess(state, { attempts: 1 })
state = result.state
assert.strictEqual(state.counts.luckKing, 1)
result = applyChallengeSuccess(state, { attempts: 1 })
state = result.state
assert.strictEqual(state.counts.luckKing, 2)
assert.strictEqual(buildMedalCards(createInitialMedalState()).some((card) => card.id === 'luckKing'), true)
assert.strictEqual(buildMedalCards(createInitialMedalState()).find((card) => card.id === 'luckKing').name, '隐藏彩蛋位')
assert.strictEqual(buildMedalCards(state).some((card) => card.id === 'luckKing'), true)
assert.strictEqual(buildMedalCards(state).find((card) => card.id === 'luckKing').name, '运气之王')
assert.strictEqual(buildMedalCards(state).find((card) => card.id === 'luckKing').countText, '×2')

const cards = buildMedalCards(state)
assert.strictEqual(cards.find((card) => card.id === 'firstSteps').countText, '')
assert.strictEqual(cards.find((card) => card.id === 'invincible').countText, '')

console.log('medal tests passed')

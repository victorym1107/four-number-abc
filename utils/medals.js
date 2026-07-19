const MEDALS = [
  {
    id: 'firstSteps',
    name: '崭露头角',
    description: '开始挑战连续成功2次',
    repeatable: false
  },
  {
    id: 'allReady',
    name: '万事俱备',
    description: '100关拆弹训练全部通过',
    repeatable: false
  },
  {
    id: 'expert',
    name: '拆弹高手',
    description: '开始挑战每连续成功5次获得一枚',
    repeatable: true
  },
  {
    id: 'god',
    name: '拆弹之神',
    description: '开始挑战每连续成功10次获得一枚',
    repeatable: true
  },
  {
    id: 'leader',
    name: '带队者',
    description: '队友切磋每连续成功5次获得一枚',
    repeatable: true
  },
  {
    id: 'invincible',
    name: '完美无缺',
    description: '万事俱备、拆弹之神、带队者至少各获得一枚',
    repeatable: false
  },
  {
    id: 'lonely',
    name: '无敌是多么寂寞',
    description: '获得1个完美无缺，并获得拆弹之神、带队者各3枚',
    repeatable: false
  },
  {
    id: 'luckKing',
    name: '运气之王',
    description: '挑战或训练中一次拆弹成功',
    repeatable: true,
    hidden: true
  }
]

function createInitialMedalState() {
  return {
    challengeStreak: 0,
    doubleStreak: 0,
    counts: MEDALS.reduce((counts, medal) => {
      counts[medal.id] = 0
      return counts
    }, {})
  }
}

function normalizeMedalState(state) {
  const initial = createInitialMedalState()
  const counts = Object.assign({}, initial.counts, state && state.counts)

  return {
    challengeStreak: Number(state && state.challengeStreak) || 0,
    doubleStreak: Number(state && state.doubleStreak) || 0,
    counts
  }
}

function awardOnce(state, awarded, medalId) {
  if (state.counts[medalId] > 0) {
    return
  }

  state.counts[medalId] = 1
  awarded.push(getMedal(medalId))
}

function awardRepeat(state, awarded, medalId) {
  state.counts[medalId] += 1
  awarded.push(getMedal(medalId))
}

function getMedal(medalId) {
  return MEDALS.find((medal) => medal.id === medalId)
}

function applyChallengeSuccess(rawState, options) {
  const state = normalizeMedalState(rawState)
  const awarded = []

  state.challengeStreak += 1

  if (state.challengeStreak >= 2) {
    awardOnce(state, awarded, 'firstSteps')
  }

  if (state.challengeStreak % 5 === 0) {
    awardRepeat(state, awarded, 'expert')
  }

  if (state.challengeStreak % 10 === 0) {
    awardRepeat(state, awarded, 'god')
  }

  if (options && options.attempts === 1) {
    awardRepeat(state, awarded, 'luckKing')
  }

  applyComboMedals(state, awarded)

  return { state, awarded }
}

function applyDoubleSuccess(rawState) {
  const state = normalizeMedalState(rawState)
  const awarded = []

  state.doubleStreak += 1

  if (state.doubleStreak % 5 === 0) {
    awardRepeat(state, awarded, 'leader')
  }

  applyComboMedals(state, awarded)

  return { state, awarded }
}

function applyTrainingCompletion(rawState, completedCount, options) {
  const state = normalizeMedalState(rawState)
  const awarded = []

  if (completedCount >= 100) {
    awardOnce(state, awarded, 'allReady')
  }

  if (options && options.attempts === 1) {
    awardRepeat(state, awarded, 'luckKing')
  }

  applyComboMedals(state, awarded)

  return { state, awarded }
}

function applyFailure(rawState, mode) {
  const state = normalizeMedalState(rawState)

  if (mode === 'single') {
    state.challengeStreak = 0
  }

  if (mode === 'double') {
    state.doubleStreak = 0
  }

  return state
}

function applyComboMedals(state, awarded) {
  if (state.counts.allReady > 0 && state.counts.god > 0 && state.counts.leader > 0) {
    awardOnce(state, awarded, 'invincible')
  }

  if (
    state.counts.invincible >= 1 &&
    state.counts.god >= 3 &&
    state.counts.leader >= 3
  ) {
    awardOnce(state, awarded, 'lonely')
  }
}

function buildMedalCards(rawState) {
  const state = normalizeMedalState(rawState)

  return MEDALS
    .map((medal) => {
      const count = state.counts[medal.id] || 0
      const hiddenLocked = medal.hidden && count === 0

      return {
        id: medal.id,
        name: hiddenLocked ? '隐藏彩蛋位' : medal.name,
        description: hiddenLocked ? '达成神秘条件后点亮' : medal.description,
        count,
        earned: count > 0,
        statusClass: `${count > 0 ? 'earned' : 'locked'}${hiddenLocked ? ' hidden-slot' : ''}`,
        countText: medal.repeatable && count > 1 ? `×${count}` : ''
      }
    })
}

module.exports = {
  MEDALS,
  createInitialMedalState,
  normalizeMedalState,
  buildMedalCards,
  applyChallengeSuccess,
  applyDoubleSuccess,
  applyFailure,
  applyTrainingCompletion
}

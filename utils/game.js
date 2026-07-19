const DUPLICATE_MESSAGE = '数据不能重复，请重新输入'
const FORMAT_MESSAGE = '请输入4位数字密码'
const LEVEL_PATTERNS = [
  'AABB',
  'ABBB',
  'BBBB',
  'AAAC',
  'AABC',
  'ABBC',
  'BBBC',
  'AACC',
  'ABCC',
  'BBCC',
  'ACCC',
  'BCCC',
  'CCCC'
]
const INITIAL_BOMB_SECONDS = 600
const WRONG_GUESS_PENALTY_SECONDS = 60

function validatePassword(value) {
  const text = String(value || '').trim()

  if (!/^\d{4}$/.test(text)) {
    return {
      valid: false,
      message: FORMAT_MESSAGE
    }
  }

  if (new Set(text.split('')).size !== 4) {
    return {
      valid: false,
      message: DUPLICATE_MESSAGE
    }
  }

  return {
    valid: true,
    value: text
  }
}

function generatePassword() {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const result = []

  while (result.length < 4) {
    const index = Math.floor(Math.random() * digits.length)
    result.push(digits.splice(index, 1)[0])
  }

  return result.join('')
}

function scoreGuess(answer, guess) {
  let aCount = 0
  let bCount = 0
  let cCount = 0

  for (let index = 0; index < guess.length; index += 1) {
    const digit = guess[index]

    if (answer[index] === digit) {
      aCount += 1
    } else if (answer.indexOf(digit) !== -1) {
      bCount += 1
    } else {
      cCount += 1
    }
  }

  return 'A'.repeat(aCount) + 'B'.repeat(bCount) + 'C'.repeat(cCount)
}

function formatBombTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function reduceTimeAfterWrongGuess(seconds) {
  return Math.max(0, (Number(seconds) || 0) - WRONG_GUESS_PENALTY_SECONDS)
}

function tickBombTime(seconds) {
  return Math.max(0, (Number(seconds) || 0) - 1)
}

function getLevelPattern(level) {
  const numericLevel = Number(level)

  if (numericLevel >= 97) {
    return 'CCCC'
  }

  const patternIndex = Math.max(0, Math.ceil(numericLevel / 8) - 1)
  return LEVEL_PATTERNS[Math.min(patternIndex, LEVEL_PATTERNS.length - 1)]
}

function getLevelTier(level) {
  return LEVEL_PATTERNS.indexOf(getLevelPattern(level))
}

function generateClueForPattern(answer, pattern) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const candidates = []

  for (let a = 0; a < digits.length; a += 1) {
    for (let b = 0; b < digits.length; b += 1) {
      for (let c = 0; c < digits.length; c += 1) {
        for (let d = 0; d < digits.length; d += 1) {
          if (a === b || a === c || a === d || b === c || b === d || c === d) {
            continue
          }

          const candidate = digits[a] + digits[b] + digits[c] + digits[d]

          if (scoreGuess(answer, candidate) === pattern) {
            candidates.push(candidate)
          }
        }
      }
    }
  }

  if (candidates.length === 0) {
    return ''
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}

module.exports = {
  DUPLICATE_MESSAGE,
  FORMAT_MESSAGE,
  INITIAL_BOMB_SECONDS,
  WRONG_GUESS_PENALTY_SECONDS,
  LEVEL_PATTERNS,
  validatePassword,
  generatePassword,
  scoreGuess,
  formatBombTime,
  reduceTimeAfterWrongGuess,
  tickBombTime,
  getLevelPattern,
  getLevelTier,
  generateClueForPattern
}

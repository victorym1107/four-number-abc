const assert = require('assert')
const {
  DUPLICATE_MESSAGE,
  LEVEL_PATTERNS,
  validatePassword,
  generatePassword,
  scoreGuess,
  getLevelPattern,
  getLevelTier,
  generateClueForPattern,
  formatBombTime,
  reduceTimeAfterWrongGuess,
  tickBombTime
} = require('../utils/game')

assert.deepStrictEqual(validatePassword('0472'), {
  valid: true,
  value: '0472'
})

assert.deepStrictEqual(validatePassword('1123'), {
  valid: false,
  message: DUPLICATE_MESSAGE
})

assert.strictEqual(validatePassword('123').valid, false)
assert.strictEqual(validatePassword('12a4').valid, false)

assert.strictEqual(scoreGuess('1234', '1234'), 'AAAA')
assert.strictEqual(scoreGuess('1234', '1325'), 'ABBC')
assert.strictEqual(scoreGuess('1234', '5678'), 'CCCC')
assert.strictEqual(scoreGuess('0472', '2047'), 'BBBB')

assert.strictEqual(formatBombTime(600), '10:00')
assert.strictEqual(formatBombTime(540), '09:00')
assert.strictEqual(formatBombTime(0), '00:00')
assert.strictEqual(reduceTimeAfterWrongGuess(600), 540)
assert.strictEqual(reduceTimeAfterWrongGuess(30), 0)
assert.strictEqual(reduceTimeAfterWrongGuess(0), 0)
assert.strictEqual(tickBombTime(600), 599)
assert.strictEqual(tickBombTime(1), 0)
assert.strictEqual(tickBombTime(0), 0)

assert.strictEqual(getLevelPattern(1), 'AABB')
assert.strictEqual(getLevelPattern(8), 'AABB')
assert.strictEqual(getLevelPattern(9), 'ABBB')
assert.strictEqual(getLevelPattern(96), 'BCCC')
assert.strictEqual(getLevelPattern(97), 'CCCC')
assert.strictEqual(getLevelPattern(100), 'CCCC')
assert.strictEqual(getLevelTier(1), 0)
assert.strictEqual(getLevelTier(100), LEVEL_PATTERNS.length - 1)

LEVEL_PATTERNS.forEach((pattern) => {
  const clue = generateClueForPattern('1234', pattern)
  assert.match(clue, /^\d{4}$/)
  assert.strictEqual(new Set(clue.split('')).size, 4)
  assert.strictEqual(scoreGuess('1234', clue), pattern)
})

for (let index = 0; index < 100; index += 1) {
  const password = generatePassword()
  assert.match(password, /^\d{4}$/)
  assert.strictEqual(new Set(password.split('')).size, 4)
}

console.log('game tests passed')

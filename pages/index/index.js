const {
  createInitialMedalState,
  normalizeMedalState,
  buildMedalCards,
  applyChallengeSuccess,
  applyDoubleSuccess,
  applyFailure,
  applyTrainingCompletion
} = require('../../utils/medals')

const {
  DUPLICATE_MESSAGE,
  validatePassword,
  generatePassword,
  scoreGuess,
  INITIAL_BOMB_SECONDS,
  formatBombTime,
  reduceTimeAfterWrongGuess,
  tickBombTime,
  getLevelPattern,
  getLevelTier,
  generateClueForPattern
} = require('../../utils/game')

const STORAGE_KEY = 'abcGuessHistory'
const LEARNING_KEY = 'abcLearningProgress'
const MEDAL_KEY = 'abcMedals'
const TOTAL_LEVELS = 100
const SUCCESS_DELAY = 1900
const FAILURE_DELAY = 1700
const MEDAL_DELAY = 1600
const BGM_SRC = '/assets/audio/suno-loop-bgm.mp3'
const BGM_VOLUME = 0.22
const BGM_LOOP_MS = 59250
const BGM_CROSSFADE_MS = 2600
const TENSION_BEEP_FILE = 'abc-tension-beep.wav'
const TENSION_BEEP_BASE64 = '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'

function buildGuessCells(value) {
  const chars = String(value || '').slice(0, 4).split('')
  const activeIndex = chars.length >= 4 ? 3 : chars.length

  return [0, 1, 2, 3].map((index) => ({
    value: chars[index] || '-',
    active: index === activeIndex
  }))
}

Page({
  data: {
    view: 'home',
    mode: '',
    modeLabel: '',
    playTitle: '',
    answer: '',
    timeLeft: INITIAL_BOMB_SECONDS,
    bombTimeText: formatBombTime(INITIAL_BOMB_SECONDS),
    setupValue: '',
    guessValue: '',
    guessCells: buildGuessCells(''),
    message: '',
    attempts: 0,
    records: [],
    history: [],
    revealedAnswer: '',
    revealNote: '',
    showDeleteChoices: false,
    selectingHistory: false,
    selectedHistory: {},
    historySelectClass: '',
    bgmMuted: false,
    isLearning: false,
    currentLevel: 0,
    levelPattern: '',
    clueNumber: '',
    clueResult: '',
    levelCards: [],
    completedLevels: {},
    learningPassedCount: 0,
    showUpgrade: false,
    showSuccessBurst: false,
    showFailBurst: false,
    pendingSuccess: null,
    medalState: createInitialMedalState(),
    medalCards: [],
    activeMedal: null,
    showMedalAward: false
  },

  onLoad() {
    this.loadHistory()
    this.loadLearningProgress()
    this.loadMedals()
    this.startBgm()
  },

  onShow() {
    this.startBgm()
  },

  toggleBgmMute() {
    const bgmMuted = !this.data.bgmMuted

    this.setData({ bgmMuted })

    if (bgmMuted) {
      this.stopBgm()
      return
    }

    this.startBgm()
  },

  onUnload() {
    this.stopBombTimer()
    this.stopBgm()
  },

  startSingle() {
    this.startGame('single', generatePassword())
  },

  openRules() {
    this.setData({
      view: 'rules',
      message: ''
    })
  },

  openLearning() {
    this.loadLearningProgress()
    this.setData({
      view: 'learnHome',
      message: ''
    })
  },

  openMedals() {
    this.loadMedals()
    this.setData({
      view: 'medals',
      message: ''
    })
  },

  startLearningChallenge() {
    const nextLevel = this.findNextLearningLevel()
    this.startLearningLevel(nextLevel)
  },

  openLearningJourney() {
    this.loadLearningProgress()
    this.setData({
      view: 'learnJourney',
      message: ''
    })
  },

  replayLearningLevel(event) {
    const level = Number(event.currentTarget.dataset.level)

    if (!this.data.completedLevels[level]) {
      this.setData({
        message: '先通过这一关，才能再闯一次'
      })
      return
    }

    this.startLearningLevel(level)
  },

  startLearningLevel(level) {
    const answer = generatePassword()
    const pattern = getLevelPattern(level)
    const clueNumber = generateClueForPattern(answer, pattern)

    this.setData({
      view: 'play',
      mode: 'learning',
      modeLabel: '拆弹训练',
      playTitle: `第${level}关`,
      answer,
      timeLeft: INITIAL_BOMB_SECONDS,
      bombTimeText: formatBombTime(INITIAL_BOMB_SECONDS),
      setupValue: '',
      guessValue: '',
      guessCells: buildGuessCells(''),
      message: '',
      attempts: 0,
      records: [],
      revealedAnswer: '',
      isLearning: true,
      currentLevel: level,
      levelPattern: pattern,
      clueNumber,
      clueResult: pattern,
      showUpgrade: false,
      showSuccessBurst: false,
      showFailBurst: false,
      pendingSuccess: null
    })
    this.startBombTimer()
    this.playTensionSound()
  },

  openDoubleSetup() {
    this.setData({
      view: 'setup',
      mode: 'double',
      modeLabel: '队友切磋',
      playTitle: '',
      setupValue: '',
      message: '',
      records: [],
      attempts: 0,
      revealedAnswer: '',
      isLearning: false,
      currentLevel: 0,
      levelPattern: '',
      clueNumber: '',
      clueResult: '',
      showUpgrade: false,
      showSuccessBurst: false,
      showFailBurst: false,
      pendingSuccess: null
    })
    this.startBombTimer()
    this.playTensionSound()
  },

  onSetupInput(event) {
    this.setData({
      setupValue: event.detail.value,
      message: ''
    })
  },

  confirmSetup() {
    const result = validatePassword(this.data.setupValue)

    if (!result.valid) {
      this.showMessage(result.message)
      return
    }

    this.startGame('double', result.value)
  },

  startGame(mode, answer) {
    this.setData({
      view: 'play',
      mode,
      modeLabel: mode === 'single' ? '开始挑战' : '队友切磋',
      playTitle: '第 1 次猜测',
      answer,
      timeLeft: INITIAL_BOMB_SECONDS,
      bombTimeText: formatBombTime(INITIAL_BOMB_SECONDS),
      setupValue: '',
      guessValue: '',
      guessCells: buildGuessCells(''),
      message: '',
      attempts: 0,
      records: [],
      revealedAnswer: '',
      isLearning: false,
      currentLevel: 0,
      levelPattern: '',
      clueNumber: '',
      clueResult: '',
      showUpgrade: false,
      showSuccessBurst: false,
      showFailBurst: false,
      pendingSuccess: null
    })
    this.startBombTimer()
    this.playTensionSound()
  },

  onGuessInput(event) {
    const guessValue = event.detail.value

    this.setData({
      guessValue,
      guessCells: buildGuessCells(guessValue),
      message: ''
    })
  },

  submitGuess() {
    const result = validatePassword(this.data.guessValue)

    if (!result.valid) {
      this.showMessage(result.message)
      return
    }

    const attempts = this.data.attempts + 1
    const score = scoreGuess(this.data.answer, result.value)
    const records = [{
      guess: result.value,
      score
    }].concat(this.data.records)

    if (score === 'AAAA') {
      this.handleSuccess(attempts, records)
      return
    }

    const timeLeft = reduceTimeAfterWrongGuess(this.data.timeLeft)

    if (timeLeft === 0) {
      this.handleBombFailure(attempts, records, '倒计时归零')
      return
    }

    this.setData({
      attempts,
      records,
      guessValue: '',
      guessCells: buildGuessCells(''),
      message: score,
      playTitle: `第 ${attempts + 1} 次猜测`,
      timeLeft,
      bombTimeText: formatBombTime(timeLeft)
    })
    this.playTensionSound()
  },

  handleSuccess(attempts, records) {
    this.stopBombTimer()
    this.playSuccessSound()

    if (this.data.isLearning) {
      const completedBefore = !!this.data.completedLevels[this.data.currentLevel]
      const currentTier = getLevelTier(this.data.currentLevel)
      const completedLevels = Object.assign({}, this.data.completedLevels, {
        [this.data.currentLevel]: true
      })
      const nextTier = getLevelTier(Math.min(this.data.currentLevel + 1, TOTAL_LEVELS))
      const shouldUpgrade = !completedBefore && this.data.currentLevel < TOTAL_LEVELS && nextTier > currentTier

      this.saveLearningProgress(completedLevels)
      const medalResult = applyTrainingCompletion(this.data.medalState, Object.keys(completedLevels).length, {
        attempts
      })
      this.saveMedals(medalResult.state)
      this.queueMedalAwards(medalResult.awarded)
      this.setData({
        attempts,
        records,
        guessValue: '',
        guessCells: buildGuessCells(''),
        showSuccessBurst: true,
        pendingSuccess: {
          type: 'learning',
          shouldUpgrade
        }
      })
      this.finishSuccessAfterDelay()
      return
    }

    this.addHistory(`${attempts}次`)
    const medalResult = this.data.mode === 'double'
      ? applyDoubleSuccess(this.data.medalState)
      : applyChallengeSuccess(this.data.medalState, { attempts })
    this.saveMedals(medalResult.state)
    this.queueMedalAwards(medalResult.awarded)
    this.setData({
      attempts,
      records,
      guessValue: '',
      guessCells: buildGuessCells(''),
      showSuccessBurst: true,
      pendingSuccess: {
        type: 'normal'
      }
    })
    this.finishSuccessAfterDelay()
  },

  finishSuccessAfterDelay() {
    setTimeout(() => {
      const pendingSuccess = this.data.pendingSuccess

      if (!pendingSuccess) {
        return
      }

      if (pendingSuccess.type === 'learning') {
      this.setData({
        view: 'learnPassed',
          showSuccessBurst: false,
          showUpgrade: pendingSuccess.shouldUpgrade,
          pendingSuccess: null,
          message: `第${this.data.currentLevel}关通过，共猜了${this.data.attempts}次`
        })
        return
      }

      this.setData({
        view: 'success',
        showSuccessBurst: false,
        pendingSuccess: null,
        message: `挑战成功，共猜了${this.data.attempts}次`
      })
    }, SUCCESS_DELAY)
  },

  revealAnswer() {
    this.handleBombFailure(this.data.attempts, this.data.records, '已公布答案')
  },

  handleBombFailure(attempts, records, reason) {
    this.stopBombTimer()
    this.playFailureSound()

    if (!this.data.isLearning) {
      this.addHistory('未猜出')
    }

    if (this.data.mode === 'single' || this.data.mode === 'double') {
      this.saveMedals(applyFailure(this.data.medalState, this.data.mode))
    }

    this.setData({
      showFailBurst: true,
      attempts,
      records,
      guessValue: '',
      guessCells: buildGuessCells(''),
      timeLeft: 0,
      bombTimeText: '00:00',
      revealedAnswer: this.data.answer,
      revealNote: this.data.isLearning ? '拆弹训练不计入战绩排行' : '本局战绩已记为“未猜出”',
      message: reason || '拆弹失败'
    })

    setTimeout(() => {
      this.setData({
        view: 'revealed',
        showFailBurst: false
      })
    }, FAILURE_DELAY)
  },

  exitGame() {
    this.stopBombTimer()
    this.goHome()
  },

  goHome() {
    this.stopBombTimer()
    this.setData({
      view: 'home',
      mode: '',
      modeLabel: '',
      playTitle: '',
      answer: '',
      timeLeft: INITIAL_BOMB_SECONDS,
      bombTimeText: formatBombTime(INITIAL_BOMB_SECONDS),
      setupValue: '',
      guessValue: '',
      guessCells: buildGuessCells(''),
      message: '',
      attempts: 0,
      records: [],
      revealedAnswer: '',
      revealNote: '',
      isLearning: false,
      currentLevel: 0,
      levelPattern: '',
      clueNumber: '',
      clueResult: '',
      showUpgrade: false,
      showSuccessBurst: false,
      showFailBurst: false,
      pendingSuccess: null
    })
  },

  startBombTimer() {
    this.stopBombTimer()
    this.bombTimer = setInterval(() => {
      if (this.data.view !== 'play') {
        this.stopBombTimer()
        return
      }

      const timeLeft = tickBombTime(this.data.timeLeft)

      if (timeLeft === 0) {
        this.handleBombFailure(this.data.attempts, this.data.records, '倒计时归零')
        return
      }

      this.setData({
        timeLeft,
        bombTimeText: formatBombTime(timeLeft)
      })
    }, 1000)
  },

  stopBombTimer() {
    if (this.bombTimer) {
      clearInterval(this.bombTimer)
      this.bombTimer = null
    }
  },

  startBgm() {
    if (this.data.bgmMuted) {
      return
    }

    if (typeof wx === 'undefined' || !wx.createInnerAudioContext) {
      return
    }

    if (this.bgmAudio) {
      this.bgmAudio.play()
      return
    }

    this.bgmAudio = this.createBgmAudio(BGM_VOLUME)
    this.bgmAudio.play()
    this.scheduleBgmCrossfade()
  },

  stopBgm() {
    if (this.bgmLoopTimer) {
      clearTimeout(this.bgmLoopTimer)
      this.bgmLoopTimer = null
    }

    if (this.bgmFadeTimer) {
      clearInterval(this.bgmFadeTimer)
      this.bgmFadeTimer = null
    }

    if (this.bgmAudio) {
      this.bgmAudio.stop()
      this.bgmAudio.destroy()
      this.bgmAudio = null
    }

    if (this.bgmFadingAudio) {
      this.bgmFadingAudio.stop()
      this.bgmFadingAudio.destroy()
      this.bgmFadingAudio = null
    }
  },

  createBgmAudio(volume) {
    const audio = wx.createInnerAudioContext()
    audio.src = BGM_SRC
    audio.loop = false
    audio.volume = volume
    audio.onEnded(() => {
      this.handleBgmEnded(audio)
    })
    audio.onError(() => {
      this.stopBgm()
    })
    return audio
  },

  scheduleBgmCrossfade() {
    if (this.bgmLoopTimer) {
      clearTimeout(this.bgmLoopTimer)
    }

    this.bgmLoopTimer = setTimeout(() => {
      this.crossfadeBgm()
    }, BGM_LOOP_MS - BGM_CROSSFADE_MS)
  },

  crossfadeBgm() {
    if (this.data.bgmMuted || !this.bgmAudio || typeof wx === 'undefined' || !wx.createInnerAudioContext) {
      return
    }

    const current = this.bgmAudio
    const next = this.createBgmAudio(0)
    const steps = 13
    const stepMs = Math.floor(BGM_CROSSFADE_MS / steps)
    let step = 0

    this.bgmFadingAudio = current
    this.bgmAudio = next
    next.play()
    this.scheduleBgmCrossfade()

    if (this.bgmFadeTimer) {
      clearInterval(this.bgmFadeTimer)
    }

    this.bgmFadeTimer = setInterval(() => {
      step += 1
      const progress = Math.min(step / steps, 1)

      current.volume = BGM_VOLUME * (1 - progress)
      next.volume = BGM_VOLUME * progress

      if (progress >= 1) {
        clearInterval(this.bgmFadeTimer)
        this.bgmFadeTimer = null
        current.stop()
        current.destroy()

        if (this.bgmFadingAudio === current) {
          this.bgmFadingAudio = null
        }
      }
    }, stepMs)
  },

  handleBgmEnded(audio) {
    if (audio !== this.bgmAudio) {
      audio.destroy()
      return
    }

    this.bgmAudio = null
    this.startBgm()
  },

  ensureSoundFile() {
    if (this.soundFilePath) {
      return this.soundFilePath
    }

    if (typeof wx === 'undefined' || !wx.env || !wx.env.USER_DATA_PATH || !wx.getFileSystemManager) {
      return ''
    }

    const filePath = `${wx.env.USER_DATA_PATH}/${TENSION_BEEP_FILE}`

    try {
      wx.getFileSystemManager().writeFileSync(filePath, TENSION_BEEP_BASE64, 'base64')
      this.soundFilePath = filePath
      return filePath
    } catch (error) {
      return ''
    }
  },

  playEffectSound(playbackRate, volume) {
    if (typeof wx === 'undefined' || !wx.createInnerAudioContext) {
      return
    }

    const src = this.ensureSoundFile()

    if (!src) {
      return
    }

    const audio = wx.createInnerAudioContext()
    audio.src = src
    audio.volume = volume
    audio.playbackRate = playbackRate

    audio.onEnded(() => {
      audio.destroy()
    })
    audio.onError(() => {
      audio.destroy()
    })
    audio.play()
  },

  playTensionSound() {
    this.playEffectSound(1.15, 0.32)
  },

  playSuccessSound() {
    this.playEffectSound(1.55, 0.42)
  },

  playFailureSound() {
    this.playEffectSound(0.72, 0.5)
  },

  openHistory() {
    this.loadHistory()
    this.setData({
      view: 'history',
      message: '',
      showDeleteChoices: false,
      selectingHistory: false,
      selectedHistory: {},
      historySelectClass: ''
    })
  },

  openDeleteChoices() {
    this.setData({
      showDeleteChoices: !this.data.showDeleteChoices,
      selectingHistory: false,
      selectedHistory: {},
      historySelectClass: ''
    })
  },

  clearHistory() {
    wx.removeStorageSync(STORAGE_KEY)
    this.setData({
      history: [],
      showDeleteChoices: false,
      selectingHistory: false,
      selectedHistory: {},
      historySelectClass: ''
    })
  },

  startSelectDelete() {
    if (this.data.history.length === 0) {
      this.setData({
        showDeleteChoices: false,
        selectingHistory: false,
        selectedHistory: {},
        historySelectClass: '',
        message: '暂无可删除记录'
      })
      return
    }

    this.setData({
      showDeleteChoices: false,
      selectingHistory: true,
      selectedHistory: {},
      historySelectClass: 'selecting',
      message: ''
    })
  },

  toggleHistorySelection(event) {
    if (!this.data.selectingHistory) {
      return
    }

    const index = event.currentTarget.dataset.index
    const selectedHistory = Object.assign({}, this.data.selectedHistory)

    if (selectedHistory[index]) {
      delete selectedHistory[index]
    } else {
      selectedHistory[index] = true
    }

    this.setData({
      selectedHistory
    })
  },

  deleteSelectedHistory() {
    const selectedHistory = this.data.selectedHistory
    const history = this.data.history.filter((item, index) => !selectedHistory[index])

    wx.setStorageSync(STORAGE_KEY, history)
    this.setData({
      history,
      selectingHistory: false,
      selectedHistory: {},
      historySelectClass: '',
      message: ''
    })
  },

  cancelSelectDelete() {
    this.setData({
      selectingHistory: false,
      selectedHistory: {},
      historySelectClass: ''
    })
  },

  loadHistory() {
    const history = wx.getStorageSync(STORAGE_KEY) || []
    this.setData({
      history
    })
  },

  loadLearningProgress() {
    const completedLevels = wx.getStorageSync(LEARNING_KEY) || {}
    const levelCards = this.createLevelCards(completedLevels)

    this.setData({
      completedLevels,
      levelCards,
      learningPassedCount: Object.keys(completedLevels).length
    })
  },

  loadMedals() {
    const medalState = normalizeMedalState(wx.getStorageSync(MEDAL_KEY) || createInitialMedalState())

    this.setData({
      medalState,
      medalCards: buildMedalCards(medalState)
    })
  },

  saveMedals(medalState) {
    const normalized = normalizeMedalState(medalState)

    wx.setStorageSync(MEDAL_KEY, normalized)
    this.setData({
      medalState: normalized,
      medalCards: buildMedalCards(normalized)
    })
  },

  queueMedalAwards(awarded) {
    if (!awarded || awarded.length === 0) {
      return
    }

    this.pendingMedals = (this.pendingMedals || []).concat(awarded)
    this.showNextMedalAward()
  },

  showNextMedalAward() {
    if (this.data.showMedalAward || !this.pendingMedals || this.pendingMedals.length === 0) {
      return
    }

    const activeMedal = this.pendingMedals.shift()
    this.setData({
      activeMedal,
      showMedalAward: true
    })

    setTimeout(() => {
      this.setData({
        activeMedal: null,
        showMedalAward: false
      })
      this.showNextMedalAward()
    }, MEDAL_DELAY)
  },

  saveLearningProgress(completedLevels) {
    wx.setStorageSync(LEARNING_KEY, completedLevels)
    this.setData({
      completedLevels,
      levelCards: this.createLevelCards(completedLevels),
      learningPassedCount: Object.keys(completedLevels).length
    })
  },

  createLevelCards(completedLevels) {
    const cards = []

    for (let level = 1; level <= TOTAL_LEVELS; level += 1) {
      cards.push({
        level,
        pattern: getLevelPattern(level),
        completed: !!completedLevels[level],
        statusClass: completedLevels[level] ? 'passed' : '',
        stateText: completedLevels[level] ? '已通过' : '未通过'
      })
    }

    return cards
  },

  findNextLearningLevel() {
    for (let level = 1; level <= TOTAL_LEVELS; level += 1) {
      if (!this.data.completedLevels[level]) {
        return level
      }
    }

    return TOTAL_LEVELS
  },

  addHistory(resultText) {
    const history = wx.getStorageSync(STORAGE_KEY) || []
    const record = {
      date: this.formatDate(new Date()),
      mode: this.data.modeLabel,
      attempts: resultText
    }

    wx.setStorageSync(STORAGE_KEY, [record].concat(history))
    this.setData({
      history: [record].concat(history)
    })
  },

  formatDate(date) {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  },

  showMessage(message) {
    if (message === DUPLICATE_MESSAGE) {
      this.setData({ message: DUPLICATE_MESSAGE })
      return
    }

    this.setData({ message })
  }
})

const { exec, cd } = require('shelljs')
const chalk = require('chalk')
const { rimraf } = require('rimraf')
const { join } = require('node:path')

const commands = [
  'watchman watch-del-all',
  'gradlew clean'
  // 'yarn cache clean',
  // 'npm cache clean --force',
  // 'yarn install'
]

const iosCommands = [
  'pod cache clean --all',
  'rm -rf ~/.cocoapods',
  'rm -rf ~/Library/Caches/CocoaPods',
  'rm -rf ~/Library/Developer/Xcode/DerivedData/*',
  'brew update && brew upgrade',
  'pod update',
  'rm -rf $TMPDIR/react-*',
  'rm -rf $TMPDIR/metro-*',
  'rm -rf node_modules',
  'yarn install'
]

;(async () => {
  try {
    const platform = process.env.PLATFORM

    if (platform === 'ios') {
      for (const command of iosCommands) {
        const { stdout } = exec(command)
        console.info(stdout)
      }
      const iosPaths = [
        'build',
        'Pods',
        'Podfile.lock',
        'DerivedData'
      ]
      iosPaths.forEach((p) => rimraf(join('ios', p), { preserveRoot: false }))
      /*
      pod deintegrate
      pod setup
      pod install
      */
      return
    }

    for (const command of commands) {
      if (command.includes('gradlew')) cd('android')
      const { stdout } = exec(command)
      console.info(stdout)
    }

    // inside android
    await rimraf('build', { preserveRoot: false })
    await rimraf('.gradle', { preserveRoot: false })

    const { stderr } = exec('taskkill.exe /F /IM java.exe')
    if (stderr) console.error(stderr)
    // eslint-disable-next-line
    const { stdout: userName } = exec('whoami')
    // await rimraf(`C:\\Users\\${userName.split('\\')[1].trim()}\\.gradle\\.tmp`, { preserveRoot: false, maxRetries: 50, maxBackoff: 20000 })
    // await rimraf(`C:\\Users\\${userName.split('\\')[1].trim()}\\.gradle\\caches`, { preserveRoot: false, maxRetries: 50, maxBackoff: 20000 })
    // await rimraf('node_modules', { preserveRoot: false })

    console.info(chalk.green('Done'))
  } catch (e) {
    console.error(e)
  }
})()

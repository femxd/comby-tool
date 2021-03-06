const program = require('commander')
const inquirer = require('inquirer')
const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

//初始化项目
program
  .command('init')
  .alias('i')
  .description('创建项目')
  .option('--name [name]')
  .option('--librarie [librarie]')
  .action(option => {
    var config = _.assign({
      name: null,
      developer: '',
      librarie: ''
    }, option)
    var promps = []
    //项目名
    if(!config.name) {
      promps.push({
        type: 'input',
        name: 'name',
        message: '请输入项目名',
        validate: function (input){
          if(!input) {
            return '不能为空'
          }
          return true
        }
      })
    }
    //开发者
    if(!config.developer) {
      promps.push({
        type: 'input',
        name: 'developer',
        message: '请输入开发者名称(须与RTX名一致)',
        validate: function (input){
          if(!input) {
            return '不能为空'
          }
          return true
        }
      })
    }
    if(!config.librarie) {
      promps.push({
        type: 'input',
        name: 'librarie',
        message: '请输入第一个组件库名'
      })
    }
    inquirer.prompt(promps).then(function (answer) {
      config = _.assign(config, answer)
      // console.log('answer:', answer)
      //生成组件样式js文件
      try {
        let exists = fsExistsSync('./'+config.name)
        if(exists) {
          console.error(config.name+'生成失败,项目已存在')
        } else {
          funMkdirSync('./'+config.name+'/libraries')
          var baseConfig = fs.readFileSync(path.resolve(__dirname, './tpl/comby.config.js'))
          baseConfig = String(baseConfig)

          if (!!config.librarie) {
            funMkdirSync('./'+config.name+'/libraries/'+config.librarie)
          }
          baseConfig = baseConfig.replace(/\{__librarieName__\}/, config.librarie)
          baseConfig = baseConfig.replace(/\{__developer__\}/, config.developer)
          fs.writeFileSync('./'+config.name+'/comby.config.js', baseConfig)
          console.info(config.name+'项目正常生成')
        }
      } catch(e) {
        console.error('Error ' + answer.name + '项目: ' + e)
      }
    })
  })
  .on('--help', function() {
    console.log('  Examples:')
    console.log('')
    console.log('$ comby init name')
    console.log('$ comby i name')
  })

program
  .command('component')
  .alias('c')
  .description('创建新的组件')
  .option('--name [name]')
  .action(option => {
    var baseConfig = {
      projectPath: process.cwd().replace(/\\/g, '/')
    }
    baseConfig.librariePath = baseConfig.projectPath + '/components'
    let exists = fsExistsSync('./components', fs.constants.F_OK)
    if(!exists) {
      console.info('请在项目内执行此操作')
      return false
    }
    var config = _.assign({
      name: null,
      title: '',
      category: '',
      description: '',
      developer: '',
      designer: '',
      scene: '',
      sass: false
    }, option)
    var promps = []
    //组件名
    if(!config.name) {
      promps.push({
        type: 'input',
        name: 'name',
        message: '请输入组件名',
        validate: function (input){
          if(!input) {
            return '不能为空'
          }
          if(!/^[A-Za-z]/.test(input)) {
            return '组件名必须以字母开头'
          }
          return true
        }
      })
    }
    //组件中文名
    if(!config.title) {
      promps.push({
        type: 'input',
        name: 'title',
        message: '请输入组件中文名',
        validate: function (input){
          if(!input) {
            return '不能为空'
          }
          return true
        }
      })
    }
    //组件类别
    if(!config.category) {
      promps.push({
        type: 'list',
        name: 'category',
        message: '请选择组件类别',
        choices: [
          {
            name: 'General',
            value: 'General'
          },
          {
            name: 'other',
            value: '0'
          }
        ]
      })
    }
    //组件开发者
    if(!config.developer) {
      promps.push({
        type: 'input',
        name: 'developer',
        // default: baseConfig.developer,
        default: 'someone(某人)',
        message: '请输入组件开发者(多人用半角分号;隔开)'
      })
    }
    //组件设计师
    if(!config.designer) {
      promps.push({
        type: 'input',
        name: 'designer',
        default: 'someone(某人)',
        message: '请输入组件设计师(多人用半角分号;隔开)'
      })
    }
    //组件描述
    if(!config.description) {
      promps.push({
        type: 'input',
        name: 'description',
        default: '请填写组件描述',
        message: '请输入组件描述'
      })
    }
    //组件应用场景
    if(!config.scene) {
      promps.push({
        type: 'input',
        name: 'scene',
        default: '请填写组件使用场景',
        message: '请输入组件使用场景'
      })
    }
    //组件是否是无状态组件
    if(!config.modType) {
      promps.push({
        type: 'list',
        name: 'modType',
        message: '请选择组件的类型',
        choices: [
          {
            name: '无状态组件',
            value: 1
          },
          {
            name: '有状态组件',
            value: 2
          }
        ]
      })
    }
    inquirer.prompt(promps).then(function (answer) {
      config = _.assign(config, answer)
      var fStr = config.name.slice(0, 1),
        lStr = config.name.slice(1)
      //组件名 首字母大写
      config.name = fStr.toUpperCase() + lStr
      config.folderName = fStr.toLowerCase() + lStr
      config.className = config.folderName
      //生成markdown需要的开发者列表
      var arrDeveloper = config.developer.split(';')
      config.developer = ''
      for (i in arrDeveloper) {
        if (!!arrDeveloper[i]) {
          config.developer += `\n  - ${arrDeveloper[i]}`
        }
      }
      //生成markdown需要的设计师列表
      var arrDesigner = config.designer.split(';')
      config.designer = ''
      for (i in arrDesigner) {
        if (!!arrDesigner[i]) {
          config.designer += `\n  - ${arrDesigner[i]}`
        }
      }
      // console.log(config)
      //生成组件目录结构
      funMkdirSync(baseConfig.librariePath+'/'+config.folderName+'/style')
      funMkdirSync(baseConfig.librariePath+'/'+config.folderName+'/demo')
      //读取组件相关文件模板
      var modType = config.modType == 1 ? '-stateless' : ''
      var componentJs = fs.readFileSync(path.resolve(__dirname, './tpl/component/index'+modType+'.js')),
        componentMd = fs.readFileSync(path.resolve(__dirname, './tpl/component/index.md')),
        styleJs = fs.readFileSync(path.resolve(__dirname, './tpl/component/style/index.js')),
        styleScss = fs.readFileSync(path.resolve(__dirname, './tpl/component/style/index.scss')),
        demo = fs.readFileSync(path.resolve(__dirname, './tpl/component/demo/demo.md'))
      componentJs = String(componentJs)
      componentMd = String(componentMd)
      demo = String(demo)
      //生成组件js文件
      try {
        let exists = fsExistsSync(baseConfig.librariePath+'/'+config.folderName+'/index.js')
        if(exists) {
          console.info(config.folderName+'/index.js已存在')
        } else {
          componentJs = componentJs.replace(/\{__name__\}/g, config.name).replace(/\{__className__\}/, config.className).replace(/\{__title__\}/, config.title)
          fs.writeFileSync(baseConfig.librariePath+'/'+config.folderName+'/index.js', componentJs)
          console.info(config.folderName+'/index.js正常生成')
        }
      } catch(e) {
        console.error('Error ' + config.folderName + '/index.js: ' + e)
      }
      //生成组件md描述文件
      try {
        let exists = fsExistsSync(baseConfig.librariePath+'/'+config.folderName+'/index.md')
        if(exists) {
          console.info(config.folderName+'/index.md已存在')
        } else {
          componentMd = componentMd.replace(/\{__category__\}/, config.category).replace(/\{__title__\}/, config.title).replace(/\{__developer__\}/, config.developer).replace(/\{__designer__\}/, config.designer).replace(/\{__description__\}/, config.description).replace(/\{__scene__\}/, config.scene)
          fs.writeFileSync(baseConfig.librariePath+'/'+config.folderName+'/index.md', componentMd)
          console.info(config.folderName+'/index.md正常生成')
        }
      } catch(e) {
        console.error('Error ' + config.folderName + '/index.md: ' + e)
      }
      //生成组件样式js文件
      try {
        let exists = fsExistsSync(baseConfig.librariePath+'/'+config.folderName+'/style/index.js')
        if(exists) {
          console.info(config.folderName+'/style/index.js已存在')
        } else {
          fs.writeFileSync(baseConfig.librariePath+'/'+config.folderName+'/style/index.js', styleJs)
          console.info(config.folderName+'/style/index.js正常生成')
        }
      } catch(e) {
        console.error('Error ' + config.folderName + '/style/index.js: ' + e)
      }
      //生成组件样式scss文件
      try {
        let exists = fsExistsSync(baseConfig.librariePath+'/'+config.folderName+'/style/index.scss')
        if(exists) {
          console.info(config.folderName+'/style/index.scss已存在')
        } else {
          fs.writeFileSync(baseConfig.librariePath+'/'+config.folderName+'/style/index.scss', styleScss)
          console.info(config.folderName+'/style/index.scss正常生成')
        }
      } catch(e) {
        console.error('Error ' + config.folderName + '/style/index.scss: ' + e)
      }
      //生成组件示例demo.md
      try {
        var exists = fsExistsSync(baseConfig.librariePath+'/'+config.folderName+'/demo/demo.md')
        if(exists) {
          console.info(config.folderName+'/demo/demo.md已存在')
        } else {
          demo = demo.replace(/\{__name__\}/g, config.name)
          fs.writeFileSync(baseConfig.librariePath+'/'+config.folderName+'/demo/demo.md', demo)
          console.info(config.folderName+'/demo/demo.md正常生成')
        }
      } catch(e) {
        console.error('Error ' + config.folderName + '/demo/demo.md: ' + e)
      }
    })
  })
  .on('--help', function() {
    console.log('  Examples:')
    console.log('')
    console.log('$ app component componentName')
    console.log('$ app c componentName')
  })


program.parse(process.argv)


//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try{
        fs.accessSync(path, fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

//使用时第二个参数可以忽略  
function funMkdirSync(dirpath,dirname){
  //判断是否是第一次调用  
  if(typeof dirname === "undefined"){
    if(fsExistsSync(dirpath)){
      return;
    }else{
      funMkdirSync(dirpath,path.dirname(dirpath));
    }
  }else{
    //判断第二个参数是否正常，避免调用时传入错误参数
    if(dirname !== path.dirname(dirpath)){
      funMkdirSync(dirpath);
      return;
    }
    if(fsExistsSync(dirname)){
      fs.mkdirSync(dirpath)
    }else{
      funMkdirSync(dirname,path.dirname(dirname));
      fs.mkdirSync(dirpath);
    }
  }
}
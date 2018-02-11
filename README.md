# 使用 Vue + LeanCloud 的周报系统

[![GitHub issues](https://img.shields.io/github/issues/cdswyda/weekly-report.svg)](https://github.com/cdswyda/weekly-report/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/cdswyda/weekly-report.svg)](https://github.com/cdswyda/weekly-report/pulls)
[![GitHub forks](https://img.shields.io/github/forks/cdswyda/weekly-report.svg)](https://github.com/cdswyda/weekly-report/network)
[![GitHub stars](https://img.shields.io/github/stars/cdswyda/weekly-report.svg)](https://github.com/cdswyda/weekly-report/stargazers)
[![GitHub license](https://img.shields.io/github/license/cdswyda/weekly-report.svg)](https://github.com/cdswyda/weekly-report/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/cdswyda/weekly-report.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fcdswyda%2Fweekly-report)

使用 Vue + LeanCloud 开发的一个周报系统，纯前端实现。

并利用 LeanCloud 提供的云引擎服务实现在周五给全员发送邮件提醒填写周报，周六周日分别再次对未填人员发送邮件进行填写提醒。

## 基本配置

**LeanCloud 应用配置**

前往 [LeanCloud](https://leancloud.cn/) 新增应用。 并导入 `/appSchema/` 下的 schema

修改 `src/config/av.config-example.js` 文件，填入 LeanCloud 应用的 **App ID** 和 **App key**。

此 `id` 和 `key` 可以从 [LeanCloud](https://leancloud.cn/)  `要关联的应用 => 设置 => 应用 Key` 中获取。

```js
// 填写配置后重命名此文件为av.config.js
export default {
  id: '填写LeanCloud应用的ID',
  key: '填写LeanCloud应用的Key'
}
```

**周报配置**

可以从 `src/config/input.config.js` 和  `src/config/group.config.js` 中配置周报填写的类型、说明以及小组配置，格式相应参见文件即可。

- `input.config.js` 中的配置信息，用于配置输入页面中存在的不同类型和相对应的提示，以及每周的基础工时、计算为任务饱和度的关联任务等。

- `group.config.js` 中配置的小组信息，将在首个成员注册时自动写入到 LeanClound 应用中。

> 规划时，计算任务饱和度是单独配置的，但实际开发中，这块耦合住了，在考虑优化掉，做成一个通用的产品，如果你有任何想法，可以联系我，谢谢。

**发送邮件配置**

修改 `mail/mailer-example.php` 文件，配置完成后重命名为 `mailer.php` 即可

```php
public static $HOST = 'smtp.163.com'; // 邮箱的服务器地址
public static $PORT = 465; // smtp 服务器的远程服务器端口号
public static $SMTP = 'ssl'; // 使用 ssl 加密方式登录
public static $CHARSET = 'UTF-8'; // 设置发送的邮件的编码

/**
 * 配置此处信息后将此文件重命名为mailer.php即可
 */
private static $USERNAME = '配置用户'; // 授权登录的账号
private static $PASSWORD = '配置授权密码'; // 授权登录的密码
private static $NICKNAME = '新点前端周报'; // 发件人的昵称
```

无需邮件服务器，直接使用各个邮箱的 SMTP 服务即可完成。

这里发送邮件的实现是使用了 [PHPMailer](https://github.com/PHPMailer/PHPMailer) 简单包装来实现的。

注：

- 不要使用 QQ 邮箱的 SMTP ，我在使用中，团队30+人， 单独发送到10+后，之后的都失败了，提醒发送邮件过快。使用163邮箱的暂无问题。
- why php?
  - 因为目前没在服务器上装有nodejs。
  - 虽然 LeanCloud 提供的免费云引擎，本身就支持nodejs服务，但是免费版是做测试用的，会自动休眠，不够稳定，经常挂掉。
  - 若使用nodejs，可使用 [nodemailer](https://github.com/nodemailer/nodemailer) 来发送邮件。

以上展示了配置发送邮件的功能，还需要定时查找用户或未提交的用户来发送邮件。

此处使用了 LeanCloud 提供的云引擎中的定时任务来实现。

1. 定义云函数，以便发送邮件。实现可参考 [weeklyReportSendEmail](https://github.com/cdswyda/weeklyReportSendEmail)
2. 在 LeanCloud 的应用中 点击 `云引擎 => 定时任务` 来创建定时任务，定时执行发送邮件。

![http://qiniu.cdswyda.com/images/201802/timing-task.png](http://qiniu.cdswyda.com/images/201802/timing-task.png)

相关文档可参考 [LeanCloud 开发指南](https://leancloud.cn/docs/leanengine_cloudfunction_guide-node.html)

## 构建使用步骤

此项目直接使用 **Vue-cli** 工具初始化，配置进行了略微修改，相关命令如下：

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8086
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

关于打包后的部署使用，请根据要放的目录，自行调整 `/config/index.js` 中的
`assetsPublicPath` 路径，并将打包生成的文件（默认在 `/dist/` 下）全部拷贝到你指定目录下即可。

```js
// 例如：这里最后期望通过访问 域名/weeklyreport/ 访问此周报系统，则配置为/weeklyreport/即可
assetsPublicPath: '/weeklyreport/',
```

## 效果展示

填写

![填写 https://qiniu.cdswyda.com/images/201802/input-show.gif](https://qiniu.cdswyda.com/images/201802/input-show.gif)

汇总展示

![汇总展示 https://qiniu.cdswyda.com/images/201802/summary.png](https://qiniu.cdswyda.com/images/201802/summary.png)

只想看你关心的？这里有！

![只想看你关心的？这里有！](https://qiniu.cdswyda.com/images/201802/person-select.png)

汇总图表

![汇总图表 https://qiniu.cdswyda.com/images/201802/summary-echarts.png](https://qiniu.cdswyda.com/images/201802/summary-echarts.png)

还支持任意时段的历史查看，下方表格和图标的展示同周汇总。

![任意时间段汇总 https://qiniu.cdswyda.com/images/201802/summary-all.png](https://qiniu.cdswyda.com/images/201802/summary-all.png)

个人信息维护

![个人信息维护 https://qiniu.cdswyda.com/images/201802/person-info.png](https://qiniu.cdswyda.com/images/201802/person-info.png)

管理员对成员查看和管理

![管理员对成员查看和管理 https://qiniu.cdswyda.com/images/201802/person-manage.png](https://qiniu.cdswyda.com/images/201802/person-manage.png)

对了，还可以导出表格为csv

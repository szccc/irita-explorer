/*模块功能映射id{
    "100":"区块浏览",
    "101":"交易浏览",
    "102":"共识节点",
    "103":"数据对象",
    "104":"数据类别",
    "105":"服务浏览",
    "106":"身份ID",
    "107":"Vaildators",
    "108":"Delegation Txs",
    "109":"Validation Txs",
    "110":"Native Asset",
    "111":"Native Asset Txs",
    "112":"Parameters",
    "113":"Proposals",
    "114":"Gov Txs",
    "1000":"搜索"(排在末尾)
    "1001":"网络切换"(排在末尾)}*/

/*首页指标映射id{
    "200":"最新区块"(排在首位),
    "201":"交易数量",
    "202":"共识节点数",
    "203":"平均出块时间",
    "204":"数据对象数量",
    "205":"数据类别数量",
    "206":"服务数量",
    "207":"身份ID数量",
    "208":"验证人数量",
    "209":"质押率",
*/

let config = {
  //国际化 CN / EN 默认CN
  lang: 'CN',
  //浏览器标签标题 必填
  title: 'CSChain Explorer',
  //主题色 作用于非直接干预的文字、背景、边框颜色(如输入框边框高亮、首页卡片图标等) 优先级较低
  themeColor: '',
  logo: {
    //logo标题 必填
    title: 'CSChain-Bond',
    //logo副标题 必填
    subTitle: '债券应用链浏览器',
  },
  nav: {
    //nav文字颜色
    color: '',
    //nav文字高亮颜色
    activeTextColor: '',
    //nav背景颜色 上半部分
    bgColor: '',
  },
  footer: {
    //页脚文字背景颜色
    color: '',
    //页脚背景颜色 上半部分
    bgColor_top: '',
    //页脚背景颜色 下半部分
    bgColor_bottom: '',
    //页脚版权信息   必填
    copyright: 'copyright © 2020 边界智能',
    chainIdShow: true,
    versionShow: true,
    //页脚右侧是否显示跳转链接
    linkShow: true,
  },
  //导航栏功能列表 详见 导航栏功能映射 注：title为配置文案暂不支持国际化
  navFuncList: [
    { title: '区块浏览', id: '100' },
    { title: '交易浏览', id: '101' },
    { title: '共识节点', id: '102' },
    {
      title: '数据对象',
      children: [
        { title: '数据对象', id: '103' },
        { title: '数据类型', id: '104' },
      ],
    },
    { title: '服务浏览', id: '105' },
    { title: '身份ID', id: '106' },
    {
      title: 'Staking',
      children: [
        { title: 'Vaildators', id: '107' },
        { title: 'Delegation Txs', id: '108' },
        { title: 'Validation Txs', id: '109' },
      ],
    },
    {
      title: 'Asset',
      children: [
        { title: 'Native Asset', id: '110' },
        { title: 'Native Asset Txs', id: '111' },
      ],
    },
    {
      title: 'Gov',
      children: [
        { title: 'Proposals', id: '112' },
        { title: 'Gov Txs', id: '113' },
      ],
    },
    '1000',
    '1001',
  ],
  //首页卡片配置
  homeCard:[200,201,202,203,204,205,206,207,208,209],
  text: {
    //预设字体颜色
    color: {
      //一级文字色
      first: '',
      //二级文字色
      second: '',
      //三级文字色
      third: '',
      //四级文字色
      fourth: '',
      //链接文字色
      link: '',
    },
  },
  button: {
    //预设按钮字体颜色
    color: {
      common: '',
    },
    //预设按钮背景颜色
    bgColor: {
      common: '',
    },
  }
}
module.exports = config

const input = `
            <outline text="iDaily · 每日环球视野" title="iDaily · 每日环球视野" type="rss" xmlUrl="https://plink.anyfeeder.com/idaily/today"/>
            <outline text="澎湃新闻 - 首页头条" title="澎湃新闻 - 首页头条" type="rss" xmlUrl="https://plink.anyfeeder.com/thepaper"/>
            <outline text="经济日报" title="经济日报" type="rss" xmlUrl="https://feedx.run/rss/jingjiribao.xml"/>
            <outline text="人民日报" title="人民日报" type="rss" xmlUrl="https://feedx.run/rss/people.xml"/>
            <outline text="Product Hunt Today Popular" title="Product Hunt Today Popular" type="rss" xmlUrl="https://rsshub.app/producthunt/today"/>
            <outline text="36氪" title="36氪" type="rss" xmlUrl="http://www.36kr.com/feed"/>
            <outline text="InfoQ 推荐" title="InfoQ 推荐" type="rss" xmlUrl="https://plink.anyfeeder.com/infoq/recommend"/>
            <outline text="中国政府网 - 最新政策" title="中国政府网 - 最新政策" type="rss" xmlUrl="https://rsshub.app/gov/zhengce/zuixin"/>
        <outline text="阮一峰的网络日志" title="阮一峰的网络日志" type="rss" xmlUrl="http://www.ruanyifeng.com/blog/atom.xml"/>
        <outline text="云风的 BLOG" title="云风的 BLOG" type="rss" xmlUrl="http://blog.codingnow.com/atom.xml"/>
        <outline text="HelloGitHub 月刊" title="HelloGitHub 月刊" type="rss" xmlUrl="http://hellogithub.com/rss"/>

        <outline text="介绍 on SuperTechFans" title="介绍 on SuperTechFans" type="rss" xmlUrl="https://www.supertechfans.com/cn/index.xml"/>
        <outline text="美团技术团队" title="美团技术团队" type="rss" xmlUrl="https://tech.meituan.com/feed/"/>
        <outline text="V2EX" title="V2EX" type="rss" xmlUrl="https://v2ex.com/index.xml"/>
        <outline text="虎嗅网" title="虎嗅网" type="rss" xmlUrl="https://www.huxiu.com/rss/0.xml"/>
        <outline text="少数派 -- Matrix" title="少数派 -- Matrix" type="rss" xmlUrl="https://plink.anyfeeder.com/ssapi/matrix"/>
        <outline text="上海书评" title="上海书评" type="rss" xmlUrl="https://feedx.run/rss/shanghaishuping.xml"/>
        <outline text="FreeFrontend" title="FreeFrontend" type="rss" xmlUrl="https://freefrontend.com/index.xml"/>
        <outline text="奇客Solidot–传递最新科技情报" title="奇客Solidot–传递最新科技情报" type="rss" xmlUrl="https://www.solidot.org/index.rss"/>`;
const regex = /xmlUrl="([^"]+)"/g;
let match;
const xmlUrls = [];

while ((match = regex.exec(input)) !== null) {
  xmlUrls.push(match[1]);
}

console.log(xmlUrls);

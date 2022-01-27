
export default `<!DOCTYPE html>
<html lang=en>
<head>
    <meta charset=utf-8>
    <meta name=viewport content="width=device-width, initial-scale=1.0">
    <title>HN User Data Export for {{=it.user.id}}</title>
    <style>
        body{font-family:Verdana,Geneva,sans-serif;font-size:10pt;margin:8px 8px 25px}body > table{width:85%;min-width:796px;border-spacing:0;padding:0 0 0 1px;margin-left:auto;margin-right:auto;background:#f6f6ef}table.heading{width:100%;background:#f60}.logo{width:18px;padding-right:4px}.logo a{width:18px;height:18px;display:block;border:1px solid #fff;color:#fff;text-align:center}td{font-family:Verdana,Geneva,sans-serif;font-size:10pt;padding:0}a{color:#000;text-decoration:none}.subtext{font-family:Verdana,Geneva,sans-serif;font-size:7pt;color:#828282;padding-bottom:8px}.subtext a{color:#828282}a:visited{color:#828282;text-decoration:none}.profileform{margin-top:10px;color:#828282;line-height:18px}.rank{width:27px}.rank span{padding-left:7px;color:#828282}.hnmore a:link,a:visited{color:#828282}table:not(:first-child){margin-top:25px;border-top:2px solid #f60;padding:10px 0 0}.date{text-align:right;padding-right:4px}.title > a{color:#000;margin-bottom:2px}.comhead{font-family:Verdana,Geneva,sans-serif;font-size:8pt;color:#828282}.comhead a{color:#828282}.votelinks{color:#f60;padding-left:7px;padding-right:5px;top:-1px;position:relative;vertical-align:top}.comment{font-family:Verdana,Geneva,sans-serif;font-size:9pt;overflow-wrap:anywhere;padding-right:10px}.default{padding-bottom:15px}.default > div:first-child{margin:-2px 0 -10px}.default p{margin:8px 0 0}@media only screen and (max-width:750px){body{padding:0;margin:0;width:100%;-webkit-text-size-adjust:none}body > table{width:100%;min-width:0}td{height:inherit!important}.rank{width:30px}.title{font-size:11pt;line-height:14pt;padding:0 16px 0 2px}.subtext{font-size:9pt}.votelinks{width:18px;padding:0 0 0 10px}.votelinks a{display:block;margin-bottom:9px}}
    </style>
</head>
<body>
    <table>
            <tr>
                <td>
                    <table class=heading>
                        <tbody>
                            <tr>
                                <td class=logo>
                                    <a>🠋</a>
                                </td>
                                <td>
                                    <b>HN User Data Export</b>
                                </td>
                                <td class="date">
                                    created on <b>{{=new Date().toLocaleString()}}</b>
                                </td>
                    </table>
            </tr>
            <tr>
                <td>
                    <table class=profileform>
                        <tr>
                            <td>user:</td>
                            <td>{{=it.user.id}}</td>
                        </tr>
                        <tr>
                            <td>created:</td>
                            <td>{{=new Date(it.user.created * 1000).toLocaleString()}}</td>
                        </tr>
                        <tr>
                            <td>karma:</td>
                            <td>{{=it.user.karma}}</td>
                        </tr>
                        <tr>
                            <td>about:</td>
                            <td>{{=it.user.about || ''}}</td>
                        </tr>
                    </table>
            </tr>
    </table>

    {{?it.story && it.story.length}}
        <table>
            {{~it.story :storyItem:index}}
            <tr>
                <td>
                    <tr>
                        <td class="rank">
                            <span>{{=index + 1}}.</span>
                        </td>
                         <td class="title">
                            <a href="{{=storyItem.url || 'https://news.ycombinator.com/item?id=' + storyItem.id}}">{{=storyItem.title}}</a>
                             {{?storyItem.url}}
                             <span class="comhead"> (<a href="{{=storyItem.url}}"><span class="sitestr">{{=(new URL(storyItem.url)).hostname.replace('www.', '')}}</span></a>)</span>
                             {{?}}
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="subtext">
                            <span>{{=storyItem.score}} points</span> by <a href="https://news.ycombinator.com/user?id={{=it.user.id}}">{{=it.user.id}}</a> <span class="age" title="{{=new Date(storyItem.time * 1000).toLocaleString()}}"><a href="https://news.ycombinator.com/item?id={{=storyItem.id}}">{{=new Date(storyItem.time * 1000).toLocaleString()}}</a></span> {{?storyItem.descendants > 0}}|  <a href="https://news.ycombinator.com/item?id=28886636">{{=storyItem.descendants}}&nbsp;comments</a>{{?}}
                        </td>
                    </tr>
            {{~}}
        </table>
    {{?}}

    {{?it.comment && it.comment.length }}
        <table>
            {{~it.comment :commentItem}}
                <tr>
                    <td>
                        <table>
                            <tr>
                                <td>
                                    <tr>
                                        <td class="votelinks">
                                            *
                                        </td>
                                        <td class="default">
                                            <div>
                                                <span class="comhead">
                                                    by <a href="https://news.ycombinator.com/user?id={{=it.user.id}}">{{=it.user.id}}</a> <span class="age" title="{{=new Date(commentItem.time * 1000).toLocaleString()}}"><a href="https://news.ycombinator.com/item?id={{=commentItem.id}}">{{=new Date(commentItem.time * 1000).toLocaleString()}}</a></span> {{?commentItem.parent }}<span class="par"> | <a href="https://news.ycombinator.com/item?id={{=commentItem.parent.id}}">parent</a></span>{{?}}
                                                    {{?commentItem.parent && commentItem.parent.type === 'story'}}
                                                    <span class="storyon"> | on: <a href="https://news.ycombinator.com/item?id={{=commentItem.parent.id}}">{{=commentItem.parent.title}}</a></span>
                                                    {{?}}
                                                </span>
                                            </div>
                                            <br>
                                            <div class="comment">
                                                  {{=commentItem.text}}
                                            </div>
                                        </td>
                                    </tr>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            {{~}}
        </table>
    {{?}}
</body>
</html>
`

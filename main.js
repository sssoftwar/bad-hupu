// ==UserScript==
// @name         烂虎扑屏蔽器
// @namespace    sssoftwar
// @version      0.6
// @description  可以屏蔽虎扑坏帖和你不想看到的内容
// @author       sssoftwar
// @license      Apache Licence 2.0
// @match        https://bbs.hupu.com/*
// @icon         https://bkimg.cdn.bcebos.com/pic/adaf2edda3cc7cd98d1095b4f549363fb80e7bec3b0f?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5/format,f_auto
// @grant        unSafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_listValues
// @grant        GM_deleteValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js
// ==/UserScript==

(function() {
    'use strict';
    /*
     * 用于调试用户引导及banKeyword初始化
    GM_deleteValue('firstTime')
    GM_deleteValue('banKeyword')
    */
    $("head").append($(`<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">`));
    $("head").append($(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">`));
    $("head").append($(`<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`));
    // 添加右下角fab
    $("body").append($(`<div class="fixed-action-btn">
  <a id="fab" class="btn-floating btn-large white">
    <i class="red-text large material-icons">lightbulb_outline</i>
  </a>
  <ul>
    <li><a class="btn-floating white tooltipped" data-tooltip="暂无功能"><i class="red-text material-icons">mode_edit</i></a></li>
    <li id='showBanList'><a class="btn-floating white tooltipped" data-tooltip="屏蔽词"><i class="red-text material-icons">reorder</i></a></li>
  </ul>
</div>
`));
    // 添加屏蔽词的chips
    $("body").append($(`<div id="keywordList" class="card-panel green" style="background:grey;display:none; z-index:999;text-align:center;width: 80vh;height: 20vh;position: fixed;left: 0;top: 0;bottom: 0;right: 0;margin: auto;">
    <div class="chips chips-placeholder chips-initial"></div>
    </div>`));
    // 添加个click事件，用于判断是否点击在chips组件之外
    $('#container').click(function(){
        $('#keywordList').fadeOut(500)
    })
    // md组件的各种初始化
    // fab初始化
    var fixedActionBtnElems = document.querySelectorAll('.fixed-action-btn');
    var fixedActionBtnOptions = {
        direction: 'left'
    }
    var instances = M.FloatingActionButton.init(fixedActionBtnElems, fixedActionBtnOptions);
    // tooltipped初始化
    var tooltippedElems = document.querySelectorAll('.tooltipped');
    var tooltippedOptions = {
        enterDelay: 200,
        exitDelay: 0,
        inDuration: 200,
        outDuration: 200,
        position: 'top',
        transitionMovement: 10
    }
    var tooltippedInstances = M.Tooltip.init(tooltippedElems, tooltippedOptions);

    // 添加新用户引导
    function addFeatureDiscovery(count) {
    $('body').append($(`<div class="tap-target" data-target="fab">
    <div class="tap-target-content">
      <h5 style="color:white">自定义设置</h5><br/>
      <p style="color:white">在这里进行自定义配置</p><br/>
      <p style="color:white">此新用户引导只显示3次，这是第`+count+`次</p>
    </div>
  </div>`))

    // FeatureDiscovery初始化
    //$('.tap-target').tapTarget()
    var tapTargetElems = document.querySelectorAll('.tap-target')
    var tapTargetOptions = {
        function() {console.log('open')},
        function(){console.log('close')}
    }
    var tapTargetInstances = M.TapTarget.init(tapTargetElems, tapTargetOptions)
    //console.log(tapTargetInstances)
    //console.log(tapTargetInstances[0])
        $('.tap-target').tapTarget('open')
    }

        var link = ''
        var links = []
        $('[href$=".html"]').each(function(){
            link = 'https://bbs.hupu.com'+$(this).attr('href')
            links.push(link)
        })
//        console.log(links)
        var badLinkCount = 0

        for(var i = 0; i < links.length; i++){
            $.ajax({url: links[i],async:true,success:function(result){
                // 如果楼主是关键字包含的
                var banKeyword = GM_getValue('banKeyword')
                for(var ii = 0; ii < banKeyword.length; ii++)
                {
                    var key = 'class="post-user-comp-info-top-name">' + banKeyword[ii]
                    var reg = new RegExp(key)
                    if(reg.test(result))
                    {
                        var linkSuffix = $(this)[0].url.match(/\d+/)[0]
                        var badLink = "[href=\"/" + linkSuffix + ".html\"]"
                        console.log("楼主坏帖子：" + badLink)
                        console.log(key)
                        badLinkCount++
                        GM_log(badLinkCount)
                        break
                    }
                }
                if(/您无法访问该帖子/.test(result)||/您访问的帖子不存在/.test(result)) {
                    badLinkCount++
                    GM_log(badLinkCount)
                    var linkSuffix = $(this)[0].url.match(/\d+/)[0]
                    var badLink = "[href=\"/" + linkSuffix + ".html\"]"
                    console.log("坏帖子：" + badLink)
//                    GM_log($(badLink).parent().parent()[0].className)

                    if (/bbs-sl-web-post-body/.test($(badLink).parent().parent()[0].className)){
//                        console.log($(badLink).parent().parent())
                        // 不需要看屏蔽效果反馈，就这样
                        //$(badLink).parent().parent().css({'background-color':'yellow','color':'grey'}).remove()
                        // 想看屏蔽效果，就这样
                        $(badLink).parent().parent().css({'background-color':'#81c784','color':'grey'}).fadeOut(500)
                    }
                    // “步行街热帖”的操作
                    else if(/list-item-wrap/.test($(badLink).parent().parent().parent()[0].className) || /list-item-wrap/.test($(badLink).parent().parent().parent()[1].className)) {
//                        GM_log('长度：' + $(badLink).parent().parent().parent().length)
                        if($(badLink).parent().parent().parent().length == 1) {
                            //console.log($(badLink).parent().parent().parent())
                            $(badLink).parent().parent().parent().css({'background-color':'#81c784','color':'grey'}).fadeOut(500)
                        }
                        else {
//                            GM_log('右边也有')
                            // 先把主列表中的坏链接处理了
//                            console.log($(badLink).parent().parent().parent()[1].className)
                            if($(badLink).parent().parent().parent()[1].className === 'list-item-wrap') {
//                                console.log('主列表：')
//                                console.log($($(badLink).parent().parent().parent()[1]))
                                $($(badLink).parent().parent().parent()[1]).css({'background-color':'#81c784','color':'grey'}).fadeOut(500)
                                }
//                            console.log('右侧className：')
//                            console.log($(badLink).children()[1].className)
                            // 再把右边列表中的坏链接处理了
                            if($(badLink).children()[1].className === 'right-post-item') {
                                $(badLink).children().css({'background-color':'#81c784','color':'grey'}).fadeOut(500)
                                //GM_log($(badLink).children())
                            }
                        }
                    }
                    // 正常来说不会出现此情况
                    else {
                        $(badLink).css({'background-color':'red','color':'grey'}).fadeOut(500)
                    }

                }
                else
                    console.log(i + ' 或许是正经帖子')

            }})
        }

    // 显示屏蔽关键字列表（设置过多关键字会导致显示有点不和谐，待修复）
    function getBanKeyword() {
        // 挂载需要填入数据并设置可见性为true
        if($('#keywordList').length != 0) {
            var elems = document.querySelectorAll('.chips')
            var banKeyword = GM_getValue('banKeyword')
            var keywordList = []
            banKeyword.forEach(function(e){
                var tag = e
                var obj = {}
                obj.tag = tag
                keywordList.push(obj)
            })
            var options = {
                data: keywordList,
                placeholder: '添加一个屏蔽词',
                secondaryPlaceholder: '继续添加',
                onChipAdd: function(){
                    saveChipsData()
                },
                onChipDelete: function(){
                    saveChipsData()
                },
            }
            var instances = M.Chips.init(elems, options)
            alterChipsCardSize(banKeyword.length)
        }
    }
    // 根据chips数量来改变该card-panel的大小
    function alterChipsCardSize(length) {
        var height = (parseInt(length / 4) + 1) * 32 + 120
        height += 'px'
        console.log('height:' + height)
        $('#keywordList').css({'display':'inline','height': height})
    }
    // 用于chips触发“添加”和“删除”事件后保存数据
    function saveChipsData() {
        var data = M.Chips.getInstance($('.chips')).chipsData
        var banKeyword = []
        data.forEach(function(e){
            var keyword = e.tag
            banKeyword.push(keyword)
        })
        GM_log(banKeyword)
        alterChipsCardSize(banKeyword.length)
        // 将数据存储起来
        GM_setValue('banKeyword', banKeyword)
    }
    $(document).ready(function() {
        console.log(GM_listValues())
        // 如果是第一次使用该脚本，需要初始化banKeyword，并且显示FeatureDiscovery（新用户引导）
        if(GM_getValue('firstTime') == null) {
            GM_setValue('banKeyword', [])
            GM_setValue('firstTime', 1)
//            GM_log('第' + GM_getValue('firstTime') + '次：')
            setTimeout(function(){
                addFeatureDiscovery(1)},1000)
//            console.log(GM_getValue('banKeyword'))
        }
        else if(GM_getValue('firstTime') < 3) {
            var count = GM_getValue('firstTime')
            count ++
            setTimeout(function(){
                addFeatureDiscovery(count)
            },1000)
            GM_setValue('firstTime', count)
//            GM_log('这是第' + GM_getValue('firstTime') + '次')
//            console.log(GM_getValue('banKeyword'))
        }
//        else {
//            GM_log('已非新手指引阶段')
//            console.log(GM_getValue('banKeyword'))
//        }
        // 根据关键字进行屏蔽
        var banKeyword = GM_getValue('banKeyword')
        $('#showBanList').click(function(){
            getBanKeyword()
        })
        var keywordCount = 0;
        for(var j = 0; j < banKeyword.length; j++){
            keywordCount += $('li:contains(' + banKeyword[j] + ')').length
            keywordCount += $('.list-item-wrap:contains(' + banKeyword[j] + ')').length
            keywordCount += $('.right-post-item:contains(' + banKeyword[j] + ')').length
            console.log('关键字屏蔽数量：' + keywordCount)
          $('li:contains(' + banKeyword[j] + ')').css({'background-color':'#81c784','color':'grey'}).fadeOut(500)
          $('.list-item-wrap:contains(' + banKeyword[j] + ')').css({'background-color':'#81c784','color':'grey'}).fadeOut(500)
          $('.right-post-item:contains(' + banKeyword[j] + ')').css({'background-color':'#81c784','color':'grey'}).fadeOut(500)
        }
        // 提示屏蔽的帖子数量
        /* 不要提示了，win10很烦
        setTimeout(function(){
            var banCount = badLinkCount + keywordCount
            var message = '已屏蔽' + banCount + '条烂虎扑'
            GM_notification({
                title: '虎扑屏蔽器',
                image: 'https://bkimg.cdn.bcebos.com/pic/adaf2edda3cc7cd98d1095b4f549363fb80e7bec3b0f?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5/format,f_auto',
                text: message,
                timeout: 5000,
                //highlight: true,
                ondone: function(){GM_log('done')},
                onclick: function(){GM_log('click')},
            })
        }, 500)
*/
        // 屏蔽虎扑游戏
        for(var ii = 0; ii<$('.right-post-title').length;ii++){
            //if($('.right-post-title')[ii].innerHTML=='热门游戏-即点即玩')
                //$('.right-post-title')[ii].parentElement.innerHTML=''
               // $('.right-post-title').empty()
        }
        $('.game-center-sidebar').remove()
        $('.game-center-entrance-container-title').remove()
        $('#game-center-entrance-container').remove()
        var index = $(':contains("热门游戏-即点即玩")').length - 2
        console.log($(':contains("热门游戏-即点即玩")')[index].innerHTML='')

    })
})();

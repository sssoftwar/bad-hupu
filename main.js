// ==UserScript==
// @name         烂虎扑屏蔽器
// @namespace    sssoftwar
// @version      0.2
// @description  可以屏蔽虎扑坏帖和你不想看到的内容
// @author       sssoftwar
// @license      Apache Licence 2.0
// @match        https://*.hupu.com/*
// @icon         https://bkimg.cdn.bcebos.com/pic/adaf2edda3cc7cd98d1095b4f549363fb80e7bec3b0f?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5/format,f_auto
// @grant        unSafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js
// ==/UserScript==

(function() {
    'use strict';
    $("head").append($(`<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">`));
    $("head").append($(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">`));
    $("head").append($(`<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`));
    $("body").append($(`<div class="fixed-action-btn">
  <a class="btn-floating btn-large white">
    <i class="red-text large material-icons">lightbulb_outline</i>
  </a>
  <ul>
    <li><a class="btn-floating white"><i class="red-text material-icons">mode_edit</i></a></li>
    <li id='showBanList'><a class="btn-floating white tooltipped"><i class="red-text material-icons">reorder</i></a></li>
  </ul>
</div>`));
    $("body").append($(`<div id="keywordList" class="card-panel green" style="background:grey;display:none; z-index:999;text-align:center;width: 40vh;height: 20vh;position: fixed;left: 0;top: 0;bottom: 0;right: 0;margin: auto;">
    <div class="chips chips-placeholder chips-initial"></div>
    </div>`));
    // 添加个click事件，用于判断是否点击在chips组件之外
    $('#container').click(function(){
        $('#keywordList').fadeOut(500)
    })
    const FUCK = 'fuck'
    GM_log(GM_getValue(FUCK))
    var fixedActionBtnElems = document.querySelectorAll('.fixed-action-btn');
    var fixedActionBtnOptions = {
        direction: 'left'
    }
    var instances = M.FloatingActionButton.init(fixedActionBtnElems, fixedActionBtnOptions);
    var tooltippedElems = document.querySelectorAll('.tooltipped');
    var tooltippedOptions = {
        enterDelay: 200,
        exitDelay: 0,
        inDuration: 200,
        outDuration: 200,
        position: 'top',
        html: '屏蔽词',
        transitionMovement: 10
    }
    var tooltippedInstances = M.Tooltip.init(tooltippedElems, tooltippedOptions);
    GM_log($('.fixed-action-btn'))
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
                if(/您无法访问该帖子/.test(result)||/您访问的帖子不存在/.test(result)) {
                    badLinkCount++
                    GM_log(badLinkCount)
                    var linkSuffix = $(this)[0].url.match(/\d+/)[0]
                    var badLink = "[href=\"/" + linkSuffix + ".html\"]"
                    console.log("坏帖子：" + badLink)
                    GM_log($(badLink).parent().parent()[0].className)

                    if (/bbs-sl-web-post-body/.test($(badLink).parent().parent()[0].className)){
//                        console.log($(badLink).parent().parent())
                        // 不需要看屏蔽效果反馈，就这样
                        //$(badLink).parent().parent().css({'background-color':'yellow','color':'grey'}).remove()
                        // 想看屏蔽效果，就这样
                        $(badLink).parent().parent().css({'background-color':'yellow','color':'grey'}).fadeOut(4000)
                    }
                    // “步行街热帖”的操作
                    else if(/list-item-wrap/.test($(badLink).parent().parent().parent()[0].className) || /list-item-wrap/.test($(badLink).parent().parent().parent()[1].className)) {
                        GM_log('长度：' + $(badLink).parent().parent().parent().length)
                        GM_log($(badLink).parent().parent().parent(0))
                        if($(badLink).parent().parent().parent().length == 1) {
//                        console.log($(badLink).parent().parent().parent())
                        // 不需要看屏蔽效果反馈，就这样
                        //$(badLink).parent().parent().parent().css({'background-color':'yellow','color':'grey'}).remove()
                        // 想看屏蔽效果，就这样
                        // 这里不知道怎么回事有时候要三个parent有时候要两个，不然就跟else if合并了，持续观察中..
                        $(badLink).parent().parent().parent(0).css({'background-color':'brown','color':'grey'}).fadeOut(4000)
                        }
                        else {
                            GM_log('右边也有')
                            // 先把主列表中的坏链接处理了
//                            console.log($(badLink).parent().parent().parent()[1].className)
                            if($(badLink).parent().parent().parent()[1].className === 'list-item-wrap')
                                $(badLink).parent().parent().parent(1).css({'background-color':'orange','color':'grey'}).fadeOut(4000)
                            console.log($(badLink).children()[1].className)
                            // 再把右边列表中的坏链接处理了
                            if($(badLink).children()[1].className === 'right-post-item') {
                                $(badLink).children().css({'background-color':'green','color':'grey'}).fadeOut(4000)
                                GM_log($(badLink).children())
                            }
                        }
                    }
                    else {
                        $(badLink).css({'background-color':'red','color':'grey'}).fadeOut(4000)
                    }

                }
                else
                    console.log(i + ' 或许是正经帖子')
            }})
        }

    // 可以添加关键字来屏蔽不想看的内容（仅匹配标题中的关键字）
    $('.chips').keyup(function(event){
        if(event.keyCode == 13 || event.keyCode == 8) {
            var data = M.Chips.getInstance(document.querySelector('.chips')).chipsData
            var banKeyword = []
            data.forEach(function(e){
                var keyword = e.tag
                banKeyword.push(keyword)
            })
            GM_log(banKeyword)
            // 将数据存储起来
            GM_setValue('banKeyword', banKeyword)
            GM_getValue('banKeyword')
        }
    })

    // 显示屏蔽关键字列表（设置过多关键字会导致显示有点不和谐，待修复）
    function getBanKeyword() {
        // 挂载需要填入数据并设置可见性为true
        if($('#keywordList').length != 0) {
            $('#keywordList').css('display','inline')
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
            }
            var instances = M.Chips.init(elems, options)
        }
    }
    $(document).ready(function() {
        // 根据关键字进行屏蔽
        var banKeyword = GM_getValue('banKeyword')
        $('#showBanList').click(function(){
            getBanKeyword()
        })
        var keywordCount = 0;
        for(var j = 0; j < banKeyword.length; j++){
            keywordCount += $('li:contains(' + banKeyword[j] + ')').length
            console.log('关键字屏蔽数量：' + keywordCount)
          $('li:contains(' + banKeyword[j] + ')').css({'background-color':'purple','color':'grey'}).fadeOut(4000)
          $('.list-item-wrap:contains(' + banKeyword[j] + ')').css({'background-color':'purple','color':'grey'}).fadeOut(4000)
        }
        // 提示屏蔽的帖子数量
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
        }, 2000)

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

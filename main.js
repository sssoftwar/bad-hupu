// ==UserScript==
// @name         烂虎扑屏蔽器
// @namespace    sssoftwar
// @version      0.1
// @description  可以屏蔽虎扑坏帖和你不想看到的内容
// @author       sssoftwar
// @updateURL    https://raw.githubusercontent.com/sssoftwar/bad-hupu/master/main.js
// @license      Apache Licence 2.0
// @match        https://*.hupu.com/*
// @icon         https://bkimg.cdn.bcebos.com/pic/adaf2edda3cc7cd98d1095b4f549363fb80e7bec3b0f?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5/format,f_auto
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
    console.log('jquery')
        // 可以添加关键字来屏蔽不想看的内容（仅匹配标题中的关键字）
        var banKeyword = [
                          '王思聪',
                          '孙一宁',
                          '鞠婧祎',
                          '刘浩存',
                          '钟薛高',
                         ]
        var keywordCount = 0;
        for(var j = 0; j < banKeyword.length; j++){
            keywordCount += $('li:contains(' + banKeyword[j] + ')').length
//            console.log(keywordCount)
          $('li:contains(' + banKeyword[j] + ')').css({'background-color':'yellow','color':'grey'}).remove()
          $('.list-item-wrap:contains(' + banKeyword[j] + ')').css({'background-color':'yellow','color':'grey'}).remove()
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

                if(/您无法访问该帖子/.test(result)||/您访问的帖子不存在/.test(result)) {
                    badLinkCount++
                    var linkSuffix = $(this)[0].url.match(/\d+/)[0]
//                    console.log(linkSuffix)
                    var badLink = "[href=\"/" + linkSuffix + ".html\"]"
                    console.log("坏帖子：" + badLink)
                    var str = $(badLink).parent().parent()[0].className
                    if(str === 'list-item') {
//                        console.log($(badLink).parent().parent().parent())
                        // 不需要看屏蔽效果反馈，就这样
                        //$(badLink).parent().parent().parent().css({'background-color':'yellow','color':'grey'}).remove()
                        // 想看屏蔽效果，就这样
                        // 这里不知道怎么回事有时候要三个parent有时候要两个，不然就跟else if合并了，持续观察中..
                        $(badLink).parent().parent().css({'background-color':'yellow','color':'grey'}).fadeOut(4000)
                    }
                    else if (/bbs-sl-web-post-body/.test(str)){
//                        console.log($(badLink).parent().parent())
                        // 不需要看屏蔽效果反馈，就这样
                        //$(badLink).parent().parent().css({'background-color':'yellow','color':'grey'}).remove()
                        // 想看屏蔽效果，就这样
                        $(badLink).parent().parent().css({'background-color':'yellow','color':'grey'}).fadeOut(4000)
                    }
                    else {
                        $(badLink).css({'background-color':'yellow','color':'grey'}).fadeOut(4000)
                    }

                }
                else
                    console.log(i + ' 或许是正经帖子')
            }})
        }
        // 在板块标题处显示处理的坏帖子数量
        if($('.middle-label').length != 0) {
          $('.middle-label').fadeOut(2000, function() {
            $(this).after(function(){
              if(keywordCount == 0 && badLinkCount == 0)
                return "<h1 class='badLinkCount' style='color:#c01e2f;font-size:50px'>►此页无烂虎扑</h1>"
              else
                return "<h1 class='badLinkCount' style='color:#c01e2f;font-size:50px'>►将为你隐藏" + (keywordCount + badLinkCount) + "个烂虎扑</h1>"
            })
            $('.badLinkCount').fadeOut(2000, function() {
              $('.middle-label').fadeIn(2000)
            })
          })
        }
        else if($('.bbs-sl-web-intro').length != 0) {
          $('.bbs-sl-web-intro').fadeOut(2000, function() {
            $(this).after(function(){
              if(keywordCount == 0 && badLinkCount == 0)
                return "<h1 class='badLinkCount' style='color:#c01e2f;font-size:128px'>►此页无烂虎扑</h1>"
              else
                return "<h1 class='badLinkCount' style='color:#c01e2f;font-size:85px'>►将为你隐藏" + (keywordCount + badLinkCount) + "个烂虎扑</h1>"
            })
            $('.badLinkCount').fadeOut(2000, function() {
              $('.bbs-sl-web-intro').fadeIn(2000)
            })
          })
        }
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
    // Your code here...
})();

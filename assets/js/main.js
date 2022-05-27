$(function(){
    var locaHref = location.href
    var pageUrl = location.pathname
    var jsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();
    var lang = "en"
    // console.log(jsSrc)
    if(jsSrc.indexOf('zh')>=0) {
        lang = 'zh'
    } else if(jsSrc.indexOf('en')>=0) {
        lang = 'en'
    }
    
    
    // console.log(pageUrl)
    if(pageUrl === '/' || !pageUrl){//设置默认值
        pageUrl = $(".header-box>.nav-box>.nav-item."+ lang +">a").attr('href')
        // console.log(pageUrl.substring(1,pageUrl.length))
        window.location.href = locaHref + pageUrl.substring(1,pageUrl.length)
    }else{
        // if(pageUrl.indexOf(lang) === -1){

        // }
        lang = pageUrl.split('/')[1]
    }
    
    // console.log(lang)
    $(".menu-box .menu-uls>li>a[href='"+ pageUrl +"']").addClass('current').parents('li').addClass('current')
    //头部导航栏切换
    $(".nav-box>.nav-item>a").click(function(){
        $(this).parent('.nav-item').addClass('active').siblings().removeClass('active')
    })
    // console.log(pageUrl)
    // console.log(pageUrl.split(lang)[1])
    //模块路径
    var modulePath = pageUrl.split('/')[2]
    // console.log('0')
    // 菜单导航设置高亮
    $(".menu-box .menu-uls:not(."+ modulePath +")").remove()
    $(".menu-box .menu-uls."+ modulePath +"").addClass('show')
    $(".header-box>.nav-box>.nav-item[data-menu='"+ modulePath +"']").addClass('active')


    //设置语言
    // console.log('1')
    var langStr = '简体中文'
    var searchVal = ""
    var langObj = {
        zh: {
            search: '搜索',
            searchTipsBefore: `你搜索的“`,
            searchTipsAfter: `”未有查询结果`,
        },
        en: {
            search: 'Search',
            searchTipsBefore: `Your search for" `,
            searchTipsAfter: ` " does not result`,
        }
    }
    // console.log('3')
    if(lang === 'en'){
      langStr = 'English'
    }
    // console.log('1')
    $(".input-block").attr('placeholder', langObj[lang].search)
    $(".lang-box>.lang").text(langStr)
    $(".lang-box>.lang").on('click', function(e){
      if ($('.lang-dropdown').length === 0) {
        $('.lang-box').append(`<div class="lang-dropdown show"><div data-lang="zh" class="lang-dropdown-item${
            lang === 'zh' ? ' active' : ''
          }">简体中文</div><div data-lang="en" class="lang-dropdown-item${
            lang === 'en' ? ' active' : ''
          }">English</div></div>`)
        $('.lang-dropdown-item').on('click', function(e) {
          if(!$(this).hasClass('active')) {
            window.location.href = locaHref.replace('/'+lang+'/', '/'+$(this).data('lang')+'/')
          }
          e.stopPropagation()
        })
        $(document).on('click', function() {
          $('.lang-dropdown').removeClass('show')
        })
      } else {
        $('.lang-dropdown').toggleClass('show')
      }
      e.stopPropagation()
    })
    // console.log(lang)
    //隐藏非当前语言下的导航栏和目录
    $(".header-box>.nav-box>.nav-item:not(."+ lang +")").remove()
    $(".header-box>.nav-box>.nav-item."+ lang +"").addClass('show')
    $(".menu-box .menu-uls:not(."+ lang +")").remove()//在同一页面下只显示同一模块下的菜单
    $(".menu-box .menu-uls."+ lang +"").addClass('show')
    //将菜单中的h3表格提取出来，放进子菜单中
    // let childIndex = 0
    $(".menu-box .menu-uls>li>a[href='"+ pageUrl +"']").siblings(".itemHide").find("h3").each(function(){
        // console.info($(this).text());
        // $(this).attr('id', $(this).attr('id') + childIndex)
        var thisId = $(this).attr('id')
        // $(".markdown-body h3").eq(childIndex).attr('id', $(".markdown-body h3").eq(childIndex).attr('id') + childIndex)
        var newA = `<li class="child-li"><a class="child-a" href="#${thisId}">${$(this).text()}</a></li>`
        $(this).parent('.itemHide').siblings('.child-ul').append(newA)
        // childIndex++
    });
    $(".itemHide").remove()
    
    $(".menu-box .child-ul").on('click', '.child-a', function(){
        $(this).parents('li.toc').children('a').removeClass('current')
        $(this).addClass('current').parents('.child-li').siblings().find(".child-a").removeClass('current')
        
        
        // $(this).parents('li.toc').siblings('li').removeClass('current').find('.child-a').removeClass('current')
      })

    //实现滚动条下滑左侧菜单高亮
    $(".content-box").scroll(function(e){
      $('.markdown-box h3').each(function(){
        if($(this).offset().top < 230){
          $(".menu-box .child-ul .child-a[href='#"+ $(this).attr('id') +"']").addClass('current').parents('.child-li').siblings().find(".child-a").removeClass('current')
          $(".menu-box .child-ul .child-a[href='#"+ $(this).attr('id') +"']").parents('li.toc').children('a').removeClass('current')
        }
      })
      $('.markdown-box .highlighter-rouge').each(function(){
        if($(this).offset().top < 400){
          codeTypeFun($(this))
        }
      })
    })
    
    function codeTypeFun(this_){//代码语言判断
      var highArr = this_.attr('class')
      highArr.split(' ').map(item => {
        if(item.indexOf('language-') !== -1){
          $(".code-bg-title>span").text(item.split('-')[1] || 'json')
        }
      })
    }
    

    
    //修改form标签的action值为当前链接
    // $(".menu-box>.search").attr('action', pageUrl);
    $(".menu-box .input-block").keyup(function(){
        let val = $(this).val()
        if(val.length < 1){
            $(".search-val-box").hide()
            return false
        }
        $.ajax(`${ui.baseurl}/data.json`)
        .done((res) => {
            // console.log(res)
            search(res, val)
            // if(res.length < 1){
            //     let liText = `<li style="color: #fff;text-align: center;height: 40px;
            //     line-height: 40px;">${searchTips}</li>`
            //     console.log(liText)
            //     $(".search-val-box").html(liText).show()
            //     return false;
            // }else{
            //     search(res, val)
            // }
            
        })
        .fail((xhr, message) => debug(message));
    })

    $(".search-val-box").on('click', '.child-a', function(){
      // console.log(location.origin + thisHref)
      var thisHref = $(this).attr('data-href')
      
      window.location.href = location.origin + thisHref
    })
    
    
    $(".menu-box .input-block").blur(function(){
        let val = $(this).val()
        if(val.length < 1){
            $(".search-val-box").hide()
            return false
        }
        $.ajax(`${ui.baseurl}/data.json`)
        .done((res) => {
            search(res, val)
            // if(res.length < 1){
            //     let liText = `<li style="color: #fff;text-align: center;height: 40px;
            //     line-height: 40px;">${searchTips}</li>`
            //     $(".search-val-box").html(liText).show()
            //     return false;
            // }else{
                
            // }
            
        })
        .fail((xhr, message) => debug(message));
    })
    
    //搜索事件
    function search(data,text) {
        searchVal = text
        // console.log(data)
        // let text = new URL(location.href).searchParams.get("q");
        // let lang = new URL(location.href).searchParams.get("lang");
      
        // console.log(text)
        // console.log(lang)
      
        // $("input[name='q']").val(text);
      
        let results = [];
        let regexp = new RegExp();
        try {
          regexp = new RegExp(text, "im");
        } catch (e) {
          $(".search-results .content").empty();
          $(".search-results .summary").html(ui.i18n.search_results_not_found);
          $(".search-results h2").html(ui.i18n.search_results);
          return debug(e.message);
        }
      
        function slice(content, min, max) {
          
          return content
            .slice(min, max)
            .replace(regexp, (match) => {
              // console.log(match)
              return `<span class="bg-yellow">${match}</span>`
            });
        }
        for (page of data) {
            // console.log(page)
          let [title, content] = [null, null];
          try {
            if (page.title) {
              title = page.title.match(regexp);
            } else {
              if (page.url == "/") {
                page.title = ui.title;
              } else {
                page.title = page.url;
              }
            }
          } catch (e) {
            debug(e.message);
          }
          try {
            if (page.content) {
              page.content = $("<div/>").html(page.content).text();
              content = page.content.match(regexp);
            }
          } catch (e) {
            debug(e.message);
          }
          if (title || content) {
              if(page.dir.split('/')[1] === lang){//只匹配当前语言下的值
                let result = [
                    `<a class="child-a" data-href="${ui.baseurl}${page.url}?highlight=${text}">${page.title}</a>`,
                  ];
                  if (content) {
                    let [min, max] = [content.index - 100, content.index + 100];
                    let [prefix, suffix] = ["...", "..."];
            
                    if (min < 0) {
                      prefix = "";
                      min = 0;
                    }
                    if (max > page.content.length) {
                      suffix = "";
                      max = page.content.length;
                    }
                    // result.push(
                    //   `<p class="text-gray">${prefix}${slice(
                    //     page.content,
                    //     min,
                    //     max
                    //   )}${suffix}</p>`
                    // );   //只要标题用来放到左侧菜单中，具体内容暂时舍弃
                    
                  }
                  results.push(`<li class="border-top child-li">${result.join("")}</li>`);
              }
            
          }
        }
        if (results.length > 0 && text.length > 0) {
        //   console.log(results.join(""))
          // $(".search-results .content").html(results.join(""));
      
          $(".menu-content-box .search-val-box").html(results.join(""))
          $(".search-val-box").show();
          $(".search-results .summary").html(
            ui.i18n.search_results_found.replace("#", results.length)
          );
        } else {
            let liText = `<li style="color: #fff;text-align: center;padding: 15px 20px;">${langObj[lang].searchTipsBefore + searchVal + langObj[lang].searchTipsAfter}</li>`
            $(".search-val-box").html(liText).show()
        //   $(".search-results .content").empty();
        //   $(".search-results .summary").html(ui.i18n.search_results_not_found);
        }
        $(".search-results h2").html(ui.i18n.search_results);
        selectSearchList()
      }

    highlight()
    function highlight() {//搜索匹配字符高亮
        let text = new URL(location.href).searchParams.get("highlight");
        if (text) {
            $(".markdown-body")
            .find("*")
            .each(function () {
                try {
                if (this.outerHTML.match(new RegExp(text, "im"))) {
                    $(this).addClass("search-result");
                    $(this).parentsUntil(".markdown-body").removeClass("search-result");
                }
                } catch (e) {
                debug(e.message);
                }
            });
            // last node
            $(".search-result").each(function () {
            $(this).html(function (i, html) {
                // console.log(text)
                return html.replace(text, `<span class="bg-yellow">${text}</span>`);
            });
            });
            $(".search input").val(text);
        }
    }

    // 点击图标跳转到官网主页
    $('.logo').on('click', function() {
      window.open('https://hotcoin.com/')
    })

    initSearch()
    // 初始化search列表展示与选中
    function initSearch() {
      const text = new URL(location.href).searchParams.get("highlight")
      if (!text) return
      // 初始化搜索列表
      $.ajax(`${ui.baseurl}/data.json`)
      .done((res) => {
        search(res, text)
        selectSearchList()
      })
      .fail((xhr, message) => debug(message))
    }
    function selectSearchList() {
      const name = location.pathname + location.search
      const link = $(".search-val-box").find(`[data-href="${decodeURI(name)}"]`)
      if (link.length > 0) {
        $(".search-val-box .active").removeClass("active")
        link.addClass("active")
      }
    }
    
    // 复制按钮功能
    initCopy()
    function initCopy() {
      $('.custom-code-title').append('<i class="custom-code-copy"></i>')
      $('.custom-code-title').on('click', '.custom-code-copy', function(e) {
        // 获取父级相邻元素子元素pre
        const next = e.target.parentElement.nextElementSibling
        copyDom($(next).find('pre')[0])

        // 复制成功提示
        const p = e.target.parentElement
        if ($(p).children('.custom-code-copy-tips').length) return
        const msg = lang == 'en' ? 'Copy success' : '复制成功'
        const div = $(`<div class="custom-code-copy-tips">${msg}</div>`)
        $(p).append(div)
        setTimeout(() => {
          div.remove()
        }, 2000)
      })
    }
    function copyDom(dom) {
      if (!dom) return
      const range = document.createRange()
      range.selectNode(dom)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
      range.detach()
    }

    // 监听滚轮事件自动切换左侧菜单
    document.querySelector('.content-box').addEventListener('wheel', function (event) {
      if (event.deltaY <= -100) {
        // 向上滚
        if ($('.content-box')[0].scrollTop === 0) {
          // console.log('up end+++', event.deltaY)
          $('.toc').each(function(index) {
            if ($(this).hasClass('current') && index !== 0) {
              window.location.pathname = $($($('.toc')[index - 1]).find('a')).attr('href')
              return false
            }
          })
        }
      } else if (event.deltaY >= 100) {
        // 向下滚
        if (Math.ceil($('.content-box')[0].scrollTop + $('.content-box')[0].clientHeight) >= $('.content-box')[0].scrollHeight) {
          // console.log('down end+++++', event.deltaY)
          $('.toc').each(function(index) {
            if ($(this).hasClass('current') && index !== $('.toc').length - 1) {
              window.location.pathname = $($($('.toc')[index + 1]).find('a')).attr('href')
              return false
            }
          })
        }
      }
    })
})
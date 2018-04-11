/**
 * Created by 11273 on 2018/4/10.
 */
$(function(){
  //进行本地存储操作
  //约定：search_list为键名
  render();
  //存储复杂数据类型，一定要将复杂数据类型先转换成Json字符串
  //取的时候，先得到json字符串，在通过json.parse转换成复杂数据类型
  //专门用于读取本地存储中的历史记录数组
  function getHistory(){
    //保证将来处理的一定是个数组
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);
    return arr;
  }
  //专门用于存储数组
  function render(){
   var arr =  getHistory();
    $('.lt_history').html(template('searchTpl',{arr:arr}));
  }

//  删除功能
  $('.lt_history').on('click','.btn_delete',function(){
    var that = this
    mui.confirm("你确认要删除么?", "温馨提示", ["确认", "取消"],function(e){
      if(e.index===0){
      //  获取索引
       var index =  $(that).data('index');
        console.log(index);
        var arr = getHistory();
        arr.splice(index,1);
        localStorage.setItem("search_list",JSON.stringify(arr));
        render();
      }
    })
  })
//  清空功能
  $('.lt_history').on('click','.btn_empty',function(){
    //console.log("memeda");
    mui.confirm("是否清空所有历史记录?", "温馨提示", ["确认", "取消"],function(e){
      if(e.index===0){
        localStorage.removeItem("search_list");
        render();
      }
      })
  })
//  添加功能
  $('.lt_search button').click(function(){
    var key = $('.lt_search input').val().trim();
    if(key === ""){
      mui.toast("请输入搜索关键字");
      return;
    }
  //  获取数组
    var arr = getHistory();
    if(arr.indexOf(key)!==-1) {
      var index = arr.indexOf(key);
      arr.splice(index, 1);
      // 超过 10 个删除最后一项
    }
      if(arr.length >=10){
        arr.pop();
      }
    //  添加到数组最前面
      arr.unshift(key);
    //  持久化到本地中
      localStorage.setItem("search_list",JSON.stringify(arr));
    //  渲染页面
      render();
    //  清空文本
      $('.lt_search input').val("");

    location.href = "searchList.html?key=" + key;
  })
})

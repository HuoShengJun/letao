/**
 * Created by 11273 on 2018/4/10.
 */
$(function(){
  $.ajax({
    type:'get',
    url:'/category/queryTopCategory',
    success:function(info){
      console.log(info);
      $('.category_left ul').html(template('list_tmp',info));
      renderById(info.rows[0].id);
    }
  })

//注册委托事件
  $('.category_left ul').on('click','a',function(){
    //console.log('hehehe');
    var id = $(this).data('id');
    console.log(id);
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
    renderById(id);
  })

  function renderById(id){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data:{
        id:id
      },
      success:function(info){
        console.log(info);
        $('.category_right ul').html(template('pic_tmp',info));
      }
    })
  }
})
/**
 * Created by 11273 on 2018/4/7.
 */
$(function(){
  var currentPage = 1;//当前页
  var pageSize = 5; //一页多少条数据
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
          page:currentPage,
          pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        $('.lt_content tbody').html(template('tbody_tmp',info));

      //  渲染分页
        $('#paginator').bootstrapPaginator({
          //指定bootstrap的版本，如果是3，必须指定
          bootstrapMajorVersion:3,
          //指定当前页
          currentPage:info.page,
          //总页数
          totalPages:Math.ceil(info.total / info.size),

          //当页面被点击时触发
          onPageClicked:function(a,b,c,page){
          //page当前点击的页码
            currentPage = page;
            render();
          }
        })
      }
    })
  }



})
/**
 * Created by 11273 on 2018/4/7.
 */
$(function(){
  var currentPage = 1;//当前页
  var pageSize = 5;//每页多少条
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        $('.lt_content tbody').html(template('tbody_tmp',info));
        $('#paginator').bootstrapPaginator({
          //当前的版本号
          bootstrapMajorVersion:3,
          //当前页
          currentPage:info.page,
        //  总页数
          totalPages:(info.total/info.size),
          //给页码添加点击事件
          onPageClicked:function(a,b,c,page){
            //将选中的页码更新到currentPage中
            currentPage = page;
            render();

          }
        })
      }
    })
  }

  //2.点击添加分类按钮，显示添加模态框
  $('#addBtn').click(function(){
      $('#addModal').modal('show');
  })
  //3.通过校验插件，添加校验功能
  $('#form').bootstrapValidator({
      //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验的字段
    fields:{
      categoryName:{
        //校验的规则
        validators:{
        //  非空
          notEmpty:{
          //  提示信息
            message:'请输入一级分类名称'
          }
        }
      }
    }
  })

 //4.注册表单校验成功事件
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();//阻止默认跳转
    $.ajax({
      type:"post",
      url:'/category/addTopCategory',
      data:$('#form').serialize(),
      success:function(info){
        console.log(info);
        $('#addModal').modal('hide');
        currentPage = 1;
        render();

      //  重置表单校验状态和表单内容
      //  传true不仅可以重置状态，还可以重置内容
        $('#form').data('bootstrapValidator').resetForm(true);
      }
    })
  })

});


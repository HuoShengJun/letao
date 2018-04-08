/**
 * Created by 11273 on 2018/4/8.
 */
$(function(){
  var currentPage = 1;//当前页
  var pageSize = 5; //每页的个数
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        $('.lt_content tbody').html(template('tbody_tmp',info));
        //进行页面初始化
        $('#paginator').bootstrapPaginator({
          //版本号
          bootstrapMajorVersion:3,
          //当前页
          currentPage:info.page,
          //总页数
          totalPages:Math.ceil(info.total/info.size),
          //注册每个页码的点击事件
         onPageClicked:function(a,b,c,page){
            currentPage = page;
           render();
         }
        })
      }
    })
  }


  //给添加分类注册点击事件
  $('#addBtn').click(function(){
    $('#addModal').modal('show');
  //  请求一级分类名称，渲染下拉菜单
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl',info));
      }
    })
  });

//3.通过注册委托事件，给a添加点击事件
    $('.dropdown-menu').on('click','a',function(){
      var txt = $(this).text();
      var id = $(this).data('id');
      $('#dropdownText').text(txt);
      $('[name="categoryId"]').val(id);
    //  需要将校验状态制成VALID
      $('#form').data('bootstrapValidator').updateStatus("categoryId","VALID");
    })

  //4.配置图片上传
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e,data){
      console.log(data);
      //获取上传成功的图片地址
      var picAddr = data.result.picAddr;
      //设置图片地址
      $('#imgBox img').attr('src',picAddr);
    //将图片地址存放在隐藏域中
      $('[name="brandLogo"]').val(picAddr);
    //  重置校验状态
      $('#form').data('bootstrapValidator').updateStatus("brandLogo","VALID");

    }
  })

  //5.配置表单校验
  $('#form').bootstrapValidator({
    excluded:[],//指定不校验的类型
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },//指定校验时的图标显示
    fields:{
      brandName:{
        validators:{
          notEmpty:{
            message:'请输入二级分类名称'
          }
        }
      },
      categoryId:{
        validators:{
          notEmpty:{
            message:'请选择一级分类'
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请上传图片'
          }
        }
      }
    }

  })

//  注册表单验证成功事件
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$('#form').serialize(),
      success:function(info){
        console.log(info);
        $('#addModal').modal('hide');
      //  重置表单里的内容和校验状态
        $('#form').data('bootstrapValidator').resetForm(true);
        currentPage = 1;
        render();
      //  找到下拉菜单文本重置
        $('#dropdownText').text('请选择1级分类');
      //  找到对应的图片
        $('#imgBox img').attr('src',"images/none.png")
      }
    })
  })

})
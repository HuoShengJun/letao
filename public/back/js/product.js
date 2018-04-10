/**
 * Created by 11273 on 2018/4/9.
 */
$(function(){
  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];//专门用来保存数组的对象
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        $('.lt_content tbody').html(template('tbody_tmp',info));
      //  进行分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:info.total/info.size,
          onPageClicked:function(a,b,c,page){
            currentPage = page;
            render();
          },
          //配置按钮大小large
          size:'normal',
        //  配置每个按键的文字
        //  每个按钮，都会调用一次这个方法，它得返回值就是按钮的文本内容
          itemTexts:function(type,page,current){
          //  first首页 last尾页 ，prev上一页，next下一页，
          //  page是当前按钮指向第几页
          //  current是指当前是第几页（相对于整个分页来说的）
            switch(type){
              case "first":
                return "首页"
              case "last":
                return "尾页"
              case "prev":
                return "上一页"
              case "next":
                return "下一页"
              case "page":
                return page
            }
          },
          //配置提示框
          tooltipTitles:function(type,page,current){
            switch(type){
              case "first":
                return "首页"
              case "last":
                return "尾页"
              case "prev":
                return "上一页"
              case "next":
                return "下一页"
              case "page":
                return "前往第" +page +"页";
            }
          },
        //  使用bootstrap样式的提示框组件
          useBootstrapTooltip:true

        })
      }
    })
  };

//  点击添加商品的按钮让模态框显示
  $('#addBtn').click(function(){
    $('#addModal').modal('show');
  //  请求ajax查询二级分类菜单来渲染页面
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl',info));
      }
    })
  })
//  给a注册事件委托
  $('.dropdown-menu').on('click',"a",function(){
    //console.log("hehe");
    var id = $(this).data('id');
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    $('[name="brandId"]').val(id);

  })
//  4.配置上传图片回调函数
  $('#fileupload').fileupload({
    dataType:"json",
    done:function(e,data){
      console.log(data);
    //  获取图片地址对象
      var picObj = data.result;
    //  获取图片地址
      var picAddr = picObj.picAddr;
    //  新得到的图片对象应该加到数组的前面
      picArr.unshift(picObj);
    //  新的图片应该放到盒子的最前面
      $('#imgBox').prepend('<img src="'+picAddr+'" width="100">')
    if(picArr.length>3){
      picArr.pop();
      $('#imgBox img:last-of-type').remove();
    }
      //如果picArr的长度为3，就可以进行表单校验了
      if(picArr.length==3){
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
      }
    }
  })

//  进行校验
  $('#form').bootstrapValidator({
    //指定不校验的类型
    excluded:[],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId: {
        validators:{
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators:{
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num:{
        validators:{
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:'商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size:{
        validators:{
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price:{
        validators:{
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      picStatus:{
        validators:{
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  })
//  注册表单校验成功的事件
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();//阻止默认跳转
    var params = $('#form').serialize();
    console.log(picArr);
    params+="&picName1"+picArr[0].picName+"&picAddr1"+picArr[0].picAddr
    params+="&picName2"+picArr[1].picName+"&picAddr2"+picArr[1].picAddr
    params+="&picName3"+picArr[2].picName+"&picAddr3"+picArr[2].picAddr
    console.log(params);
  //  请求ajax
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:params,
      success:function(info){
        console.log(info);
        if(info.success){
        //  关闭模块框
          $('#addModal').modal('hide');
        //  重置表单的状态
          $('#form').data('bootstrapValidator').resetForm(true);
          currentPage = 1;
          render();
        //  手动重置分类列表
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
          picArr= [];
        }
      }
    })
  })



})
/**
 * Created by 11273 on 2018/4/6.
 */
$(function(){
  $('#form').bootstrapValidator({
    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //设置校验规则
    fields:{
      //用户名
      username: {
        //效验的规则
        validators:{
          //非空效验
          notEmpty: {
            //为空时显示的提示信息
            message: "用户名不能为空"
          },
          stringLength:{
            min:2,
            max:6,
            message:'用户名必须是2-6位'
          }
        }
      },
      password:{
        validators:{
          notEmpty:{
            message:"密码不能为空"
          },
          stringLength:{
            min:6,
            max:12,
            message:"密码长度必须是6-12位"
          }
        }
      }
    }
  })

  //表单校验成功，注册表单校验成功的事件，阻止默认提交，使用ajax提交
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();//阻止表单的默认提交
    $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      dataType:"json",
      data:$('#form').serialize(),
      success:function(info){
        console.log(info);
          if(info.success){
            location.href = "index.html"
          }
          //如果error是1000，提示用户名错误
          //error是1001，提示密码错误
          if(info.error === 1000){
            //动态的改变状态
            $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback")
          }
        if(info.error === 1001){
            $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback")
        }
      }
    })

  });
  //3.重置功能实现
  $('[type="reset"]').click(function(){
    $('#form').data("bootstrapValidator").resetForm();
  })
})
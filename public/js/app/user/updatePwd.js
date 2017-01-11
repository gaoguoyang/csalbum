$(document).ready(function() {
	var updatePwdModal = $('#updatePwdModal');
	var modifyPwdIcon = $('#modifyPwdIcon');
	var savePwd = $('#savePwd');
	var alertSuccess_pwd = $('#alertSuccess_pwd');

	modifyPwdIcon.on('click', function(event) {
		console.log('modifyPwd');
        updatePwdForm[0].reset();
        $('#pwd_errorResult').html('');
        updatePwdModal.modal();
	});
   
	var updatePwdForm = $('#updatePwdForm');
    var pwd_validate = updatePwdForm.validate({
        rules: {
                nickname: {
                    required: true,
                },
                oldpassword: {
                    required: true,
                },
                newpassword1: {
                	required: true,
                },
                newpassword2: {
                	required: true,
                	equalTo: '#newpassword1'
                }
            },
            messages: {
                nickname: {
                    required: "请输入用户名",
                },
                oldpassword: {
                    required: "请输入旧密码",
                },
                newpassword1: {
                    required: "请输入新密码",
                },
                newpassword2: {
                    required: "请输入确认密码",
                    equalTo: "新密码与确认密码不一致"
                }
            }
    });

    savePwd.on('click', function(event) {
   		console.log('savePwd');
        if (!updatePwdForm.valid()) {
            $('input + label').css('color', 'red');
			return;
		}
		var postParam = updatePwdForm.serializeArray()
		console.debug(postParam);
		$.ajax({
			url: '/user/updatePwd',
			type: 'POST',
			dataType: 'json',
			data: postParam
		})
		.done(function(data) {
			if ('SUCCESS' === data.code) {
				console.log("success");
				updatePwdModal.modal('hide');
				updatePwdForm[0].reset();
				alertSuccess_pwd.find('strong').html('密码修改成功').end().modal();
				setTimeout(function(){
					alertSuccess_pwd.modal('hide');
	            },1000);
			} else {
				console.log("fail");
				$('#pwd_errorResult').html(data.message)
			}
		})
		.fail(function(data) {
			console.warn("error:" + data);
		});

    });

    var cancelPwd = $( '#cancelPwd' );
    cancelPwd.bind('click', function(event) {
        pwd_validate.resetForm();
        updatePwdForm[0].reset();
    });

});

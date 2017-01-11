$(document).ready(function() {
    $('#example').dataTable( {
        "bPaginate": true,
        "aaSorting": [],
        "sPaginationType": "full_numbers",
        "oLanguage": {
        "sLengthMenu": "每页显示 _MENU_ 条记录",
        "sZeroRecords": "抱歉， 没有找到",
        "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
        "sInfoEmpty": "没有数据",
        "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
        "oPaginate": {
        "sFirst": "首页",
        "sPrevious": "前一页",
        "sNext": "后一页",
        "sLast": "尾页"
        },
        "sZeroRecords": "没有检索到数据",
        "sProcessing": "<img src='./loading.gif' />"
        }
        } );

    var userForm = $( '#userForm' );
    var validator = userForm.validate({
            rules: {
                nickname: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            messages: {
                nickname: {
                    required: '管理员名不能为空'
                },
                password: {
                    required: '密码不能为空'
                }
            }
    });

    var userFormPwd = $( '#userFormPwd' );
    var validator2 = userFormPwd.validate({
            rules: {
                password: {
                    required: true
                }
            },
            messages: {
                password: {
                    required: '新密码不能为空'
                }
            }
    });

    var cancelBtn = $( '#cancel' );
    cancelBtn.bind('click', function(event) {
        console.log('cancelBtn');
        validator.resetForm();
        userForm[0].reset();
    });

    var cancel_resetpwd = $( '#cancel_resetpwd' );
    cancel_resetpwd.bind('click', function(event) {
        validator2.resetForm();
        userFormPwd[0].reset();
    });

    appendAuthGroup();

    //修改管理员
    $( 'button[updateUserId]' ).bind( 'click', function(event) {
        hideAllAuth();
        $( '#authdetail1' ).show();
        var userId = $( this ).attr('updateUserId');
        var nickname = $( this ).attr('nickname');
        $('#nickname').val(nickname);
        $( '#updateModalLabel' ).text('修改管理员')
        $( '#updateModal' ).modal()
        
        var saveBtn = $( '#save' );
        saveBtn.bind('click', function(event) {
            if(!userForm.valid()) {
                return;
            }
            var idObject = {};
            idObject['name'] = 'id';
            idObject['value'] = userId;
            var postParam = userForm.serializeArray();
            postParam.push(idObject);
            sendAjaxReq('/user/updateUser', 'POST', postParam, '/user/userList', 'errorResult', 'updateModal');
        });
    } );

   //新增管理员
    var saveBtn = $( '#save' );
    $( '#addUser' ).bind( 'click', function(event) {
        validator.resetForm();
        userForm[0].reset();
        hideAllAuth();
        $( '#updateModalLabel' ).text('添加管理员');
        $( '#errorResult' ).html('<span id="errorResult" class="help-block"></span>');
        $( '#authdetail1' ).show();
        $( '#updateModal' ).modal({
          backdrop: 'static'
        });
    });
    saveBtn.bind('click', function(event) {
        if(!userForm.valid()) {
            return;
        }
        sendAjaxReq('/user/addUser', 'POST', userForm.serializeArray(), '/user/userList', 'errorResult', 'updateModal');
    });

    //管理员权限下拉change
    $('#authGroupSel').change(function(event) {
        /* Act on the event */
        hideAllAuth();
        var value = $(this).val();
        $('#authdetail'+value).show();
    });

    
} );

//重置密码
$('button[resetPassword]').bind('click', function(event) {
    var userId = $( this ).attr('resetPassword');
    var name = $( this ).attr('nickname');
    $('#userName').text(name);
    $('#resetPwdModal').modal();

    var saveBtn = $( '#confirm' );
    saveBtn.bind('click', function(event) {
        if(!userFormPwd.valid()) {
            return;
        }
        var idObject = {};
        idObject['name'] = 'id';
        idObject['value'] = userId;
        var nickname = {};
        nickname['name'] = 'nickname';
        nickname['value'] = name;
        var postParam = userFormPwd.serializeArray();
        postParam.push(idObject);
        postParam.push(nickname);
        sendAjaxReq('/user/updateUser', 'POST', postParam, '/user/userList', 'resetPwd_errorResult', 'resetPwdModal');
    });
});

//删除用户
$('button[delteUserId]').bind('click', function(event) {
    $('#deleteConfirm').modal();
    console.log('deleteUser');
    var param = {'id':$(this).attr('delteUserId')};
    $('#delConfirmBtn').bind('click', {
        action: "delete"
    }, function(event) {
        sendAjaxReq('/user/deleteUser', 'POST', param, '/user/userList', 'delete_Result', 'deleteConfirm');
    })
});

//查看管理员详情
$( 'button[showDetail]' ).bind( 'click', function(event) {
    var id = $( this ).attr('showDetail');
    console.log(id);
    var idObject = {};
    idObject['id'] = id;

    $.ajax({
        url: "/user/getUserById",
        type: "POST",
        dataType: 'json',
        data: idObject
    })
    .done(function(data) {
        if('SUCCESS' === data.code) {
            var nickname2 = data.result.nickname;
            console.log(nickname2);
            $('#nickname2').val(data.result.nickname);
            $('#authGroupSel2').val(data.result.authGroup.remark);

            var authList = "";
            $.each(data.result.authGroup.authList,function(index, item2) {
                authList = authList + item2.remark + "<br/>";
            });
            console.log(authList);
            $('#showAuthDetail').remove();
            $('#adminAuth2').after("<div class='form-group' id='showAuthDetail'><label for='userName' class='col-lg-2 col-sm-2 control-label' style='width:20%'></label><div class='col-lg-10' style='width:80%'>"+authList+"</div></div>");
            $('#showModal').modal();
        } else {
            console.log("fail");
            $('#errorResult').html(data.message)
        }
    })
    .fail(function(data) {
        console.warn("error");
        console.log(data.message);
        console.log(data.detail);
    });
});
        
function hideAllAuth(){
    $("#authGroupSel option").each(function(){
        var name = $(this).val();
        $('#authdetail'+name).hide();
    });
}

function appendAuthGroup(){
    $.ajax({
        url: '/user/getAuthGroup',
        type: 'GET',
        dataType: 'json',
        data: {}
    })
    .done(function(data) {
        if('SUCCESS' === data.code) {
            console.log("success");
            $("#authGroupSel").empty();
            $.each(data.result,function(n,item) {
                $("#authGroupSel").append("<option value='"+item.id+"' >"+item.remark+"</option>");
                var authList = "";
                $.each(item.authList,function(index, item2) {
                    authList = authList + item2.remark + "<br/>";
                });
                $('#'+item.name).remove();
                $('#adminAuth').after("<div class='form-group' id='authdetail"+item.id+"'><label for='userName' class='col-lg-2 col-sm-2 control-label' style='width:20%'></label><div class='col-lg-10' style='width:80%'>"+authList+"</div></div>");
                $('#'+item.name).hide();
            });
            // addUserDeal();
        } else {
            console.log("fail");
            $('#errorResult').html(data.message);
        }
    })
    .fail(function(data) {
        console.log(data.code);
        console.warn("error");
    });
}

function addUserDeal(userForm){
    hideAllAuth();
    $( '#updateModalLabel' ).text('添加管理员');
    $( '#errorResult' ).html('<span id="errorResult" class="help-block"></span>');
    $( '#authdetail1' ).show();
    $( '#updateModal' ).modal();
    var saveBtn = $( '#save' );
    saveBtn.bind('click', function(event) {
        if(!userForm.valid()) {
            return;
        }
        sendAjaxReq('/user/addUser', 'POST', userForm.serializeArray(), '/user/userList', 'errorResult', 'updateModal');
    });
}

function successModel(msg,url,nowModal){
    console.log("success");
    $('#'+nowModal).modal('hide')
    $('#alertSuccess').find('strong').html(msg).end().modal()
    setTimeout(function() {
        location.href = url;
    },1000)
}

function sendAjaxReq(url,method,param,calbackUrl,error,nowModal){
    $.ajax({
        url: url,
        type: method,
        dataType: 'json',
        data: param
    })
    .done(function(data) {
        if('SUCCESS' === data.code) {
            successModel(data.message,calbackUrl,nowModal);
        } else {
            console.log("fail");
            $('#' + error).html(data.message)
        }
    })
    .fail(function(data) {
        console.warn("error");
        console.log(data.message);
        console.log(data.detail);
    });
}


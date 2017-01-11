$(document).ready(function() {
	//添加关键字
    $( '#addKeyword' ).bind( 'click', function(event) {
    	console.log("addKeyword");
        $( '#addKeywordModal' ).modal();

        var postParam = $('#addKeywordForm');
		var validator = postParam.validate({
			rules: {
				name: {
					required: true
				}
			},
			messages: {
				name: {
					required: '关键字内容不能为空'
				}
			}
		});

		var saveBtn = $( '#confirm' );
        saveBtn.bind('click', function(event) {
        	if (!postParam.valid()) {
				return;
			}
            $.ajax({
                url: '/keyword/addKeyword',
                type: 'POST',
                dataType: 'json',
                data: postParam.serializeArray()
            })
            .done(function(data) {
                if('ADD_SUCCESS' === data.code) {
                    successModel(data.message,'/keyword/keywordTag','addKeywordModal');
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
    });


	$('span[delTagId]').bind('click', function(event) {
        $('#deleteConfirm').modal();
        console.log('deleteKeyword');
        var param = {'id':$(this).attr('delTagId')};
        $('#delConfirmBtn').bind('click', function(event) {
        	$.ajax({
                url: '/keyword/deleteKeyword',
                type: 'POST',
                dataType: 'json',
                data: param
            })
            .done(function(data) {
                if('DELETE_SUCCESS' === data.code) {
                    successModel(data.message,'/keyword/keywordTag','deleteConfirm');
                } else {
                    console.log("fail");
                    $('#delete_Result').html(data.message)
                }
            })
            .fail(function(data) {
                console.warn("error");
                console.log(data.message);
                console.log(data.detail);
            });
        });
    });



    function successModel(msg,url,nowModal){
        console.log("success");
        $('#'+nowModal).modal('hide')
        $('#alertSuccess').find('strong').html(msg).end().modal()
        setTimeout(function() {
            location.href = url;
        },1000)
    }

});
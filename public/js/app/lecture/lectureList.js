$(document).ready(function() {
	$('#example').dataTable({
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
	});

	var lecForm = $('#lecForm');
	var validator = lecForm.validate({
		rules: {
			lectureName: {
				required: true
			},
			lectureLevel: {
				required: true
			}
		},
		messages: {
			lectureName: {
				required: '姓名不能为空'
			},
			lectureLevel: {
				required: '等级不能为空'
			}
		}

	});
	//清空表单信息
	var resetForm = function() {
		validator.resetForm();
		lecForm[0].reset();
	}
	var cancelBtn = $('#cancel');
	cancelBtn.bind('click', function(event) {
		console.log('cancelBtn');
		resetForm()
	});

	var updateModal = $('#updateModal')

	//更新模态框隐藏时，清空
	updateModal.on('hidden.bs.modal', function(e) {
		console.log('modal hidden')
		resetForm();
	})


	var updateIt = function(event, data) {
		var action = event.data.action;
		var text, url;
		if (action === 'add') {
			text = '新增讲解人'
			url = '/lecture/addLecture'
		} else if (action === 'update') {
			text = '修改讲解人'
			url = '/lecture/updateLecture'
		} else {
			console.warn('updateIt error')
			return;
		}
		$('#updateModalLabel').text(text)
		$('#updateModal').modal()


		var saveBtn = $('#save');
		saveBtn.bind('click', function(event) {
			if (!lecForm.valid()) {
				return;
			}

			var postParam = lecForm.serializeArray()

			if (data) {
				postParam.push(data)
			}
			console.log('postParam:' + postParam);



			$.ajax({
					url: url,
					type: 'POST',
					dataType: 'json',
					data: postParam
				})
				.done(function(data) {

					if ('SUCCESS' === data.code) {
						console.log("success");

						$('#updateModal').modal('hide')
						$('#alertSuccess').find('strong').html(data.message).end().modal()

						setTimeout(function() {
							location.href = '/lecture/lectureList'
						}, 1000)
					} else {
						console.log("fail");
						$('#errorResult').html(data.message)

					}
				})
				.fail(function(data) {
					console.warn("error:" + data);
				});


		});
	}


	$('button[lectureId]').bind('click', {
		action: "update"
	}, function(event) {
		console.log('updateLec');
		var lectureId = $(this).attr('lectureId');
		var idObject = {};
		idObject['name'] = 'id';
		idObject['value'] = lectureId;
		console.log('lectureId is' + lectureId);
		updateIt(event, idObject);
	});

	$('#addLec').bind('click', {
		action: "add"
	}, function(event) {
		console.log('addLec');

		updateIt(event);

	});


	$('button[delteLectureId]').bind('click', function(event) {

		$('#deleteConfirm').modal();
		console.log('deleteLec');
		var lectureId = $(this).attr('delteLectureId');
		var idObject = {};
		idObject['name'] = 'id';
		idObject['value'] = lectureId;
		console.log('lectureId is' + lectureId);
		$('#delConfirmBtn').bind('click', {
			action: "delete"
		}, function(event) {

			var postParam = []
			postParam.push(idObject)

			$.ajax({
					url: '/lecture/deleteLecture',
					type: 'POST',
					dataType: 'json',
					data: postParam
				})
				.done(function(data) {

					if ('SUCCESS' === data.code) {
						console.log("success");
						location.href = location.href
					} else {
						console.log("fail");
					}
				})
				.fail(function(data) {
					console.warn("error");
				})
				.always(function(data) {
					$('#deleteConfirm').modal('hide');
				});

		})

	});

});
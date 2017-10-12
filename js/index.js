$(function(){
	$('#search_button').button({
		icons:{
			primary:'ui-icon-search',
		},
	});
	$('#question_button').button({
		icons:{
			primary:'ui-icon-search',
		},
	}).click(function(){
		if($.cookie('user')){
			$('#question').dialog('open');
		} else{
			$('#error').dialog('open');
			setTimeout(function(){
				$('#error').dialog('close');
				$('#login').dialog('open');
			},1000);
		}
	});

	$.ajax({
		url:'show_content.php',
		type:'POST',
		success:function(response,status,xhr){
			var json = $.parseJSON(response)
			var html='';
			var arr=[];
			$.each(json,function(index,value){
				html += '<h4>'+value.user+'发表于'+value.date+'</h4><h3>'+value.title+'</h3><div class="editor_1">'+value.content+'</div><div class="bottom">0条评论<span class="down">显示全部</span><span class="up">收起</span></div><hr noshade="noshade" size="1">';
			});
			$('.content').append(html);

			$.each($('.editor_1'),function(index,value){
				arr[index] = $(value).height();
				if($(value).height()>150){
					$(value).next('.bottom').find('.up').hide();
				}
				$(value).height(150);
			});
			$.each($('.bottom .down'),function(index,value){
				$(this).click(function(){
					$(this).parent().prev().height(arr[index]);
					$(this).hide();
					$(this).parent().find('.up').show();
				})
			});
			$.each($('.bottom .up'),function(index,value){
				$(this).click(function(){
					$(this).parent().prev().height(150);
					$(this).hide();
					$(this).parent().find('.down').show();
				})
			});
		},
	});

	$('#question').dialog({
		autoOpen:false,
		modal:true,
		height:360,
		width:500,
		resizable:false,
		buttons:{
			'发布':function(){
				$(this).ajaxSubmit({
					url:'add_content.php',
					type:'POST',
					data:{
						user:$.cookie('user'),
					},
					beforeSubmit:function(formData,jqForm,options){
						$('#loading').dialog('open');
						$('#question').dialog('widget').find('button').eq(1).button('disable');
					},
					success: function(responseText,statusText){
						$('#question').dialog('widget').find('button').eq(1).button('enable');
						if(responseText){
							$('#loading').html('数据新增成功！');
							setTimeout(function(){
								$('#loading').dialog('close');
								$('#question').dialog('close');
								$('#question').resetForm();
								$('#loading').html('数据交互中...');
							},1000);
						}
					},
				});
			}
		}
	});

	$('#error').dialog({
		autoOpen:false,
		modal:true,
		closeOnEscape:false,
		resizable:false,
		draggable:false,
		width:180,
		height:50, 
	}).parent().find('.ui-widget-header').hide();
	$('#member,#logout').hide();

	if($.cookie('user')){
		$('#member,#logout').show();
		$('#reg_a,#login_a').hide();
		$('#member').html($.cookie('user'));
	} else {
		$('#member,#logout').hide();
		$('#reg_a,#login_a').show();
	}
	$('#logout').click(function(){
		$.removeCookie('user');
		window.location.href='/cgi-bin/zhiwen/index.html';
	});
	$('#loading').dialog({
		autoOpen:false,
		modal:true,
		closeOnEscape:false,
		resizable:false,
		draggable:false,
		width:180,
		height:50, 
	}).parent().find('.ui-widget-header').hide();
	$('#reg_a').click(function(){
		$('#reg').dialog('open');
	});
	$('#reg').dialog({
		autoOpen:false,
		modal:true,
		height:340,
		width:320,
		resizable:false,
		buttons:{
			'提交':function(){
				$(this).submit();
			}
		}
	}).validate({
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url:'add.php',
				type:'POST',
				beforeSubmit:function(formData,jqForm,options){
					$('#loading').dialog('open');
					$('#reg').dialog('widget').find('button').eq(1).button('disable');
				},
				success: function(responseText,statusText){
					$('#reg').dialog('widget').find('button').eq(1).button('enable');
					if(responseText){
						$('#loading').html('数据新增成功！');
						$.cookie('user',$('#user').val());
						setTimeout(function(){
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*');
							$('#loading').html('数据交互中...');
							$('#member,#logout').show();
							$('#reg_a,#login_a').hide();
							$('#member').html($.cookie('user'));
						},1000);
					}
				},
			});
		},
		showErrors:function(errorMap,errorlist){
			var errors = this.numberOfInvalids();
			if(errors>0){
				$('#reg').dialog('option','height',errors*20+340);
			}else{
				$('#reg').dialog('option','height',340);
			}
			this.defaultShowErrors();
		},
		highlight:function(element,errorClass){
			$(element).css('border','1px solid #630');
			$(element).parent().find('span').html('*');
		},
		unhighlight:function(element,errorClass){
			$(element).css('border','1px solid #ccc');
			$(element).parent().find('span').html('✔');
		},
		errorLabelContainer:'ol.reg_error',
		wrapper:'li',
		rules:{
			user:{
				required:true,
				minlength:2,
				remote:{
					url:'isUser.php',
					type:'POST',
				},
			},
			pass:{
				required:true,
				minlength:6,
			},
			email:{
				required:true,
				email:true,
			},
			birth:{
				date:true,
			},
		},
		messages:{
			user:{
				required:'账号不得为空！',
				minlength:$.validator.format('账号不得小于｛2｝位！'),
				remote:'账号被占用！',
			},
			pass:{
				required:'密码不得为空！',
				minlength:$.validator.format('密码不得小于｛6｝位！'),
			},
			email:{
				required:'邮箱不得为空！',
				minlength:$.validator.format('请输入有效的邮箱地址！'),
			},
		},
	});
	
	$('#birth').datepicker({
		changeMonth:true,
		changeYear:true,
		maxDate:0,
		yearRange:'1950 : 2050',
	});
	$('#reg input[title]').tooltip({
		show :false,
		hide :false,
		position :{
			my :'left top+5',
			at :'center-15 bottom'
		},
	});
	$('#email').autocomplete({
		delay:0,
		autoFocus:true,
		source:function(request,response){
			var hosts = ['qq.com','163.com','sina.com','gmail.com','hotmail.com'];
				term = request.term, //获取用户输入的内容
				name = term,         //邮箱的用户名
				host = '',			//邮箱的域名
				ix = term.indexOf('@'); //@的位置
				result = [];        //最终呈现的邮箱列表

			result.push(term);
			//当有@的时候重新分配用户名和域名
			if(ix > -1){
				name = term.slice(0,ix);
				host = term.slice(ix+1);
			}
			if(name){
				//如果用户已经输入@和后面的域名，那么就找到相关的域名提示
				//如果用户没有输入@和后面的域名，那么就把所以的域名都提示出来
				var findedHosts = (host ? $.grep(hosts,function(value,index){
					return value.indexOf(host) > -1}) : hosts);
				var findedResult = $.map(findedHosts,function(value,index){
				    return name + '@' + value;
			   });
				result = result.concat(findedResult);
			}
			response(result);
		},
	});

	$('#login_a').click(function(){
		$('#login').dialog('open');
	})
	$('#login').dialog({
		autoOpen:false,
		modal:true,
		height:240,
		width:320,
		resizable:false,
		buttons:{
			'登录':function(){
				$(this).submit();
			}
		}
	}).validate({
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url:'login.php',
				type:'POST',
				beforeSubmit:function(formData,jqForm,options){
					$('#loading').dialog('open');
					$('#login').dialog('widget').find('button').eq(1).button('disable');
				},
				success: function(responseText,statusText){
					$('#login').dialog('widget').find('button').eq(1).button('enable');
					if(responseText){
						$('#loading').html('登录成功！');
						if($('#expires').is(':checked')){
							$.cookie('user',$('#login_user').val(),{
								expires:7,
							});

						} else{
							$.cookie('user',$('#login_user').val());
						}	
						setTimeout(function(){
							$('#loading').dialog('close');
							$('#login').dialog('close');
							$('#login').resetForm();
							$('#login span.star').html('*');
							$('#member,#logout').show();
							$('#reg_a,#login_a').hide();
							$('#member').html($.cookie('user'));
						},1000);
					}
				},
			});
		},
		showErrors:function(errorMap,errorlist){
			var errors = this.numberOfInvalids();
			if(errors>0){
				$('#login').dialog('option','height',errors*20+240);
			}else{
				$('#login').dialog('option','height',240);
			}
			this.defaultShowErrors();
		},
		highlight:function(element,errorClass){
			$(element).css('border','1px solid #630');
			$(element).parent().find('span').html('*');
		},
		unhighlight:function(element,errorClass){
			$(element).css('border','1px solid #ccc');
			$(element).parent().find('span').html('✔');
		},
		errorLabelContainer:'ol.login_error',
		wrapper:'li',
		rules:{
			login_user:{
				required:true,
				minlength:2,
			},
			login_pass:{
				required:true,
				minlength:6,
				remote:{
					url:'login.php',
					type:'POST',
					data:{
						login_user:function(){
							return $('#login_user').val();
						},
					},
				},
			},
		},
		messages:{
			login_user:{
				required:'账号不得为空！',
				minlength:$.validator.format('账号不得小于｛2｝位！'),
			},
			login_pass:{
				required:'密码不得为空！',
				minlength:$.validator.format('密码不得小于｛6｝位！'),
				remote:'账号或密码不正确！'
			},
		},
	});	
	$('#tabs').tabs();
	$('#accordion').accordion();
});
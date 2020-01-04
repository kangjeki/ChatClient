const btnToggle_jcChatFrame = query("#jc_chat_btn_toggleFrame");

let frame_jcChat 		= query("#__jc_chat__ .frame_jc_chat"),
	in_nameUserChat 	= query("#__jc_chat__ #name_user_chat"),
	in_emailUserChat 	= query("#__jc_chat__ #email_user_chat"),
	btn_start_jcChat 	= query("#__jc_chat__ #btn_start_jc_chat");

let onRadyJcChat 		= query("#__jc_chat__ .on_ready_chat"),
	onStartJcChat 		= query("#__jc_chat__ .on_start_chat");

if ( btnToggle_jcChatFrame !== null ) {
	jcEvent(btnToggle_jcChatFrame, 'click', function() {
		frame_jcChat.classList.toggle('frame_jc_chat_show');
	});
}

if (btn_start_jcChat !== null) {
	jcEvent(btn_start_jcChat, 'click', function() {
		if ( in_emailUserChat.value.length !== 0 && in_emailUserChat.value.search('@') >= 1 ) {
			query("#__jc_chat__ .on_ready_chat").classList.toggle('on_hide_chat');
			query("#__jc_chat__ .on_start_chat").classList.toggle('on_hide_chat');
			startChat(in_nameUserChat.value, in_emailUserChat.value);
		}
	});
}

function startChat(userChatName, emailUser) {
	const JC     	= new JC_Socket('idClient'),
	      roomName  = "jc_chat-" + emailUser;

	let	textInput 	= query("#chat-text"),
		frameChat 	= query("#frame-chat"),
		inLampiran 	= query("#in-lampiran"),
		btnEmoji 	= query("#btn-emoji"),
		username 	= userChatName,
		onWriter 	= true;

	/*operaton*/
	let btnSendJcChat = query("#send_jc_chat");
	if (btnSendJcChat !== null) {
		jcEvent(btnSendJcChat, 'click', function() {
			sendChat(textInput.innerHTML, username);
		});
	}

	// print message on frame
	function showChat(message) {
		let dvDt 	= newTag('div');
			dt 		= `<div class="date-chat date-${message.date}"><span>${message.date}</span></div>`;

		dvDt.innerHTML = dt;
		if (query('.date-' + message.date) == null) {
			frameChat.appendChild(dvDt);	
		}

		let dv 	= newTag('div');
			dv.classList.add('chat-list');

		if (message.name == username) {
			dv.classList.add('chat-user');
		}

		let sname 	= newTag('h4');
			sname.style.cssText 	= `padding: 0px 0px; margin-bottom: 5px`;
			sname.innerHTML 		= message.name;

		let spnCtn 	= newTag('span');
			spnCtn.style.cssText 	= `display: inline-block; flex-flow: wrap; width: 100%;`;

		let pDate 	= newTag('p');
		 	pDate.style.cssText 	= `font-size: 11px; float: right; padding: 0; margin-top: 2px; margin-left: 20px;`;
		 	pDate.innerHTML 		= message.time;

		if ( message.type === "text" ) {
			spnCtn.innerHTML 	+= message.content;
		}
		else if ( message.type === "image" ) {
			spnCtn.appendChild(message.content);
		}

		spnCtn.appendChild(pDate);

		dv.appendChild(sname);
		dv.appendChild(spnCtn);

		frameChat.appendChild(dv);
		query("#chat-text").innerHTML = "";

		// extern remove status writer
		let dvWrite = query(".on-write");
		if (dvWrite !== null) {
			dvWrite.remove();
		}
	}


	// ready open response message
	function getResponse() {
		JC.response(roomName, function(message) {
			// reconnct when closed
			( message == false ) ? getResponse() : false;

			// type message writer on / create status write
			if ( message.type === "onwrite" ) {
				let writer = message.name;
				if ( writer !== username ) {
					let dv 	= newTag('div');
						dv.classList.add('on-write');
						dv.innerHTML = '<div>' + writer + '</div> <div class="anim-writer"><span></span><span></span><span></span></div>';
					if ( query('.on-write') == null ) {
						frameChat.appendChild(dv);
					}
				}
				setTimeout(function() {
					onWriter = true;
					if (query('.on-write') !== null) {
						query('.on-write').remove();
					}
				}, 3000);
			}

			// type message type message send
			else if ( message.type === "text" ) {
				showChat(message);
			}

			// testing share image
			else if ( message.type === "image" ) {
				let img = new Image();
				img.src = message.content;
				img.style.cssText 	= `width: 100%; background: rgba(0,0,0, .7);`;

				message.content 	= img;
				showChat(message);
			}

			// auto roll on bottom frame message
			frameChat.scrollTop = frameChat.scrollHeight;

		});
	};
	getResponse();

	/*
	 * set ready connection
	*/
	textInput.setAttribute("contenteditable", "true");
	textInput.focus();


	// sending chat message
	this.sendChat = function(msg, nama) {
		let frmaeEmojiShow = query("#__jc_chat__ .frame-emoji-show");
		if (frmaeEmojiShow !== null) {
			frmaeEmojiShow.classList.toggle('frame-emoji-show');
		}
		
		if ( msg.length !== 0 ) {
			let MyDate = new Date();
			let MyDateString;

			MyDate.setDate( MyDate.getDate() );
			MyDateString = ( '0' + MyDate.getDate() ).slice(-2) + '-'
							+ ( '0' + (MyDate.getMonth()+1) ).slice(-2) + '-'
							+ MyDate.getFullYear();

			let hour 		= MyDate.getHours(), 
				minute 		= MyDate.getMinutes();

			if ( hour.toString().length == 1 ) {
				hour 	= "0" + MyDate.getHours();
			}
			if ( minute.toString().length == 1 ) {
				minute 	= "0" + MyDate.getMinutes();
			}

			JC.publish(roomName, {
				type 	: "text",
				name 	: nama,
				content : msg,
				date 	: MyDateString,
				time 	: hour + "." + minute
			});
		}
	}

	this.sendImage = function(msg, nama) {
		if ( msg.length !== 0 ) {
			let MyDate = new Date();
			let MyDateString;

			MyDate.setDate( MyDate.getDate() );
			MyDateString = ( '0' + MyDate.getDate() ).slice(-2) + '-'
							+ ( '0' + (MyDate.getMonth()+1) ).slice(-2) + '-'
							+ MyDate.getFullYear();

			let hour 		= MyDate.getHours(), 
				minute 		= MyDate.getMinutes();

			if ( hour.toString().length == 1 ) {
				hour 	= "0" + MyDate.getHours();
			}
			if ( minute.toString().length == 1 ) {
				minute 	= "0" + MyDate.getMinutes();
			}

			let fileReader 	= new FileReader();
			fileReader.onload = function(evt) {
				JC.publish(roomName, {
					type 	: "image",
					content : evt.target.result,
					name 	: nama,
					date 	: MyDateString,
					time 	: hour + "." + minute
				});
			}
			fileReader.readAsDataURL(msg.files[0]);
		}
	}

	// progress on write
	this.sendOnWrite = function(nama) {
		JC.publish(roomName, {
			type 	: "onwrite",
			name 	: nama,
			content : ""
		});	
	}

	this.toBase64 = function(uri, callback) {
		let rsc = new XMLHttpRequest();
		rsc.open('GET', uri, true);
		rsc.responseType = "blob";

		rsc.onreadystatechange = function() {
			if (rsc.status == 200 && rsc.readyState == 4) {
				let fileReader 		= new FileReader();
				fileReader.onload 	= function(evt) {
					callback(evt.target.result);
				}
				fileReader.readAsDataURL(rsc.response);
			}
		}
		rsc.send();
	}

	// add icon to input text
	queryAll("#__jc_chat__ .frame-emoji .emoji").forEach(function(el) {
		jcEvent(el, 'click', function() {
			let a 	= window.location.pathname;
			let b 	= a.split('/');
				b.pop();
			let c 	= b.join("/");
			
			let ori = window.location.origin,
				sce = ori + c + "/" + el.dataset.src;

			toBase64(sce, function(resrc) {
				let	srcIco 		= el.dataset.src,
					newIcon 	= newTag('img');
				newIcon.src 	= resrc;
				newIcon.classList.add('text-ico');

				textInput.appendChild(newIcon);	
			});
			
			//textInput.focus();
		})
	});

	// action keyup writer
	jcEvent(query("#chat-text"), 'keyup', function() {
		if (onWriter == true) {
			sendOnWrite(username);
			onWriter = false;
		}
	});

	jcEvent(inLampiran, 'change', function() {	
		sendImage(inLampiran, username);
	});

	jcEvent(btnEmoji, 'click', function() {
		let frmaeEmoji = query("#__jc_chat__ .frame-emoji");
		frmaeEmoji.classList.toggle('frame-emoji-show');

		let dv = newTag('div');
			dv.classList.add('list-emoji');
	});
}
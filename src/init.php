<?php

$reqURI 		= $_SERVER["REQUEST_URI"];
$reqURI 		= explode("/", $reqURI);
array_pop($reqURI);

$reqURI 		= implode("/", $reqURI) . "/";

$path_assets 	= explode( str_replace('/', '\\', $reqURI), dirname(__FILE__) );
$path_assets 	= str_replace('\\', '/', end($path_assets) ) . "/assets";

/* ---------------------------------------------------------------------------- * Load font awesome
*/
echo '
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
';

/* ----------------------------------------------------------------------------
 * CSS Emoji
*/
echo "<style>";
require ( dirname(__FILE__) . "/assets/css/jc_booster.rooter.css" );
require ( dirname(__FILE__) . "/assets/css/jc_booster.css" );
require ( dirname(__FILE__) . "/assets/css/animate.css" );
require ( dirname(__FILE__) . "/assets/css/style.css" );
echo "</style>";

echo '<script>';
require ( dirname(__FILE__) . "/assets/js/jc_booster.js" );
echo '</script>';

/* ----------------------------------------------------------------------------
 * CSS Emoji
*/
$path_emo 	= $path_assets . "/emoji/peoples/";
$emoUri 	= glob($path_emo . "*.png");

echo '<style>';
foreach( $emoUri as $emo ) {
	$cls = explode("/", $emo);
	$cls = explode( ".", end($cls) );
	$cls = $cls[0];

	$css_bg = str_replace($path_assets, "..", $emo);
	echo '
		#__jc_chat__ .frame-emoji-show .emoji-'. $cls .' {
			background: url('. $emo .') center center / contain;
		}
		#__jc_chat__ #chat-text .emoji-'. $cls .' {
			background: url('. $emo .') center center / contain;
		}
	';	
}
echo '</style>';


/* first tag primary */
echo '<div id="__jc_chat__">';

/* frame chat */
echo '<div class="frame_jc_chat animated fadeIn faster" id="frame_jc_chat">';

require ( dirname(__FILE__) . "/assets/onready.html" );


/* content on chat */
echo '
<div class="on_start_chat on_hide_chat animated fadeIn faster">
	<section class="header_chat">
		<div class="row">
			<div class="col-12">
				<h2 color="white">Live Chat</h2>
			</div>
		</div>
	</section>
	<section class="body_chat">
		<div class="frame-chat" id="frame-chat"></div>
	</section>
	<section class="footer_chat">
';

/* frame emoji */
echo '<div class="frame-emoji">';

/* load emoji */
$path_emo 	= $path_assets . "/emoji/peoples/";
$emoUri 	= glob($path_emo . "*.png");
foreach( $emoUri as $emo ) {
	$cls = explode("/", $emo);
	$cls = explode( ".", end($cls) );
	$cls = $cls[0];
	echo '<span class="emoji emoji-'. $cls .'" data-src="'.$emo.'"></span>';
}

/* end frame emoji*/
echo '</div>';

echo '
		<div class="input-group">
			<div type="text" id="chat-text" class="input-control input-control-lg"></div>
			<label for="in-lampiran" class="opt-chat"><i class="fas fa-unlink dropdown-toggle"></i></label>
			<input type="file" id="in-lampiran" class="input-control" hidden>
			<span class="opt-chat" id="btn-emoji"><i class="far fa-grin"></i></span>
			<span class="opt-chat" id="send_jc_chat"><i class="fas fa-paper-plane"></i></span>
		</div>
	</section>	
</div>
';

/* end frame chat */
echo '</div>';

/* button fixed */
echo '
<div class="button_menu_chat">
	<button class="btn btn-secondary" id="jc_chat_btn_toggleFrame"><i class="fas fa-comment-alt"></i></button>
</div>
';

/* ending tag primary */
echo '</div>';

echo "<script>";
require ( dirname(__FILE__) . "/assets/js/jc_booster.function.js" );
require ( dirname(__FILE__) . "/assets/js/jc_booster.socket.js" );
require ( dirname(__FILE__) . "/assets/js/socket_chat.js" );
echo "</script>";
/**
 * A jQuery plugin to display twitter author with their last tweet in the vcard
 * format.
 * 
 * @author JeanMichel FRANCOIS aka toutpt
 * @date 2012-12-17
 * @version 0.1
 * 
 * @license Copyright (c) 2012, JeanMichel FRANCOIS
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
;
(function($) {

$.fn.extend({
	twittervcard: function(options) {
		var username = undefined;
		var baseurl = "https://twitter.com/users/%s.json?callback=jQuery.twittervcardcallback";
		return this.each(function() {
			username = $(this).attr('href').split('/')[3];
			var url = baseurl.replace('%s', username);
			var script = document.createElement( 'script' );
			script.type = 'text/javascript';
			script.src = url;
			$(this).append( script );
		});
	}
});
$.extend({
	twittervcardcallback: function(data){
		/**
		 * <blockquote class="twitter-tweet" data-in-reply-to="TWEET_ID">
		 *   TWEET
		 *   &mdash; FULLNAME (@SCREEN_NAME)
		 *   <a href="TWEET_URI" data-datetime="2012-12-18T04:13:24+00:00">December 18, 2012</a>
		 * </blockquote>
		 * <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
		 * */
		var blockquote = document.createElement('blockquote');
		$(blockquote).addClass('twitter-tweet');

		var name = document.createTextNode("&mdash; " + data['name'] + ' (@' + data['screen_name'] + ')');
		if (data['status'] != undefined){
			if (data['status']['in_reply_to']){
				$(blockquote).attr('data-in-reply-to', data['status']['in_reply_to']);
			}
			var anchor = document.createElement('a');
			$(anchor).attr('href', "https://twitter.com/" + data['screen_name'] + '/status/' + data['status']['id_str']);
			var dt = new Date(Date.parse(data['status']['created_at']));
			var datetimestr = '' + dt.getFullYear() + '-' + ("0" + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + 'T' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + 'Z'
			$(anchor).addClass('timeago').attr('data-datetime', datetimestr).text(data['status']['created_at']);

			//Add timeago support
			if(jQuery().timeago) {
				$(anchor).timeago();
			}

			var tweet = document.createTextNode(twttr.txt.autoLink(data['status']['text']));
			//Lets add the content= tweet + name + link
			blockquote.appendChild(tweet);
			blockquote.appendChild(name);
			blockquote.appendChild(anchor);
		};

		var selector = 'a.twittervcard[href$="'+data['screen_name']+'"]';
		$(selector).replaceWith(blockquote);

	}
});

})(jQuery);
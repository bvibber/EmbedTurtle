(function() {

var parent = window.parent;

/**
 * Receive messages from parent window and pass them on.
 * Messages will contain an 'event' parameter with a string key,
 * events on document will be fired in the form 'EmbedSandbox:foo'
 * where foo is the event key.
 */
$(window).bind('message', function(event) {
	var src = event.originalEvent.source,
		msg = event.originalEvent.data;
	if (src !== window.parent) {
		// not from the iframe's parent; ignore
		return;
	}
	var key = '[MediaWiki:EmbedSandbox]';
	if (msg.substr(0, key.length) !== key) {
		// not from our iframe's protocol; ignore
		console.log('Ignoring message: ' + msg);
		return;
	}
	var data = JSON.parse(msg.substr(key.length));
	if ('event' in data && typeof data.event === 'string') {
		$(document).trigger('EmbedSandbox:' + data.event, data);
	}
});

})();

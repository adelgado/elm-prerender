/* global Elm */
const make = function make(localRuntime) {
	localRuntime.Native = localRuntime.Native || {}
	localRuntime.Native.Renderer = localRuntime.Native.Renderer || {}

	const toHtml = require('vdom-to-html')

	return {
		'toHtml': toHtml
	}
}

Elm.Native = Elm.Native || {}
Elm.Native.Renderer = Elm.Native.Renderer || {}
Elm.Native.Renderer.make = make

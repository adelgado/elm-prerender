export default function (options) {
	const {imports, ports} = options

	return `
module Renderer where
import Html exposing (Html)
import Native.Renderer

${imports}

render : Html -> String
render = Native.Renderer.toHtml

${ports}`
}

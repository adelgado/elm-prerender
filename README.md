# elm-prerender

Proof of concept static site generator from Elm files.

## Hacking

After cloning the repo and moving inside its folder run

```bash
npm install
elm-package install
```


## Example

To see an example, run

```bash
npm run build
node dist/convert.js --input-folder input/ --output-folder output/
```

This will take the Elm files from `input/` and convert them to static views in the `output/` folder.

## How it works

elm-prerender goes through the input folder and looks for Elm files. To be
turned into compiled output, file needs to have a `view =` defining the output.

Either way, right now, if you're using the example folder, you need a
`view : Html`. This is your entry point. This `Html` will be rendered as
actual HTML into a file with the same name, but lowercase.
E.g. `Index.elm -> index.html`, `Blog.Index.elm` -> `blog/index.html`.

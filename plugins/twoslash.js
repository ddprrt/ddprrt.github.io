// @ts-check

const { createShikiHighlighter, renderCodeToHTML, runTwoSlash } = require("shiki-twoslash")

/**
 * 
 * @param {import("markdown-it")} markdownit 
 * @param {*} userOptions 
 */
function markdownItShikiTwoslash(markdownit, userOptions) {
  /** @type {import("shiki/dist/highlighter").Highlighter} */
  let highlighter = null
  // @ts-ignore - fixed in next release to always be a promise
  createShikiHighlighter(userOptions).then(h => highlighter = h)

  const oldFence = markdownit.renderer.rules.fence;
  if (!oldFence) throw new Error("No fence set");

  // The highlighter API doesn't get the info in the codeblocks,
  // so we extract any info references and drop it into the language
  // which means it can be picked up below
  markdownit.renderer.rules.fence = (...args) => {
    const tokens = args[0];
    const idx = args[1];
    const token = tokens[idx];

    if (token.info) {
      const infos = token.info.split(/\s+/g)
      token.info = infos.length === 1 ? token.info : infos[0] + "%%%" + infos.join("|");
    }
    const theirs = oldFence(...args);
    return theirs;
  };

  // Look for a info in the language, and use that to run the sample
  markdownit.options.highlight = function (_text, _lang) {
    const hasTwoslash = _lang.includes("%%%") && _lang.includes("twoslash")
    let lang = _lang.split("%%%")[0]
    let info = _lang.split("%%%")[1] ? _lang.split("%%%")[1].split("|") : []
    let code = _text

    /** @type{ import("@typescript/twoslash").TwoSlashReturn | undefined } */
    let twoslashResults = undefined

    if (hasTwoslash) {
      twoslashResults = runTwoSlash(code, lang)
      code = twoslashResults.code
      lang = twoslashResults.extension
    }

    const results = renderCodeToHTML(code, lang, info ,{}, highlighter, twoslashResults)
    return results
  };
}

module.exports = markdownItShikiTwoslash

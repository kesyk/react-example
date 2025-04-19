(() => {
  const jscriptVersion = new Function(
    '/*@cc_on return @_jscript_version; @*/'
  )()

  if (jscriptVersion !== undefined) {
    if (window.location.pathname.indexOf('unsupported-browser') === -1)
      window.location.replace('/unsupported-browser')
  }
})()

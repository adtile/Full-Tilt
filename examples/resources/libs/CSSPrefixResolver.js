var cssPropNamePrefixes = ['O', 'MS', 'Moz', 'Webkit'];

function getCSSPropertyName(cssDefaultPropName) {
  var cssPropNameSuffix = '';
  var propNameParts = cssDefaultPropName.split('-');
  for(var i = 0, l = propNameParts.length; i< l; i++) {
    cssPropNameSuffix += propNameParts[i].charAt(0).toUpperCase() + propNameParts[i].slice(1);
  }

  var el = document.createElement('div');
  var style = el.style;
  for (var i = 0, l = cssPropNamePrefixes.length; i < l; i++) {
    var cssPrefixedPropName = cssPropNamePrefixes[i] + cssPropNameSuffix;
    if( style[ cssPrefixedPropName ] !== undefined ) {
      return cssPrefixedPropName;
    }
  }
  return cssDefaultPropName; // fallback to standard prop name
}

// Usage:
//var transformCSSPropName = getCSSPropertyName('transform');

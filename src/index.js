/**
 * A Turbopack loader to import SVG as optimized data URI with dimensions.
 * Exported object has the same shape as next/image's static import: {src, width, height}.
 *
 * Written in CommonJS format for Turbopack compatibility.
 * Otherwise getting error: "require() of ES Module xxx not supported."
 *
 * Uses:
 * - svgo: to optimize the SVG content
 * - mini-svg-data-uri: to convert optimized SVG to a minimal data URI (better than svgo's built-in datauri)
 * - image-size: to get the width and height of SVG
 */

const { optimize } = require('svgo');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { imageSize } = require('image-size');

module.exports = function (content) {
  this.cacheable?.();

  const optimized = optimize(content);
  const src = svgToMiniDataURI(optimized.data);
  const { width, height } = imageSize(Buffer.from(content));
  const result = { src, width, height };

  return `export default ${JSON.stringify(result)};`;
};

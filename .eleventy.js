const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ['avif', 'jpeg'],
    outputDir: './dist/img/',
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(lazyImages, {})
  function lazyImages(eleventyConfig, userOptions = {}) {
    const { parse } = require('node-html-parser')

    const options = {
      name: 'lazy-images',
      ...userOptions
    }

    eleventyConfig.addTransform(options.extensions, (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        const root = parse(content);
        const images = root.querySelectorAll('img');
        images.forEach((img) => {
          img.setAttribute('loading', 'lazy')
        })
        return root.toString()
      }
      return content;
    })
  }
  eleventyConfig.addPassthroughCopy({
    'src/robots.txt': 'robots.txt',
  });
  eleventyConfig.addPassthroughCopy("src/flash.js");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/font");//
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};

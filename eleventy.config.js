module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addGlobalData("siteUrl", "https://ohyuk1220-glitch.github.io");
  eleventyConfig.addGlobalData("siteName", "과학 한 모금");
  eleventyConfig.addGlobalData(
    "siteDescription",
    "매일의 과학을 한 모금씩. 오늘의 과학 뉴스를 쉽고 깊게 풀어드립니다."
  );
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

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

  // 본문의 어려운 용어(콜아웃에 설명된 것)에 형광펜(mark) — 아래 설명 박스와 시각 매치
  eleventyConfig.addTransform("highlightTerms", function (content) {
    const outputPath = this.page.outputPath || "";
    if (!outputPath.endsWith(".html")) return content;
    const terms = [];
    content.replace(
      /<aside class="callout">[\s\S]*?<strong>([^<]+)<\/strong>/g,
      function (m, t) {
        terms.push(t.trim());
        return m;
      }
    );
    if (!terms.length) return content;
    return content.replace(
      /<div class="article-body">([\s\S]*?)<\/div>/,
      function (whole, body) {
        const asides = [];
        let b = body.replace(/<aside[\s\S]*?<\/aside>/g, function (a) {
          asides.push(a);
          return "@@ASIDE" + (asides.length - 1) + "@@";
        });
        terms.forEach(function (term) {
          const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          b = b.replace(new RegExp("('?)(" + esc + ")('?)"), "<mark>$1$2$3</mark>");
        });
        b = b.replace(/@@ASIDE(\d+)@@/g, function (mm, i) {
          return asides[Number(i)];
        });
        return '<div class="article-body">' + b + "</div>";
      }
    );
  });

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

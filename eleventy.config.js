module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addGlobalData("siteUrl", "https://ohyuk1220-glitch.github.io");
  eleventyConfig.addGlobalData("siteName", "과학 한 모금");
  eleventyConfig.addGlobalData(
    "siteDescription",
    "과학을 한 모금씩 쉽게 알아봐요. 오늘의 과학 뉴스를 깊이 있게 풀어드립니다."
  );

  // RSS·sitemap용 통합 컬렉션 = 뉴스레터(post) + 기사 돋보기(deepdive), 날짜 내림차순.
  // 돋보기도 독자 발견 경로(RSS·검색)에 실려야 "화수금토" 리듬이 구독앱에 보인다.
  eleventyConfig.addCollection("feed", function (api) {
    return api
      .getFilteredByTag("post")
      .concat(api.getFilteredByTag("deepdive"))
      .sort((a, b) => b.date - a.date);
  });

  // RSS의 pubDate는 RFC-822 형식이어야 함 (예: "Mon, 07 Jul 2026 00:00:00 GMT").
  // 플러그인 없이 JS Date.toUTCString()으로 처리.
  eleventyConfig.addFilter("rfc822", function (d) {
    return new Date(d).toUTCString();
  });

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

  // "이 날의 다른 소식" 섹션(h2부터 본문 끝까지)을 배경 박스로 감싸 메인과 구분
  eleventyConfig.addTransform("wrapOtherNews", function (content) {
    const outputPath = this.page.outputPath || "";
    if (!outputPath.endsWith(".html")) return content;
    return content.replace(
      /(<h2[^>]*>[^<]*이 날의 다른 소식[\s\S]*?)(<\/div>)/,
      '<div class="other-news">$1</div>$2'
    );
  });

  // draft: true → 배포(build)에서 제외되어 공개 사이트에 안 뜸. 로컬 serve에선 보임.
  eleventyConfig.addPreprocessor("drafts", "njk,md", function (data) {
    if (data.draft === true && process.env.ELEVENTY_RUN_MODE !== "serve") {
      return false;
    }
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

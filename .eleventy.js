module.exports = function(eleventyConfig) {
  // パススルーコピー：画像とCSSをそのままコピー
  eleventyConfig.addPassthroughCopy("posts");
  eleventyConfig.addPassthroughCopy({ "static/css": "css" });
  eleventyConfig.addPassthroughCopy({ "static/js": "js" });

  // ▼ カテゴリごとのコレクションを作成する
  eleventyConfig.addCollection("categories", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("./posts/**/*.md");

    // カテゴリごとに振り分け
    const categoryMap = {};

    posts.forEach(post => {
      const category = post.data.category || "uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(post);
    });

    // { name, items } の配列で返す
    return Object.entries(categoryMap).map(([name, items]) => {
      return { name, items };
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk"
  };
};

// Util function to get all posts
export default function getAllPosts() {
  /* 
   * Credit to get all posts:
   * https://blog.johnnyreilly.com/2021/05/01/blog-archive-for-docusaurus/
   */
  return ((ctx) => {
    const blogpostNames = ctx.keys();
    return blogpostNames.reduce((blogposts, blogpostName) => {
      const module = ctx(blogpostName);
      const { image } = module.frontMatter
      const { date, formattedDate, title, permalink, authors, description, tags } = module.metadata;
      return [
        ...blogposts,
        {
          date,
          formattedDate,
          title,
          permalink,
          authors,
          image,
          description,
          tags
        },
      ];
    }, ([]));
  })(require.context('../../blog', true, /.md/));
}

import { fetchArticlesByTypePersistedQuery, buildHeadlessApiURL } from '../../scripts/headless-client.js';

export default async function decorate(block) {
  const queryParamValue = 'consumers:corporate-site';

  const headlessApiURL = buildHeadlessApiURL();
  console.log(`Using AEM Headless API URL:${headlessApiURL}`);

  const articlesData = await fetchArticlesByTypePersistedQuery(headlessApiURL, queryParamValue).then(
    ({ data, err }) => {
      if (err) {
        console.log("Error while fetching data");
      } else if (data?.newsArticleList?.items.length === 1) {
        const articlesData = data.newsArticleList;
        console.log(articlesData);
        return articlesData;
      } else {
        console.log(`Cannot find navigation with name: ${queryParamValue}`);
        return null;
      }
    }
  );

  block.textContent = '';

  const articles = [];
  
  if (articlesData != null) {

    articlesData.items.children.forEach((a, i) => {
      if (a) {
        const article = document.createElement('article');

        const articleLink = document.createElement('a');
        articleLink.href = a.slug;
        articleLink.title = a.title;
        articleLink.innerText = a.title;
        article.prepend(articleLink);

        articles.push(article);
      }
    });
  }

  const articleListWrapper = document.createElement('div');
  articleListWrapper.className = 'article-list-wrapper';
  articleListWrapper.append(articles);
  block.append(articleListWrapper);
}

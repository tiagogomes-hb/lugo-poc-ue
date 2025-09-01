import { fetchArticlesByTypePersistedQuery, buildHeadlessApiURL } from '../../scripts/headless-client.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const queryParamValue = 'consumers:corporate-site';

  const headlessApiURL = buildHeadlessApiURL();
  console.log(`Using AEM Headless API URL:${headlessApiURL}`);

  const articlesData = await fetchArticlesByTypePersistedQuery(headlessApiURL, queryParamValue).then(
    ({ data, err }) => {
      if (err) {
        console.log("Error while fetching data");
      } else if (data?.newsArticleList?.items.length > 0) {
        const articlesData = data.newsArticleList;
        console.log(articlesData);
        return articlesData;
      } else {
        console.log(`Cannot find articles with type: ${queryParamValue}`);
        return null;
      }
    }
  );

  const articleListWrapper = document.createElement('div');
  articleListWrapper.className = 'list-wrapper';
  block.textContent = '';

  if (articlesData != null) {

    articlesData.items.forEach((a, i) => {
      if (a) {
        const article = document.createElement('article');
        article.className = 'article-list-item';
        article.setAttribute("data-aue-resource", "urn:aemconnection:" + a._path + "/jcr:content/data/master");
        article.setAttribute("data-aue-type", "reference");
        article.setAttribute("data-aue-filter", "cf");
        article.setAttribute("data-aue-label", a.slug);
        
        const articleLink = document.createElement('a');
        articleLink.href = a.slug;
        articleLink.title = a.title;
        articleLink.innerText = a.title;
        articleLink.setAttribute("data-aue-prop", "title")
        article.prepend(articleLink);

        if (a.verticalImage) {
          const optimizedPic = createOptimizedPicture(a.verticalImage._publishUrl, a.title, false, [{ width: a.verticalImage.width }], true);
          optimizedPic.setAttribute("data-aue-prop", "verticalImage");
          optimizedPic.setAttribute("data-aue-type", "media");
          article.prepend(optimizedPic);
        }

        articleListWrapper.append(article);
      }
    });
  }
  
  block.append(articleListWrapper);
}

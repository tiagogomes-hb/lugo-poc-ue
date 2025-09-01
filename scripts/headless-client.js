// Defines the Headless Service object w/ properties
const aemHeadlessService = {
  proxyHost: "http://localhost:8010/proxy",
  authorHost: "https://author-p155902-e1649417.adobeaemcloud.com",
  publishHost: "https://publish-p155902-e1649417.adobeaemcloud.com",
  graphqlAPIEndpoint: "graphql/execute.json",
  projectName: "lugo-poc-hb",
  navigationPersistedQueryName: "corporate-navigation",
  articlesListPersistedQueryName: "all-articles",
  queryParamName: "name",
};

//AEM credentials object if connecting to AEM-Author Service, not needed for publish service
const aemCredentials = {
  username: "admin",
  password: "admin",
};

function buildFetchOptions() {
  let fetchOptions;

  if (aemCredentials.username && aemCredentials.password) {
    const credentials = btoa(
      `${aemCredentials.username}:${aemCredentials.password}`
    );

    fetchOptions = {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    };
  }

  return fetchOptions;
}

export async function fetchNavigationByNamePersistedQuery(headlessApiURL, queryParamValue) {
  let data;
  let err;

  //encode URI params
  const encodedParam = encodeURIComponent(
    `;${aemHeadlessService.queryParamName}=${queryParamValue}`
  );

  const fetchOptions = buildFetchOptions();

  try {
    // Make XHR call to AEM
    const response = await fetch(
      `${headlessApiURL}/${aemHeadlessService.navigationPersistedQueryName}${encodedParam}`,
      fetchOptions
    );

    if (!response.ok) {
      console.log('ERROR:Could not load data from AEM');
    }

    // Get JSON response
    const responseData = await response.json();

    // The GraphQL data is stored on the response's data field
    data = responseData?.data;
    
  } catch (e) {
    // An error occurred, return the error messages
    err = e;
    console.error(e);
  }

  return { data, err };
}

export async function fetchArticlesByTypePersistedQuery(headlessApiURL, queryParamValue) {
  let data;
  let err;

  //encode URI params
  const encodedParam = encodeURIComponent(
    `;${aemHeadlessService.queryParamName}=${queryParamValue}`
  );

  const fetchOptions = buildFetchOptions();

  try {
    // Make XHR call to AEM
    const response = await fetch(
      `${headlessApiURL}/${aemHeadlessService.articlesListPersistedQueryName}${encodedParam}`,
      fetchOptions
    );

    if (!response.ok) {
      console.log('ERROR:Could not load data from AEM');
    }

    // Get JSON response
    const responseData = await response.json();

    // The GraphQL data is stored on the response's data field
    data = responseData?.data;
    
  } catch (e) {
    // An error occurred, return the error messages
    err = e;
    console.error(e);
  }

  return { data, err };
}

export function buildHeadlessApiURL(host) {
  let headlessApiURL = "";

  // If host is passed via Custom Element attribute, else use default value from 'aemHeadlessService.aemHost'
  if (host) {
    headlessApiURL = [
      host,
      aemHeadlessService.graphqlAPIEndpoint,
      aemHeadlessService.projectName,
    ].join("/");
  } else {
    host = typeof UniversalEditorEmbedded !== 'undefined' ? aemHeadlessService.authorHost: aemHeadlessService.publishHost;
    host = typeof LiveReload !== 'undefined' ? aemHeadlessService.proxyHost: host;
    headlessApiURL = [
      host,
      aemHeadlessService.graphqlAPIEndpoint,
      aemHeadlessService.projectName,
    ].join("/");
  }

  return headlessApiURL;
}
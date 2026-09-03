export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = `https://codeflow-api.gtau22609.workers.dev${url.pathname}${url.search}`;
  const proxyRequest = new Request(targetUrl, context.request);
  return fetch(proxyRequest);
}

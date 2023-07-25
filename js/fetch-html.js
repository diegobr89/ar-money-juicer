const CORS_PROXY_URL = 'https://corsproxy.io/'

export class FetchHtml {

	static async fetchText(url, method = 'get', headers = {}, payload = ''){
		// const fetchUrl = new URL(CORS_PROXY_URL);
		// fetchUrl.searchParams.append(url, '');

		const fetchUrl =`${CORS_PROXY_URL}?${encodeURIComponent(url)}`
    const requestInfo = new Request(fetchUrl, { method, headers });
		return fetch(requestInfo);
	}

	static async fetchDocument(url, method = 'GET', headers = {}, payload = ''){
		const response = await this.fetchText(url, method, headers, payload);
		const html = await response.text();
		return new DOMParser().parseFromString(html, "text/html");
	}
}
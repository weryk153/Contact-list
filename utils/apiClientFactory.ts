import axios from 'axios';
import { Agent } from 'https';
import { throttleAdapterEnhancer } from 'axios-extensions';
import { getEnv } from './env';

// ------------------------------------------------
// Lets Encrypt 的免費 SSL 憑證在 2021/10/01 全面升級至 Root X1
// 但在舊版的 node 環境下，會完全認不得這個慿證，會直接造成所有 API 呼叫一律發生 `certificate has expired` 錯誤
// 只能將 Lets Encrypt X1 的 CA 憑證放入 axios 中
//
// 參考來源:
// https://stackoverflow.com/questions/69414479/giving-axios-letsencrypts-new-root-certificate-on-old-version-of-node
// ------------------------------------------------
const ISRGCAs = [
  `-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----`,
];
const agent = new Agent({ ca: ISRGCAs });

// throttleAdapterEnhancer: throttle requests most once per threshold "milliseconds"
// from https://github.com/kuitos/axios-extensions

const DEFAULT_PROJECT_NAME = 'fe-lobby';
const THRESHOLD_MS = 50 * 1000; // current sync interval is 60s
const AnueNetwork = anue.shared.get('library.net');

// create a network client which returns similar structural data as axios.
AnueNetwork.addResponseInterceptor((req, res, extra) => {
  let customRes = res || {};

  if (typeof res === 'string') {
    customRes = { responseText: res };
  }
  customRes.nativeStatus = extra.status || 4999;

  return customRes;
});

export const anueNetworkClient = (apiUrlName: string) => {
  const host = getEnv(apiUrlName) || '';

  return async function anueNetworkClient<T = any>(options): Promise<ProxyAPIResponse<T>> {
    options.url = host + options.url.replace('^/+', '');
    options.auth = options.auth || true;
    options.agent = agent;

    if (options.params) {
      const paramList = [];
      const params = options.params;

      for (const p in params) {
        paramList.push(`${p}=${params[p]}`);
      }

      options.url += `?${paramList.join('&')}`;
    }

    if (options.data) {
      options.body = options.data;
    }

    const result = await AnueNetwork.getDriver().send<ProxyAPIResponse<T>>(options);

    return { data: result, status: result.nativeStatus };
  };
};

interface IApiClientOptions {
  hostname?: string;
  projectName?: string;
  useCustomHeader?: boolean;
}

export function apiClientFactory(
  defaultConfig,
  { hostname = '', projectName = DEFAULT_PROJECT_NAME, useCustomHeader = true }: IApiClientOptions = {}
) {
  const userAgentHeader = {};
  const common = {};

  if (typeof window === 'undefined' || (typeof __SERVER__ !== 'undefined' && __SERVER__)) {
    const agentUa = 'axios';
    const ua = `${agentUa} ${projectName} ${hostname}`;

    userAgentHeader['User-Agent'] = ua;
  }

  // custom header: https://cnyesrd.atlassian.net/wiki/spaces/PS/pages/689438767/API
  if (useCustomHeader) {
    common['X-System-Kind'] = 'LOBBY';
    common['X-platform'] = 'WEB';
  }

  const client = axios.create({
    headers: {
      ...userAgentHeader,
      ...defaultConfig.headers,
      ...common,
    },
    httpsAgent: agent,
    adapter: throttleAdapterEnhancer(axios.defaults.adapter, {
      threshold: THRESHOLD_MS,
    }),
    ...defaultConfig,
  });

  client.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * @param {string} apiUrlName apiUrl | reuterApiUrl
 * @returns instance of axios
 */
function getAPIClient(apiUrlName?: string, useCustomHeader: boolean = true) {
  const defaultApiUrl = typeof window === 'undefined' ? getEnv('apiUrl') : '/';

  return apiClientFactory(
    {
      baseURL: apiUrlName ? getEnv(apiUrlName) : defaultApiUrl,
    },
    {
      useCustomHeader,
    }
  );
}

export default getAPIClient;

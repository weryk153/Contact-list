/**
 * deprecated api list
 *
 * GETnewsListByCategory -> getNewsListByCategory
 */
import { getEnv } from 'utils/env';
import getAPIClient, { anueNetworkClient } from './apiClientFactory';
import { AxiosResponse } from 'axios';
import UniversalProps from 'constant/universal-props';

const apiClient = getAPIClient('apiUrl');
const cnyesAuthClient = anueNetworkClient('apiUrl');
const reuterApiClient = getAPIClient('reuterApiUrl');
const videoApiClient = getAPIClient('videoApiUrl');
const driverApiClient = getAPIClient('driverApiUrl');
const snsApiClient = getAPIClient('snsApiUrl');
const videoApiClientWithAuth = anueNetworkClient('videoApiUrl');
const marApiClientWithAuth = anueNetworkClient('memberAlwaysRightApiUrl');
const memApiClientWithAuth = anueNetworkClient('memberApiUrl');
const haoApiClient = getAPIClient('haoApiUrl', false);
const paymentApiClient = getAPIClient('paymentApiUrl');
const searchApiClient = getAPIClient('searchApiUrl');
const fundApiClient = getAPIClient('fundApiUrl');
const marketApiClient = getAPIClient('marketInfoApiUrl');
const oauthApiClientWithAuth = anueNetworkClient('oauthApiUrl');
const subscribeApiClient = getAPIClient('subscribeApiUrl');
const subscribeApiClientWithAuth = anueNetworkClient('subscribeApiUrl');
const anueSecUrlClient = getAPIClient('anueSecUrl');

import { anueSearchAllCategory } from './linkFactory';

interface GETv1HKStockArticlesByColumnistResponse {
  news: PagedData<Columnist.Article>;
  columnists: Columnist.Profile;
}

export async function GETv1HKStockArticlesByColumnist(
  columnistId: number
): Promise<AxiosResponse<GeneralResponse<GETv1HKStockArticlesByColumnistResponse>>> {
  const url = `/media/api/v1/newslist/columnist/${columnistId}`;

  return apiClient.get(url);
}

export async function GETv1VideoOrderBySn(orderSn: string) {
  const resp = await videoApiClientWithAuth<APIResponse.Response<AnueVideo.OrderDetail>>({
    url: `/video/api/v1/orders/${orderSn}`,
  });

  if (resp.status > 399) {
    throw resp;
  }
  return resp;
}

export async function GETv1NewebpayInvoice(orderSn: string) {
  const params = {
    params: {
      orderSn,
    },
  };

  const result = await paymentApiClient.get<APIResponse.Response<AnueVideo.OrderInvoiceResponse>>(
    '/gateway/api/v1/newebpay/invoice',
    params
  );

  if (result.status > 399) {
    throw result;
  } else {
    window.open(
      `/static/invoice.html?MerchantID_=${result.data.items.merchantId}&PostData_=${result.data.items.postData}`,
      '_blank'
    );
  }
}

/**
 * @param {string} resolution 即時(1) / 分(5) /日(D) / 週(W) / 月(M)
 * @param {string} symbol 台股(TWS:0050:STOCK) / 台股興櫃(TWG:1260:STOCK) / 台股指數(TWS:TSE01:INDEX) / 陸股(CNS:601318:STOCK) / 港股(HKS:0700:STOCK) / 美股(USS:GOOGL:STOCK) / 國際指數(GI:SP500 ) / 期貨(GI:DJCIBR) / 外匯(FX:USDTWD)
 * @param {number} from timestamp
 * @param {number} to timestamp
 * @param {bool} quote api response include quote data or not
 * @param {bool} compress compress
 * @returns {Promise}
 */
export function GETchartingHistoryBySymbol({ resolution, symbol, from, to, quote, compress }: DataFeedRequestBarArgs) {
  const url = '/ws/api/v1/charting/history';
  const params = {
    resolution,
    symbol,
    from,
    to,
    quote,
    compress,
  };

  return reuterApiClient.get<GeneralFigureResponse<ChartUIProps>>(url, {
    params,
  });
}

export function GETVideoBannersV1() {
  return videoApiClient.get('/video/api/v1/banners', {
    params: {
      type: 1,
    },
  });
}

/**
 * @param enable: 0 | 1
 * 篩選是否在前台顯示的分類{0:否|1:是}
 */
export function GETVideoAllCategory() {
  return videoApiClient.get('/video/api/v1/categories?enable=1');
}

/**
 * @param {AnueVideo.CategoryCode} category 影音類別代碼
 */
export function GETVideoCategoryV1(category, { page = 1, limit = 20 }) {
  return videoApiClient.get(`/video/api/v1/video/category/${category}`, {
    params: {
      page,
      limit,
    },
  });
}

/**
 * @param {number} type Video設定類型,預設為1 {1:熱門}
 * https://api.beta.cnyes.cool/video/api/v1/video/settings?type=1
 */
export function GETVideoSettingsV1(type) {
  return videoApiClient.get('/video/api/v1/video/settings', {
    params: {
      type,
    },
  });
}

/**
 * 取得不分類的所有影片列表(依發布時間降冪排序), 指定時間區間不超過兩個月
 * @return {void} []
 */
export function GETVideosV1({ start = null, end = null, page = 1, limit = 6 } = {}) {
  const now = new Date();
  const endAt = end || now.getTime();
  const startAt = start || now.setDate(now.getDate() - 30); // query 1 month to make sure enough news during Chinese new year
  const params = {
    start_at: startAt,
    end_at: Math.floor(endAt / 1000),
    page,
    limit,
  };

  return videoApiClient.get('/video/api/v1/videos', { params });
}

/**
 * @param {number} id 影音ID
 * @returns {Promise}
 */
export function GETVideoV1(id) {
  return videoApiClient.get(`/video/api/v1/video/${id}`);
}

// 透過url取得標籤
export async function GETTagByUrl(host, originalUrl) {
  const url = !originalUrl ? `${host}${originalUrl}` : host;
  return await apiClient.get(`/media/api/v1/url/tag?url=${url}`);
}

// 透過visitorId取得標籤
export function GETTagByVisitorId(visitorId) {
  return apiClient.get(`/media/api/v1/visitor/tag?visitorId=${visitorId}`);
}

// 取得visitorId
export async function GETAnalytics(params = {}) {
  return await apiClient.get('https://analytics.prod.jpp.cnyes.cool/visitorid.php', params);
}

// 影音課程全部影片列表
export function GETVideoAllCourses({ page = 1, limit = 20 }) {
  return videoApiClient.get('video/api/v1/courses/list', {
    params: {
      page,
      limit,
      course_source: 'MDBS',
    },
  });
}

// 首頁顯示課程的列表
export function GETHomeVideoCourses() {
  return videoApiClient.get('/video/api/v1/courses');
}

/**
 * 影音課程的單一課程內容
 * @param {number} courseId 課程ID
 */
export function GETVideoCourseContent(courseId) {
  return videoApiClientWithAuth({
    method: 'GET',
    url: `/video/api/v1/courses/${courseId}`,
    auth: true,
  });
}

/**
 * 影音課程單一教材內容 AUTH
 * @param {string} courseId 課程ID
 * @param {string} lectureId 教材ID
 */
export function GETVideoCourseLecture(courseId, lectureId) {
  return videoApiClientWithAuth({
    method: 'GET',
    url: `/video/api/v1/courses/${courseId}/lectures/${lectureId}`,
    auth: true,
  });
}

/**
 * 建立訂單取得付款參數
 * @param {string} returnEnv map to redirect url base on current environment
    localInt:   https://dev.int.cnyes.cool
    localBeta:  https://dev.beta.cnyes.cool
    int:        https://www.int.cnyes.cool
    beta:       https://www.beta.cnyes.cool
    gamma:      https://www.gamma.cnyes.cool
    stage:      https://www.stage.cnyes.cool
    prod:       https://www.cnyes.com
 */
export async function POSTv1Orders(courseId: string, payment: AnuePayment.VideoPaymentContext, productUrlOfVideo: string = '') {
  let params = {
    course_id: courseId,
    payment,
    return_env: getEnv('sentryEnvironment'),
  };

  if (productUrlOfVideo.length !== 0) {
    params = {
      ...params,
      subscribe_url: productUrlOfVideo,
    };
  }

  return videoApiClientWithAuth<APIResponse.Response<AnuePayment.PaymentGateway>>({
    method: 'POST',
    url: 'video/api/v1/orders',
    auth: true,
    body: params,
  });
}

export const WEBVIEW_RETURN_PATH_FROM_NEWEBAPY = '/member/subscription/webview';
export const MEMBERSHIP_PAID_RETURN_URL = '/member/subscription/ord_complete';

export async function POSTv1MembershipOrders({ productId, ubn, isWebView }: AnuePayment.CreateCnyesOrderProps) {
  const returnUrl =
    typeof window !== 'undefined' && isWebView
      ? `${location.protocol}//${location.host}${WEBVIEW_RETURN_PATH_FROM_NEWEBAPY}`
      : `${location.protocol}//${location.host}${MEMBERSHIP_PAID_RETURN_URL}`;

  return cnyesAuthClient<APIResponse.Response<AnuePayment.MembershipPaymentGateway>>({
    method: 'POST',
    url: '/media/api/v1/subscribe/order',
    auth: true,
    body: {
      productId,
      returnUrl,
      ubn,
    },
  });
}

export function GETProductTrialInfo(productId: Membership.MembershipLv) {
  // TODO: Update the the path below if the backend supports more productId. Now level2 is the only product.
  // const url = `/media/api/v1/subscribe/${'level2' || productId}/trial`;
  const url = `/media/api/v1/subscribe/${productId || 'level2'}/trial`;

  return cnyesAuthClient<APIResponse.Response<Membership.TrialStatus>>({
    method: 'GET',
    url,
  });
}

export async function GETVideoV1CoursePurchaseInfo(courseId: string) {
  return videoApiClientWithAuth<APIResponse.Response<AnuePayment.PurchaseInfo>>({
    method: 'GET',
    url: `/video/api/v1/courses/${courseId}/purchaseInfo`,
    auth: true,
  });
}

/**
 * 導向至藍新金流刷卡頁面
 */
export async function FetchPaymentGateway(gateway: AnuePayment.PaymentGateway) {
  const form = document.createElement('form');

  switch (gateway.contentType) {
    case 'application/x-www-form-urlencoded':
      for (const p in gateway.vendorParameters) {
        const field = document.createElement('input');
        field.type = 'text';
        field.name = `${p[0].toUpperCase()}${p.substr(1)}`;
        field.value = gateway.vendorParameters[p];
        form.appendChild(field);
      }
      break;
  }

  form.action = gateway.endpoint;
  form.encoding = gateway.contentType;
  form.method = gateway.method;
  document.body.appendChild(form);
  form.submit();
}

export async function GETv1MeOrders(page: number, limit = 20, isWatchableOnly?: boolean) {
  return videoApiClientWithAuth<APIResponse.Response<AnueVideo.OrderDetail[]>>({
    method: 'GET',
    auth: true,
    url: `/video/api/v1/orders?page=${page}&limit=${limit}&is_my_course_list=${isWatchableOnly ? '1' : '0'}`,
  });
}

/**
 * 影音課程COUPON兌換課程 AUTH
 * @param {number} couponCode
 * @param {string} source 目前為固定值
 */
export async function POSTVideoCourseCoupon(couponCode: string) {
  return await videoApiClientWithAuth<APIResponse.Response<AnueVideo.Coupon.RedeemCouponResponse>>({
    method: 'POST',
    url: '/video/api/v1/coupon',
    auth: true,
    body: {
      coupon_code: couponCode,
      source: 'MDBS',
    },
  });
}

// 影音課程取得通知
export function GETVideoNotifications({ page = 1, limit = 20, serviceType = 'activity' }) {
  return marApiClientWithAuth({
    method: 'GET',
    url: `/member-always-right/api/v1/videoCourse/${serviceType}/notifications?page=${page}&limit=${limit}`,
  });
}

/** 取消通知
 * @broadcastType {String} 訂單inWebOrderNotify, 新聞追蹤inWebTagNewsNotify
 * @returns {Promise}
 */
export function PUTCancelInWebNotify(broadcastType) {
  return marApiClientWithAuth({
    method: 'PUT',
    url: '/member-always-right/api/v1/notification/in-web/cancel',
    body: {
      broadcast_type: broadcastType,
    },
  });
}

/**
 * @param {string} symbol
 * @returns {Promise}
 */
export function GETquoteBySymbol({ symbol }) {
  const url = `/ws/api/v2/old/quotes/${symbol}`;

  return reuterApiClient.get(url);
}

/**
 * https://cnyesrd.atlassian.net/wiki/spaces/PS/pages/633766431/API
 * @type {string} 跑馬燈 LMMR, 台股熱門股 LSTP, 國際熱門股 LSWP, 外匯熱門股 LCWP
 * @column 查詢欄位別
 * @page 分頁（非分頁查詢的type，後端忽略page參數）
 * @limit 筆數（非分頁查詢的type，後端忽略limit參數）
 * @returns {Promise}
 */
export function GETv2QuotesByType({ type, column, page, limit }) {
  const url = '/ws/api/v2/universal/quote';
  const params = { type, column, page, limit };

  return reuterApiClient.get(url, {
    params,
  });
}

type GETv3QuotesByTypeProps = {
  type: string;
  column?: string;
  limit?: number;
};

export function GETv3QuotesByType({ type, column, limit }: GETv3QuotesByTypeProps) {
  const url = '/ws/api/v3/universal/quote';
  const params = { type, column, limit };

  return reuterApiClient.get(url, {
    params,
  });
}

// batch process , type=A,B,C,... so on.
/**
 * @type {string}
 * @column {string}
 * @returns {Promise}
 */

export function GETv4QuotesByType(params) {
  const url = '/ws/api/v4/universal/quote';

  return reuterApiClient.get(url, {
    params,
  });
}

export function GETv4MarketFocus({ type }) {
  const url = 'ws/api/v4/universal/quote';
  const params = { type };

  return reuterApiClient.get(url, {
    params,
  });
}

/**
 * @categoryId {string} 即時頭條: headline, 台股: tw_stock, 國際股: wd_stock, 外匯: forex, 基金: fund
 * @limit {number} 10 ~ 30
 * @returns {Promise}
 */
type GETNewsListByCategoryParams = {
  categoryId: string;
  limit?: number;
  isIndexHeadline?: number;
  isCategoryHeadline?: number;
  start?: number;
  end?: number;
  authorName?: string;
};

export async function getAllNewsListForOld(): Promise<any> {
  const now = new Date();

  const news = [
    { categoryId: 'headline', limit: 18, isIndexHeadline: 1 },
    { categoryId: 'tw_stock', limit: 19, isIndexHeadline: 1 },
    { categoryId: 'fund,report', limit: 19, isIndexHeadline: 0 },
    { categoryId: 'wd_stock', limit: 19, isIndexHeadline: 1 },
    { categoryId: 'forex,future', limit: 19, isIndexHeadline: 1 },
    {
      categoryId: 'bc',
      limit: 19,
      isIndexHeadline: 0,
      end: now.getTime(),
      // 捉前2個月
      start: now.setDate(now.getDate() - 60),
    },
  ];

  return await Promise.all(news.map(param => getNewsListByCategory(param)));
}

export async function getAllNewsListForNew(): Promise<any> {
  const now = new Date();

  // 除了影音＆議題，純新聞分類(頭條、台股、陸港、基金、期匯、加密、議題)應只取得分類頭條
  // 類別頭條是 isCategoryHeadline=1
  // 首頁頭條是 isIndexHeadline
  const news = [
    { categoryId: 'headline', limit: 9, isIndexHeadline: 1 }, // 頭條
    { categoryId: 'tw_stock', limit: 9, isCategoryHeadline: 1 }, // 台股
    { categoryId: 'wd_stock', limit: 9, isCategoryHeadline: 1 }, // 美股
    { categoryId: 'cn_stock', limit: 9, isCategoryHeadline: 1 }, // 陸港
    { categoryId: 'fund', limit: 9, isCategoryHeadline: 1 }, // 基金
    { categoryId: 'forex,future', limit: 9, isCategoryHeadline: 1 }, // 期匯
    {
      categoryId: 'bc',
      limit: 9,
      end: now.getTime(),
      // 捉前2個月
      start: now.setDate(now.getDate() - 60),
    }, // 加密
    { categoryId: 'topTopics', limit: 9, isCategoryHeadline: 1 }, // 議題
  ];

  const works = news.map(param => getNewsListByCategory(param));
  // 捉取直播節目最新的前 6 筆
  works.push(GETVideosV1());

  return await Promise.all(works);
}

export function getNewsListByCategory({
  categoryId,
  limit = 10,
  isIndexHeadline = 0,
  isCategoryHeadline = 0,
  start,
  end,
  authorName,
}: GETNewsListByCategoryParams) {
  const url = `media/api/v1/newslist/category/${categoryId}`;

  const now = new Date();

  const endAt = end || now.getTime();
  const startAt = start || now.setDate(now.getDate() - 30); // query 1 month to make sure enough news during Chinese new year
  const params = {
    startAt: Math.floor(startAt / 1000),
    endAt: Math.floor(endAt / 1000),
    isIndexHeadline,
    isCategoryHeadline,
    limit,
    authorName,
  };

  return apiClient.get(url, { params });
}

export function GETnewsCategories({ key }) {
  return apiClient.get('/media/api/v1/newslist/categories', {
    params: { key },
  });
}

// LIMIT似乎沒作用
export function GETv1NewsListAll(limit = 10) {
  return apiClient.get('/media/api/v1/newslist/all', { params: { limit } });
}

/**
 * @navigation {string} 即時頭條: headline, 台股: 122, 國際股: 131, 外匯: 132, 基金:
 * @newsId {number}
 * @returns {Promise}
 */
export function GEThasLatestNewsByNewsId({ navigation, newsId }) {
  const url = `/media/api/v1/news/${navigation}/latest/${newsId}`;

  return apiClient.get(url);
}

/**
 * @newsId {number}
 * @returns {Promise}
 */
export function GETnewsContentByNewsId({ newsId }) {
  const url = `/media/api/v1/news/${newsId}?status=no_token`;

  return apiClient.get(url);
}

/**
 * v2 search for exactly matching
 * @q {string} keyword
 * @page {number}
 * @returns {Promise}
 */
export function GETnewsListBySearch({ q, page = 1, startAt, endAt }) {
  const params = {
    q,
    page,
    startAt,
    endAt,
  };
  const url = '/media/api/v2/search';

  return apiClient.get(url, { params });
}

/**
 * @cnyesId {string}
 * @startAt {number} timestamp
 * @endAt {number} timestamp
 * @by {string} d:日  w:週
 * @returns {Promise}
 */
export function GETchartingHistoryByCnyesId(
  // @ts-ignore
  { cnyesId, startAt, endAt, by } = {
    endAt: Date.now(),
    by: 'd',
  }
): Promise<{
  data: {
    items: {
      performance: number[];
      tradeDate: number[];
    };
  };
}> {
  const url = `/fund/api/v1/funds/${cnyesId}/history/performance`;
  const params = {
    startAt,
    endAt,
    by,
  };

  return fundApiClient.get(url, {
    params,
  });
}

/**
 * @cnyesIds {string} cnyesId1;cnyesId2;cnyesId3
 * @returns {Promise}
 */
export function GETfundQuotesByCnyesIds({
  cnyesIds,
}): Promise<{
  data: {
    items: {
      cnyesId: string;
      displayShortNameLocal: string;
      forSaleUrl: string;
      fundYesId: string;
      return1Year: number;
      return3Month: number;
    }[];
  };
}> {
  const url = '/fund/api/v1/funds/basic/info';
  const params = {
    cnyesIds,
  };

  return fundApiClient.get(url, {
    params,
  });
}

/**
 * 取得基金排行
 * @rangeType {string} 基金類型
 */

export function GETFundRankingTheme({ rangeType = 'd1d' }) {
  const url = '/fund/api/v1/funds/performance/ranking/themes';
  const params = {
    params: {
      rangeType,
    },
  };

  return fundApiClient.get(url, {
    ...params,
  });
}

type GETv1BatchQuoteBySymbolProps = {
  batchSymbols: string[];
  column: string;
};

export function GETv1BatchQuoteBySymbol({ batchSymbols, column = 'G' }: GETv1BatchQuoteBySymbolProps) {
  const url = `/ws/api/v1/quote/quotes/${batchSymbols.join(',')}?column=${column}`;

  return reuterApiClient.get(url);
}

/**
 * @symbol {Object} 指數symbol
 * @returns {Promise}
 */
export function GETETFQuoteBySymbol({ symbol }) {
  const url = `/ws/api/v1/etf/quote/${symbol}`;

  return reuterApiClient.get(url);
}
/**
 * @returns {Promise}
 */
export function GETMemberNewsTags() {
  return marApiClientWithAuth({
    method: 'GET',
    url: '/member-always-right/api/v1/news/tags',
  });
}

/**
 * @tags {string[]} tags string[]
 * @returns {Promise}
 */
export function DELETEMemberNewsTags(tags) {
  const tagStr = tags.join(',');

  return marApiClientWithAuth({
    method: 'DELETE',
    url: `/member-always-right/api/v1/news/tags/${tagStr}`,
  });
}

/**
 * @tags {object} profile
 * @returns {Promise}
 */
export function PUTMemberProfile(profile) {
  return memApiClientWithAuth({
    method: 'PUT',
    url: '/member/api/v1/user/profile',
    body: {
      ...profile,
    },
  });
}

/**
 * @oldPassword {string} oldPassword
 * @newPassword {string} newPassword
 * @returns {Promise}
 */
export function updatePassword(oldPassword, newPassword) {
  return memApiClientWithAuth({
    method: 'PUT',
    url: '/member/api/v1/user/password',
    body: {
      oldPassword,
      newPassword,
    },
  });
}

/**
 * category: https://cnyesrd.atlassian.net/wiki/spaces/BackendEngineeringTeam/pages/873955657
 * @keyword {string} 關鍵字
 * @limit {number} 筆數
 * @returns {Promise}
 */
export function getSearchMain(keyword, limit = 5) {
  const url = `/ess/api/v1/siteSearch/main?q=${encodeURIComponent(
    keyword
  )}&category=${anueSearchAllCategory}&limit=${limit}`;

  return searchApiClient.get(url);
}

/**
 * @keyword {string} 關鍵字
 * @category {string} 分類
 * @page {number} 頁數
 * @limit {number} 筆數
 * @returns {Promise}
 */
export function getSearchCat({ keyword, category, page = 1, limit = 20 }) {
  const url = `/ess/api/v1/siteSearch/fundQuoteName?q=${encodeURIComponent(
    keyword
  )}&category=${category}&limit=${limit}&page=${page}`;

  return searchApiClient.get(url);
}

/**
 * @keyword {string} 關鍵字
 * @page {number} 頁數
 * @limit {number} 筆數
 * @returns {Promise}
 */
export function getSearchNews({ keyword, page = 1, limit = 20 }) {
  const url = `/ess/api/v1/news/keyword?q=${encodeURIComponent(keyword)}&limit=${limit}&page=${page}`;

  return searchApiClient.get(url);
}

/**
 * @keyword {string} 關鍵字
 * @page {number} 頁數
 * @limit {number} 筆數
 * @returns {Promise}
 */
export function getSearchDriver({ keyword, page = 1, limit = 20 }) {
  const url = `/ess/api/v1/oldDriver/name?q=${encodeURIComponent(keyword)}&limit=${limit}&page=${page}`;

  return searchApiClient.get(url);
}

/**
 * 取消會員訂閱
 * @param productId 付費新聞 cnyes, 老司機 driver (後端尚未支援), 影音 video (後端尚未支援)
 */
export function PUTUnsubscribeMembership(productId: Membership.MembershipLv) {
  const url = `/media/api/v1/subscribe/${productId}/unsubscribe`;

  return cnyesAuthClient({
    method: 'PUT',
    url,
  });
}

type POSTUnsubscribedFeedbacksProps = {
  email: string;
  date: string;
  level: number;
  feedbacks: string[];
};

/**
 * 取消會員訂閱的Google表單
 */
export function POSTUnsubscribedFeedbacks({ email, date, level, feedbacks }: POSTUnsubscribedFeedbacksProps) {
  const url = '/local-api/unsubscribe-form';

  return apiClient.post(url, {
    email,
    date,
    level,
    feedbacks,
  });
}

/**
 * @fundIds {string[]} 基金代碼
 */
export function GETv3FundsListFields(fundIds) {
  const fields =
    'cnyesId,displayNameLocal,currencyName,nav,priceDate,change,changePercent,forSale,return1Month,return1MonthLocal,isin';
  const url = `/fund/api/v3/funds/${encodeURIComponent(fundIds)}?fields=${fields}`;

  return fundApiClient.get(url);
}

type GETv1PortfoliosProps = {
  productType?: string;
  groupId?: number;
};

/**
 * 取得自選列表
 */
export function GETv1Portfolios({ productType, groupId }: GETv1PortfoliosProps) {
  const params = { product_type: productType, group: groupId };
  const paramList = [];

  Object.keys(params).forEach(key => {
    if (params[key]) {
      paramList.push(`${key}=${params[key]}`);
    }
  });

  return marApiClientWithAuth({
    method: 'GET',
    url: `/member-always-right/api/v1/portfolios?${paramList.join('&')}`,
  });
}

export async function GETv1FundRankTop() {
  const url = '/fund/api/v1/funds/rank/top';
  return await apiClient.get(url);
}

export async function GETv2funds(cnyesId) {
  const url = `/fund/api/v2/funds/${cnyesId}`;
  return await apiClient.get(url);
}

export async function GETv1FundPerformance({ slug, rangeType, onShore, fundGroup }) {
  const url = `fund/api/v1/funds/performance/ranking/${slug}?rangeType=${rangeType}&onShore=${onShore}&fundGroup=${fundGroup}`;

  return await apiClient.get(url);
}

/**
 * 新增商品到自選列表
 * @productType {string} 商品類別
 * @productId {string} 商品Id
 * @groupIds {number[]} 群組Id
 * @returns {Promise}
 */
export function POSTv1AddProduct({ productType, productId, groupIds }) {
  return marApiClientWithAuth({
    method: 'POST',
    url: `/member-always-right/api/v1/portfolios/${productId}`,
    body: {
      product_type: productType,
      groups: groupIds,
    },
  });
}

/**
 * 刪除商品到自選列表
 * @productId {string} 商品Id
 * @groupIds {number[]} 群組Id
 * @returns {Promise}
 */
export function DELETEv1RemoveProduct({ productId, groupIds }) {
  return marApiClientWithAuth({
    method: 'DELETE',
    url: `/member-always-right/api/v1/portfolios/${productId}?groups=${encodeURIComponent(groupIds)}`,
  });
}

/**
 * 修改自選列表名稱
 * @groupId {number} 群組Id
 * @groupName {string} 群組名稱
 * @returns {Promise}
 */
export function PUTv1UpdateGroupName(groupId: number, groupName: string) {
  return marApiClientWithAuth({
    method: 'PUT',
    url: `/member-always-right/api/v1/portfolios/groups/${groupId}/name`,
    body: {
      name: groupName,
    },
  });
}

/**
 * 修改自選列表名稱
 * @groupId {number} 群組Id
 * @groupData {{id: string, type: string}[]} 群組data
 * @returns {Promise}
 */
export function PUTv1UpdateGroup(groupId: number, groupData: { id: string; type: string }[]) {
  return marApiClientWithAuth({
    method: 'PUT',
    url: '/member-always-right/api/v1/portfolios',
    body: {
      group: groupId,
      data: groupData,
    },
  });
}

type GETv1DriverSearchProps = {
  displayPeriod: string;
  limit?: number;
  page?: number;
  showMonthlyPerformance?: number;
};

export function GETv1DriverSearch({
  displayPeriod,
  limit = 10,
  page = 1,
  showMonthlyPerformance = 1,
}: GETv1DriverSearchProps) {
  const params = {
    order: displayPeriod,
    size: limit,
    page,
    showMonthlyPerformance,
  };
  const paramList = [];

  Object.keys(params).forEach(key => {
    if (params[key]) {
      paramList.push(`${key}=${params[key]}`);
    }
  });

  const url = `/driver/api/v1/drivers?${paramList.join('&')}`;

  return driverApiClient.get(url);
}

/**
 * @clientId {string} client id
 * @returns {Promise}
 */
export function GETVerifyUserAuthorization(clientId: string) {
  return oauthApiClientWithAuth({
    method: 'GET',
    url: `/oauth/api/v1/scopes/${clientId}`,
  });
}

/**
 * @authToken {string} auth_token
 * @return {Promise}
 */
export function POSTUserAuth(authToken: string) {
  return oauthApiClientWithAuth({
    method: 'POST',
    url: '/oauth/api/v1/authorize',
    body: {
      auth_token: authToken,
    },
  });
}

type GETv1OfficialPostsProps = {
  limit?: number;
  direction?: 'old' | 'new';
  lastPostId?: string;
};

export function GETv1OfficialPosts({ limit = 5, direction = 'old', lastPostId }: GETv1OfficialPostsProps) {
  const params = { size: limit, direction, lastPostId };
  const paramList = [];

  Object.keys(params).forEach(key => {
    if (params[key]) {
      paramList.push(`${key}=${params[key]}`);
    }
  });

  const url = `/sns/api/v1/posts/feeds/officials?${paramList.join('&')}`;

  return snsApiClient.get(url);
}

/**
 * 取得鉅亨號熱門貼文
 *
 * API: https://hao.cnyes.com/h_api/1/wall
 * 參數: RAW 格式 { p1: "", p2: "2", timezoneOffset: "", session: "" }
 * p2 為分類，2 為推薦
 *
 */
export function POSTAnueHaoHotPosts(type = 2) {
  const params = { p1: '', p2: type, timezoneOffset: '', session: '' };
  const url = '/ho_api/1/wall';

  return haoApiClient.post(url, params);
}

export function GETTWStockMarketTrend({ exchange, risefall, limit = 5 }) {
  const url = `/mi/api/v1/industry/risefall/${exchange}/${risefall}/${limit}`;

  return marketApiClient.get(url);
}

// QA-2074 全休休市市場只顯示星期一到五
export function GETv1MarketCloseOverview(limit = 7) {
  const url = `/ws/api/v1/global/countriesByDate?days=${limit}`;

  return reuterApiClient.get(url);
}

export function GETv1Heatmap({ inOut = 'in', limit = 10 }) {
  const params = { limit };
  const url = `/mi/api/v1/industry/heatmap/${inOut}`;

  return marketApiClient.get(url, { params });
}

export function GETv4Heatmap({ inOut = 'in', limit = 30, type }) {
  const params = type === 'BC' ?
  {
    type: 'CC_SELECTED_COLUMN.RANK',
    column: 'CC_K',
    page: 1,
    limit: 30,
    param: `rank=700005;order=DESC;type=${inOut}`,
  }
  :
  {
    limit,
    type: 'HEAT_MARKET_VALUE.RANK',
    page: 1,
    param: `heatType=${inOut}`,
  };
  const url = '/ws/api/v4/universal/quote';

  return reuterApiClient.get(url, { params });
}

/**
 * 判斷信箱是否已註冊
 * /member/api/v1/user/email/isMemberEmail
 * @export POSTv1MemberEmail
 * @param string email - client
 * @returns {Promise}
 */
export function POSTv1MemberEmail(email: string) {
  return memApiClientWithAuth({
    method: 'POST',
    url: '/member/api/v1/user/email/isMemberEmail',
    body: {
      email,
    },
  });
}

/**
 * 訂閱早報
 * /member-always-right/api/v1/newsletter/subscription
 * @export POSTv1NewsletterSubscriptioninator
 * @param string email - client
 * @returns {Promise}
 */
export function POSTv1NewsletterSubscriptioninator(email: string) {
  return marApiClientWithAuth({
    method: 'POST',
    url: '/member-always-right/api/v1/newsletter/subscription',
    body: {
      email,
    },
  });
}

/**
 * @description 用來要求重新寄送驗證信的函示
 * @export POSTv1ResendEmail
 * @param string email - client
 * @returns {Promise}
 */
export function POSTv1ResendEmail(email: string) {
  return memApiClientWithAuth({
    method: 'POST',
    url: '/member/api/v1/user/email/resend',
    body: {
      email,
    },
  });
}

// LandingPage
export function GETAnnounces(page: number, limit: number, type = '0', orderby = 'open_time', direction = 'desc') {
  const url = `/subscribe/api/v1/announce?order_by=${orderby}&direction=${direction}&${
    type ? `type=${type}` : ''
  }&limit=${limit}&page=${page}`;
  return subscribeApiClient.get(url);
}

export function GETAnnounceDetail(announceId: number) {
  const url = `/subscribe/api/v1/announce/${announceId}`;
  return subscribeApiClient.get(url);
}

export function GETLandingToolTutorial(
  page: number,
  limit: number,
  type: string,
  sourceID: number,
  orderby = 'open_time'
) {
  const url = `/subscribe/api/v1/productinfo/list?type=${type}&order_by=${orderby}&source=${sourceID}&direction=desc&limit=${limit}&page=${page}`;
  return subscribeApiClient.get(url);
}

// Subscribe store
export function GETProductDetail(productId: string, eventCount = 4) {
  const url = `/subscribe/api/v1/productinfo/${productId}?activity_count=${eventCount}`;

  return subscribeApiClient.get(url);
}

export function GETProductInteroduction(productId: number) {
  const url = `/subscribe/api/v1/productinfo/${productId}/introduction`;

  return subscribeApiClient.get(url);
}

// 取得銷售組合商品的訂閱週期
export function GETProductPlan(productId: number) {
  const url = `/subscribe/api/v1/productinfo/plan/${productId}`;

  return subscribeApiClient.get(url);
}

// 取得銷售組合明細
export function GETProductInfo(productId: string) {
  const url = `/subscribe/api/v1/productinfo/${productId}`;

  return subscribeApiClient.get(url);
}

// 查看會員符合試閱資格，判斷用戶使否有正確登入
export async function GETTrialQualification(productId: string | number) {
  try {
    const result = await subscribeApiClientWithAuth({
      method: 'GET',
      url: `/subscribe/api/v1/product/${productId}/first`,
    });

    return (result.status !== 200 || result.data.status_code !== 200) ? false : result;
  } catch (err) {
    return false;
  }
}

// 訂閱或是購買商品
export function POSTProductSubscribe(productId: string | number, planId: string | number, ubn: string = '') {
  const returnUrl =
    typeof window !== 'undefined' && `${location.protocol}//${location.host}${MEMBERSHIP_PAID_RETURN_URL}`;

  return subscribeApiClientWithAuth({
    method: 'POST',
    url: `/subscribe/api/v1/product/${productId}/subscribe`,
    auth: true,
    body: {
      return_url: returnUrl,
      plan_id: planId,
      ubn,
    },
  });
}

// 取消產品訂閱
export function DELETEProductSubscribe(productId: number) {
  return subscribeApiClientWithAuth({
    method: 'DELETE',
    url: `/subscribe/api/v1/product/${productId}/subscribe`,
  });
}

// 查看會員是否已購買過該商品，具有使用權限
export function GETProductCheck(productId: string) {
  return subscribeApiClientWithAuth({
    method: 'GET',
    url: `/subscribe/api/v1/product/${productId}/check`,
  });
}

// Member
export function GetPurchases(status: string, page: number, limit: number) {
  return subscribeApiClientWithAuth({
    method: 'GET',
    url: `/subscribe/api/v1/purchases?page=${page}&limit=${limit}&status=${status}`,
  });
}

export function GetPaymentDetails(page: number, limit: number) {
  return subscribeApiClientWithAuth({
    method: 'GET',
    url: `/subscribe/api/v1/payment_records?page=${page}&limit=${limit}`,
  });
}

export function GetMemberCardInfo() {
  return subscribeApiClientWithAuth({
    method: 'GET',
    url: '/subscribe/api/v1/card-binding',
  });
}

export function PUTCardBinding(productId: string = null, planId: string = null) {
  const returnUrl =
    typeof window !== 'undefined' && productId !== null
      ? `${location.protocol}//${
          location.host
        }/member/subscription/ord_checkout?productId=${productId}&planId=${planId}&cardBinding=1`
      : `${location.protocol}//${location.host}/member/info`;
  return subscribeApiClientWithAuth({
    method: 'PUT',
    url: '/subscribe/api/v1/card-binding',
    body: {
      return_url: returnUrl,
    },
  });
}

export function GETMemberImageInfo() {
  return memApiClientWithAuth({
    method: 'get',
    url: '/member/api/v1/user/profile/avatar/preSign',
  });
}

export async function GETv1NotificationLectures(id?: number) {
  const url = id ? `media/api/v1/system/notificationLectures/${id}` : 'media/api/v1/system/notificationLectures';
  /**
   * @params {platform} : 1:app|2:web|3:morning
   * @params {sort} : asc|desc
   * @params {order} : start_datetime
   **/
  const params = { platform: 2, sort: 'asc', order: 'start_datetime' };
  return apiClient.get(url, { params });
}

export async function GETv1Notification(id?: number) {
  const url = id ? `media/api/v1/system/notification/${id}` : 'media/api/v1/system/notifications';
  // platform: {1:app|2:web|3:morning}
  const params = { platform: 2 };
  return apiClient.get(url, { params });
}

/**
  API description: https://cnyesrd.atlassian.net/browse/ANUE-4547
  總首頁 > 外資券商目標價差排行
  @param {string} sort    up/down
  @param {string} market  TWS/HKS/USS/CNS
  @returns {Promise}
**/
export async function GETv1AdditionalRanking({
  fieldNo = UniversalProps.FsPricePercent,
  column = 'AM',
  sort,
  market,
  limit = 7,
}) {
  const params = {
    fieldNo,
    column,
    sort,
    market,
    limit,
  };
  const url = 'ws/api/v1/quote/additionalRanking';

  return reuterApiClient.get(url, { params });
}

/**
 * @param {string} type - 自訂廣告 ID, ex: Home_float_btn_D
 */
export async function GETv1AdContents(type) {
  if (!type || !type.length) return Promise.reject('Error! type parameter can not be empty');

  const url = `media/api/v1/adContents/${type}`;
  return apiClient.get(url);
}

/**
 * @param {string} type - 取得匯率幣別, USD CNY...
 */
export async function GETv1BankRate(type) {
  if (!type || !type.length) return Promise.reject('Error! type parameter can not be empty');

  const url = `ws/api/v1/bank/exchange/${type}`;
  return reuterApiClient.get(url);
}

/**
 * 三大法人圖表
 * @export
 * @returns string
 */
export function GETv2Investors() {
  const url = '/mi/api/v2/TWS:TSE01:INDEX/investors';
  return marketApiClient.get(url);
}

/**
 * 資券增減 (融資融券, 資券增減)圖表
 * @export
 * @returns string
 */
export function GETv1Margin() {
  const url = '/mi/api/v1/TWS:TSE01:INDEX/margin';
  return marketApiClient.get(url);
}
/**
 * 加權指數金額
 * @export
 * @returns string
 */
export function GETv1Quotes(symbol) {
  const url = `/ws/api/v1/quote/quotes/${symbol}`;
  return reuterApiClient.get(url);
}

export const GETv1TWStockMarginLast = () => {
  const url = '/mi/api/v1/TWS:TSE01:STOCK/margin/latest';
  return marketApiClient.get(url);
};

export const GETv1TWStockMarginCharting = () => {
  const url = '/mi/api/v1/TWS:TSE01:STOCK/margin/charting';
  return marketApiClient.get(url);
};

/**
 * 熱門搜尋
 * 2022/02/14: 需求有調整過，新的 API 在這 [ANUE-6521](https://cnyesrd.atlassian.net/browse/ANUE-6521)
 *
 * /ws/api/v1/universal/charting?type=GAHOT&page=1&limit=4&param=market=TWS;range=1D&resolution=1
 * @export
 * @returns string
 */
export function GETv1UniversalByCharting({ type, page = 1, limit = 4, param, resolution = 1 }) {
  const url = '/ws/api/v1/universal/charting';
  const params = {
    type,
    page,
    limit,
    resolution,
    param,
  };
  return reuterApiClient.get(url, {
    params,
  });
}

/**
 * 	公開申購
 * @export
 * @returns string
 */
export function GETv1Publicsubscription({ page, limit }) {
  const url = '/mi/api/v1/publicsubscription';
  const params = {
    page,
    limit,
  };
  return marketApiClient.get(url, {
    params,
  });
}

/**
 * 	台股投資看板
 * @export
 * @returns string
 */
export function GETv1Billboard({ from, to }) {
  const url = '/mi/api/v1/billboard';
  const params = {
    from,
    to,
  };
  return marketApiClient.get(url, {
    params,
  });
}

/**
 * 	取得專題列表
 * @export
 * @returns string
 */
export function GETv2ProjectIndex() {
  const url = '/api/v2/project/index';
  return apiClient.get(url);
}

/**
 * 	市櫃排行榜
 * example
 * http://ws.api.beta.cnyes.cool/ws/api/v1/quote/ranking?range=5&sort=down&exchange=TSE&market=TWS
 * exchange
 * 上市 TSE
 * 上櫃 OTC
 * sort
 * 漲幅 up
 * 跌幅 down
 * 成交量 volume
 * @export
 * @param {string} sort
 * @param {string} exchange
 * @returns string
 */
export function GETv1QuoteByRanking({ sort, exchange }) {
  const url = '/ws/api/v1/quote/ranking';
  const params = {
    sort,
    exchange,
    range: 5,
    market: 'TWS',
  };
  return reuterApiClient.get(url, {
    params,
  });
}

/**
 *  取得盤前必讀新聞
 *  q = 台股盤前
 *  v = v2
 *  取得法說追蹤新聞
 *  q = 法說
 *  v = v1
 * 	取得財報公佈新聞
 *  q =財報
 *  v = v2
 * example
 * https://api.cnyes.com/media/api/v2/search?q=%E8%B2%A1%E5%A0%B1
 *
 * @export
 * @returns string
 */
export function GETvSearchNewsByQueryString({ q, v }) {
  const url = `/media/api/${v}/search`;
  const params = {
    q,
  };
  return apiClient.get(url, { params });
}

/**
 * 	取得歷史圖表
 * https://ws.api.beta.cnyes.cool/ws/api/v1/charting/histories?resolution=D&symbols=EOD:ECOTWLI:EOD,EOD:ECOTWCI:EOD,EOD:ECOTWMI:EOD&from=1606780815&to=1575158400
 * @export
 * @returns string
 */
export function GETv1ChartingHistories({ symbols, from, to }) {
  const url = '/ws/api/v1/charting/histories';
  const params = {
    symbols: symbols.join(','),
    from,
    to,
    resolution: 'D',
  };
  return reuterApiClient.get(url, {
    params,
  });
}

/**
 * 	取得公開申購
 * https://marketinfo.api.beta.cnyes.cool/mi/api/v1/publicsubscription/spread?page=1&limit=5
 * @export
 * @returns string
 */
export function GETv1PublicSubscriptionSpread({ page, limit }) {
  const url = '/mi/api/v1/publicsubscription/spread';
  const params = {
    page,
    limit,
  };
  return marketApiClient.get(url, {
    params,
  });
}

/**
 * 	取得鉅亨好熱股
 * https://ws.api.beta.cnyes.cool/ws/api/v1/ga/selectedStockHot?resolution=M&limit=5&column=E&page=1
 * 日 D
 * 週 W
 * 月 M
 * @export
 * @returns string
 */
export function GETv1GaSelectedStockHot(range: 'D' | 'W' | 'M') {
  const url = '/ws/api/v1/ga/selectedStockHot';
  const params = {
    resolution: range,
    column: 'E',
    page: 1,
    limit: 5,
  };
  return reuterApiClient.get(url, {
    params,
  });
}

/**
 * 取得 ESG 排行
 * https://ws.api.beta.cnyes.cool/ws/api/v1/esg/rank/GOV?quote=1
 * @param ENV、SOC、GOV、ESG、COM
 * @export
 * @returns string
 */
export function GETv1ESGRanking(type) {
  const url = `/ws/api/v1/esg/rank/${type}?quote=1`;

  return reuterApiClient.get(url);
}

/**
 * 取得香港證券模擬投資組合 總市值＆回報率
 * https://www.anuesec.com/json/p1_modelSummary.json
 * @export
 * @returns json
 */
export function GETCNStockSummary() {
  const url = '/json/p1_modelSummary.json';

  return anueSecUrlClient.get(url);
}

/**
 * 取得香港證券模擬投資組合
 * https://www.anuesec.com/json/p1_holdings.json
 * @returns json
 */
export function GETCNStockList() {
  const url = '/json/p1_holdings.json';

  return anueSecUrlClient.get(url);
}

/**
 * 取得香港證券 IPO 新股列表
 * https://www.anuesec.com/api/session/submitSoapQuery
 * @returns json
 */
export function POSTSubmitSoapQuery() {
  const url = '/api/session/submitSoapQuery';
  const param = {
    form: {
      name: 'IPOListEnquiry',
      credentials: {
        username: '',
        password: '',
      },
      header: {
        version: '1',
        traceNo: '1',
      },
      body: {},
    },
  };

  return anueSecUrlClient.post(url, param);
}

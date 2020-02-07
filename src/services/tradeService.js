import http from "./httpService";

const apiEndpoint = {
  buy: "/auth/buy",
  sell: "/auth/sell"
};

function setFormData(data) {
  const formData = new FormData();
  for (let [key, value] of Object.entries(data)) formData.append(key, value);
  return formData;
}


async function buy(
  pair_id,
  type,
  rate,
  quantity,
  trigger_rate,
  stop_limit_rate
) {
  const formData = new FormData();
  formData.append("pair_id", pair_id);
  formData.append("type", type);
  if (rate) {
    formData.append("rate", rate);
  }
  formData.append("quantity", quantity);
  if (trigger_rate) {
    formData.append("trigger_rate", trigger_rate);
  }
  if (stop_limit_rate) {
    formData.append("stop_limit_rate", stop_limit_rate);
  }

  const { data } = await http.post(apiEndpoint.buy, formData);
  return data;
}

async function sell(
  pair_id,
  type,
  rate,
  quantity,
  trigger_rate,
  stop_limit_rate
) {
  const formData = new FormData();
  formData.append("pair_id", pair_id);
  formData.append("type", type);
  if (rate) {
    formData.append("rate", rate);
  }
  formData.append("quantity", quantity);
  if (trigger_rate) {
    formData.append("trigger_rate", trigger_rate);
  }
  if (stop_limit_rate) {
    formData.append("stop_limit_rate", stop_limit_rate);
  }

  const { data } = await http.post(apiEndpoint.sell, formData);
  return data;
}

async function cancelOrder(order_id) {
  const { data } = await http.get("/auth/cancel-order/" + order_id);
  return data;
}

async function getBalances() {
  const { data: balances } = await http.get("/auth/get-balances");
  return balances;
}

async function getBalance(currency_id) {
  const balances = await getBalances();
  return balances.find(b => b.id === currency_id);
}

async function getOrderBook(pair_id) {
  const { data } = await http.get("/order-book/" + pair_id);
  return data;
}

async function getTradeHistory(pair_id) {
  const { data } = await http.get("/trade-history/" + pair_id);
  return data;
}

async function getChartTradeHistory(pair_id, timeInterval, from) {
  let url = `/chart-trade-history/${pair_id}/${timeInterval}`;
  if (from) url += `?from=${from}`;
  const { data } = await http.get(url);
  return data;
}

async function getUserTradeHistory(params) {
  const formData = setFormData(params);
  const { data } = await http.post("/auth/user-trades", formData);
  return data;
}

async function getUserOrderHistory(params) {
  const formData = setFormData(params);
  const { data } = await http.post("/auth/user-orders", formData);
  return data;
}

async function getUserOpenOrders() {
  const { data } = await http.post("/auth/user-open-orders");
  return data;
}

export default {
  buy,
  sell,
  cancelOrder,
  getBalances,
  getBalance,
  getOrderBook,
  getTradeHistory,
  getChartTradeHistory,
  getUserTradeHistory,
  getUserOrderHistory,
  getUserOpenOrders
};

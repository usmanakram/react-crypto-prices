import http from "./httpService";

const apiEndpoint = {
  buy: "/auth/buy",
  sell: "/auth/sell"
};

async function buy(
  pair_id,
  type,
  price,
  quantity,
  trigger_rate,
  stop_limit_rate
) {
  const formData = new FormData();
  formData.append("pair_id", pair_id);
  formData.append("type", type);
  formData.append("price", price);
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
  price,
  quantity,
  trigger_rate,
  stop_limit_rate
) {
  const formData = new FormData();
  formData.append("pair_id", pair_id);
  formData.append("type", type);
  formData.append("price", price);
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

async function getLatestPrices() {
  const { data } = await http.get("/latest-prices");
  return data;
}

async function getLatestPrice(pair_id) {
  const prices = await getLatestPrices();
  return prices.find(p => p.id === pair_id);
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

async function getChartTradeHistory(pair_id, timeInterval) {
  const { data } = await http.get(
    "/chart-trade-history/" + pair_id + "/" + timeInterval
  );
  return data;
}

async function getUserTradeHistory(start, end, pair_id, direction) {
  const formData = new FormData();
  formData.append("start", start);
  formData.append("end", end);
  formData.append("pair_id", pair_id);
  formData.append("direction", direction);

  const { data } = await http.post("/auth/user-trades", formData);
  return data;
}

async function getUserOrderHistory(start, end, pair_id, direction) {
  const formData = new FormData();
  formData.append("start", start);
  formData.append("end", end);
  formData.append("pair_id", pair_id);
  formData.append("direction", direction);

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
  getLatestPrices,
  getLatestPrice,
  getBalances,
  getBalance,
  getOrderBook,
  getTradeHistory,
  getChartTradeHistory,
  getUserTradeHistory,
  getUserOrderHistory,
  getUserOpenOrders
};

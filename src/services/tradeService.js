import http from "./httpService";

const apiEndpoint = {
  buy: "/auth/buy",
  sell: "/auth/sell"
};

async function buy(pair_id, price, quantity) {
  const formData = new FormData();
  formData.append("pair_id", pair_id);
  formData.append("price", price);
  formData.append("quantity", quantity);

  const { data } = await http.post(apiEndpoint.buy, formData);
  return data;
}

async function sell(pair_id, price, quantity) {
  const formData = new FormData();
  formData.append("pair_id", pair_id);
  formData.append("price", price);
  formData.append("quantity", quantity);

  const { data } = await http.post(apiEndpoint.sell, formData);
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

async function getUserTradeHistory() {
  const { data } = await http.post("/auth/user-trades");
  return data;
}

async function getUserOrderHistory() {
  const { data } = await http.post("/auth/user-orders");
  return data;
}

async function getUserOpenOrders() {
  const { data } = await http.post("/auth/user-open-orders");
  return data;
}

export default {
  buy,
  sell,
  getBalances,
  getBalance,
  getOrderBook,
  getTradeHistory,
  getUserTradeHistory,
  getUserOrderHistory,
  getUserOpenOrders
};

function getLastMonthDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d;
}

export default { getLastMonthDate };

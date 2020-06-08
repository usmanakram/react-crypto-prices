const words = [
  "xct8skf4n7bq",
  "ny8vf1403x62",
  "p96jmzgfhkvb",
  "93fqsvndmhcg",
  "fjm387n14xhz",
  "mpzc9s601xrn",
  "4phf0st3m1c5",
  "7q9tr2dz3s4c",
  "g5rfy2s63cv9",
  "qjr275hb68dt",
  "f62zcxj4ptnw",
  "3xqz08c5nyb9",
  "y3rpb9df8jw0",
  "jphzdkxc0t8v",
  "w2k3qs6mvn8f",
  "xmw00jqh6nt9",
  "96cmpnybzsf1",
  "z5ypc69wvtn1",
  "vckjd9f0qxm8",
  "ks8fyvhz9q0t",
  "j703rms2hdcb",
  "ctgr71qfh9kj",
  "3w0kcq1h5fys",
  "x8nv3kc4915j",
  "y90cr2kpv874",
  "c6hwkzvqsyx9",
  "tbjq1sd2v7gh",
  "1mzpbh7qsfk3",
  "x84w3dpjf2v6",
  "304j12gx6kzm",
  "47vhg1fsr089",
  "n76xz4cwpmhr",
  "0pc14nqzm52v",
  "y43kcdb1wn0t",
  "p326g8y1wkjm",
  "yxb0kpsh273w",
  "7s6wj3dtg2x8",
  "21kvwt76nphx",
  "fp83mvck2qbn",
  "hf3mr4pnkj0x",
  "w4fhbvz75g16",
  "dp9r5614k2xz",
  "c1gzmpdyw2fh",
  "5hn870xt941s",
  "834xpv6fg5n1",
  "07njdvz96bpr",
  "w79f8hsvnx4r",
  "2jkh8dxsrw9n",
  "pkyjt14b9hwf",
  "806tk4dzbprc",
  "60c3jvt2nhqx",
  "dy3nbzcrgfx5",
  "rd1bwtcj3hk2",
  "msj2wtkh5d31",
  "7rmh0nvd49tf",
  "081vkh5326tc",
  "dst0c938rmxj",
  "kymnj1w78fhr",
  "h0pbqv7tcgxy",
  "sjhq8pyn5t3z",
  "nqsybw5p4301",
  "k009nfryp2q8",
  "5wqsjc6t7n2x",
  "3fv5mjcy7g02",
  "cvq9pzt2mx61",
  "rqcm4btnj8dw",
  "y7248jdqwcrf",
  "7x8bms6drtnp",
  "ghvb79pf64td",
  "br38qvgz60y7",
  "t5g1xhv8rzn0",
  "0rztbqfh9pcs",
  "b1mpwn80vhz3",
  "3vcmn6pfw4ry",
  "fx3nwbqk6j0y",
  "2sr3kzw46gn1",
  "nzqprs8c31yd",
  "pjs41vd8cz50",
  "2hk0w4zvfpqd",
  "7rnd8xvgz3py",
  "gtd7wsb9jf0q",
  "vgr2w39yqhxd",
  "yr18td59cj40",
  "f0jby6k3r24t",
  "5pcx264wdf1s",
  "zygn246drkx0",
  "wsr4p25yf6bc",
  "sby8qm6fh0cz",
  "d3cjsr2tbzgq",
  "9x6q7rmg408t",
  "4jz9hxs3wr58",
  "xr6bt1wc9fsq",
  "p5my42z1hgk0",
  "v795dmckn3fq",
  "5pvg9rbc71hs",
  "3k0n1gxjmh6b",
  "xcd605234tjs",
  "nj9m51vwx3hz",
  "6bvyxcp8kjh1",
  "1cm3x7t460s8",
];

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertTimeToString(time) {
  const alphabets = "abcdefghij";
  let response = "";
  for (let i = 0; i < time.length; i++) response += alphabets[time[i]];
  return response;
}

function prependZero(arg) {
  return arg < 10 ? "0" + arg : arg;
}

function getFormatedTime(obj) {
  const month = obj.getUTCMonth() + 1;
  const date = obj.getUTCDate();
  const hours = obj.getUTCHours();
  const minutes = obj.getUTCMinutes();
  const seconds = obj.getUTCSeconds();
  return (
    obj.getUTCFullYear() +
    prependZero(month) +
    prependZero(date) +
    prependZero(hours) +
    prependZero(minutes) +
    prependZero(seconds)
  );
}

function getRequestHeader() {
  const d = new Date();

  const time1 = getFormatedTime(d);
  let header = convertTimeToString(time1);

  header += words[getRandomInteger(0, 99)];

  // d.setSeconds( d.getSeconds() + 24*60*60 );
  d.setSeconds(d.getSeconds() + 2 * 60);

  const time2 = getFormatedTime(d);
  header += convertTimeToString(time2);
  return header;
}

export default {
  getRequestHeader,
};

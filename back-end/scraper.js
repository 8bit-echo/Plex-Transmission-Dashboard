const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');
const request = require('request-promise-native');
const zooqleBase = 'https://zooqle.com/search?q=';
const zooqleMovies = '+category%3AMovies';
const zooqleTV = '+category%3ATV';
const _1337xBase = 'https://1337x.to/sort-search/';
const _1337xSortParams = '/seeders/desc/1/';
const _1337xMovies = '/Movies/seeders/desc/1/';
const _1337xTV = '/TV/seeders/desc/1/';

const _1337x = {
  container: '.box-info-detail.inner-table .table-list-wrap tbody tr',
  name: '.box-info-detail.inner-table .table-list-wrap tbody tr .name',
  single: {
    link:
      '.box-info-detail.inner-table .table-list-wrap tbody tr .name a[href^="/torrent"]',
    magnet: 'a[href^="magnet:?xt"]'
  },
  seeds: '.box-info-detail.inner-table .table-list-wrap tbody tr .seeds',
  size: '.box-info-detail.inner-table .table-list-wrap tbody tr .size'
};

const zooqle = {
  container: '.table-torrents tbody tr',
  name: '.table-torrents tbody tr a.small',
  magnet: '.table-torrents tbody tr a[title="Magnet link"]',
  seeds: '.table-torrents tbody tr div[title^="Seeders"] .progress-bar',
  size: '.table-torrents tbody tr td:nth-child(4)'
};

async function getWebPage(url) {
  try {
    const html = await request(url);
    return html;
  } catch (error) {
    console.log('error when getting webpage: ' + url);
    throw new Error(error);
  }
}

function getText(html, selector) {
  const array = [];
  const $ = cheerio.load(html);
  $(selector).each((i, el) => {
    array.push($(el).text());
  });
  return array;
}

function getAttr(html, selector, attribute) {
  const array = [];
  const $ = cheerio.load(html);
  $(selector).each((i, el) => {
    array.push($(el).attr(attribute));
  });

  return array;
}

function formatSearchTerms(terms, glue) {
  return terms.toLowerCase().replace(/\ /g, glue);
}

// async function getZooqleResults(searchTerms) {
//   try {
//     searchTerms = formatSearchTerms(searchTerms, '+');
//     const page = await getWebPage(`${zooqleBase}${searchTerms}`);
//     const name = getText(page, zooqle.name);
//     console.log(name);
//   } catch (error) {
//     console.log('error getting or parsing zooqle page');
//   }
// }

function isRussian(string) {
  return /[а-яА-ЯЁё]/.test(string);
}

async function getZooqleResults(searchTerms, cat = '') {
  try {
    searchTerms = formatSearchTerms(searchTerms, '+');
    console.log(`starting zooqle scrape on ${zooqleBase}${searchTerms}${cat}`);
    const page = await cloudscraper.get(`${zooqleBase}${searchTerms}${cat}`);
    const name = getText(page, zooqle.name);
    const size = getText(page, zooqle.size);
    const seeds = getText(page, zooqle.seeds);
    const magnet = getAttr(page, zooqle.magnet, 'href');
    const torrents = [];

    if (name.length == size.length && size.length == magnet.length) {
      console.log(`found ${name.length} matches on zooqle`);
      name.map((el, i) => {
        if (!isRussian(el)) {
          torrents.push({
            id: i,
            name: el,
            size: size[i],
            seeds: transformNumber(seeds[i]),
            magnet: magnet[i]
          });
        }
      });

      return torrents;
    } else {
      throw new Error(
        `found mismatched array length when making data structure. names:${name.length}, sizes:${size.length}, magnets:${magnet.length}`
      );
    }
  } catch (error) {
    console.log('error getting or parsing zooqle page');
  }
}

async function get1337xResults(searchTerms, cat = _1337xSortParams) {
  console.log('starting 1337x scrape');
  try {
    searchTerms = formatSearchTerms(searchTerms, '%20');
    const page = await getWebPage(`${_1337xBase}${searchTerms}${cat}`);
    const name = getText(page, _1337x.name);
    let size = getText(page, _1337x.size);
    size = size.map(str =>
      str.replace(/((\d){0,4}\.(\d){0,4}) ((K|M|G|T)B)((\d){0,6})/gi, '$1 $4')
    );
    const seeds = getText(page, _1337x.seeds);
    const link = getAttr(page, _1337x.single.link, 'href');
    // const magnet = getAttr(page, _1337x.magnet, 'href');
    const torrents = [];

    if (name.length == size.length && size.length == link.length) {
      console.log(`found ${name.length} matches on _1337x`);
      name.map((el, i) => {
        torrents.push({
          id: 1337 + i,
          name: el,
          size: size[i],
          seeds: seeds[i],
          link: link[i]
        });
      });

      return torrents;
    }
  } catch (error) {
    console.log('error getting or parsing 1337x page');
    console.log(error);
  }
}

async function get1337xMagnet(link) {
  try {
    console.log(`${_1337xBase}${link}`);
    const page = await getWebPage(`https://1337x.to${link}`);
    const magnet = await getAttr(page, _1337x.single.magnet, 'href');
    return magnet[0];
  } catch (error) {
    return 'error getting 1337x magnet link...' + error;
  }
}

function transformNumber(string) {
  return string.replace(' K', '000');
}

module.exports = {
  zooqleMovies,
  zooqleTV,
  getZooqleResults,
  get1337xResults,
  get1337xMagnet
};

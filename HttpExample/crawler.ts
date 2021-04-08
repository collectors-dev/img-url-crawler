
import { Context } from '@azure/functions';
import * as puppeteer from 'puppeteer';

export async function imgListParser(context: Context, URL: string){  
  const browser = await puppeteer.launch({
    headless : true,
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  
  const page = await browser.newPage();
  const iPhone = puppeteer.devices['iPad']
  await page.emulate(iPhone);
  await page.goto(URL);
  context.log(`Open page : ${URL}`);
  const data = await page.evaluate(() => {
    const elements = document.body.getElementsByTagName("img");
    const arr = Array.from(elements);
    return arr.map(element => {
      const src = element.currentSrc;
      const size = parseFloat( window.getComputedStyle(element).getPropertyValue("width").split('px')[0]) *
        parseFloat( window.getComputedStyle(element).getPropertyValue("height").split('px')[0]);
      return {src, size};
    });
  });
  context.log('print data...');
  context.log(data);
  await browser.close();
  return data;
};
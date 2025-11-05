import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/pt-br';

import type { Data, Month } from '@/types';

dayjs.extend(customParseFormat);
dayjs.locale('pt-br');

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN7GlArqK4Es6MtTNIyqnWzVlAsgqbOg4QdEFdwPj-6kIPYD_Yk9pFNe7nTcuAwP_yviA6pblYJuT8/pub?gid=626575137&single=true&output=tsv';

function parseNumber(ptValue: string): number {
  // Convert "10.000,50" → 10000.5
  const normalized = ptValue
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  return Number(normalized) || 0;
}

function parseTsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) =>
      line.split(/\t/).map((value) => value.replace(/^"|"$/g, '').trim()),
    );
}

export async function fetchData(): Promise<Data> {
  const noCacheUrl = `${SHEET_URL}&t=${Date.now()}`;

  const res = await fetch(noCacheUrl, { cache: 'no-store' });
  const text = await res.text();

  const rows = parseTsv(text);
  const dataRows = rows.slice(1);

  const months: Month[] = [];
  let lastUpdate: Dayjs | undefined;

  for (const row of dataRows) {
    const [
      month = '',
      templeDue = '',
      loanDue = '',
      templePayment = '',
      loanPayment = '',
      available = '',
      paidTotal = '',
      supportFund = '',
      updatedAt = '',
    ] = row;

    // If the line has an update date, save it.
    if (updatedAt) {
      const updateDate = dayjs(updatedAt, 'DD/MM/YYYY HH:mm');
      if (!lastUpdate || lastUpdate.isBefore(updateDate)) {
        lastUpdate = updateDate;
      }
    }

    months.push({
      month,
      templeDue: parseNumber(templeDue),
      loanDue: parseNumber(loanDue),
      templePayment: parseNumber(templePayment),
      loanPayment: parseNumber(loanPayment),
      available: parseNumber(available),
      paidTotal: parseNumber(paidTotal),
      supportFund: parseNumber(supportFund) || undefined,
    });
  }

  return {
    updatedAt: lastUpdate
      ? lastUpdate
          .format('D [de] MMMM [de] YYYY [às] H[h]mm')
          .replace(/0{2}$/, '')
      : '',
    months,
  };
}

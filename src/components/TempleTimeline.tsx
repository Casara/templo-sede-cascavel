'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts';

import type { Month } from '@/types';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<string | number, string>) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-white border shadow-md rounded-lg p-3 text-xs text-gray-700 space-y-1">
      <div className="font-semibold text-gray-800">{label}</div>
      <div>
        Total devido:{' '}
        <span className="font-medium">{formatCurrency(data.totalDue)}</span>
      </div>
      <div>
        Pago:{' '}
        <span
          className={`font-medium ${
            data.paymentBar >= data.totalDue
              ? 'text-green-700'
              : 'text-blue-700'
          }`}
        >
          {formatCurrency(data.paymentBar)}
        </span>
      </div>
      {data.available > 0 && (
        <div>
          Disponível em caixa:{' '}
          <span className="font-medium text-yellow-700">
            {formatCurrency(data.available)}
          </span>
        </div>
      )}
      {data.remaining > 0 && (
        <div>
          Faltante:{' '}
          <span className="font-medium text-red-700">
            {formatCurrency(data.remaining)}
          </span>
        </div>
      )}
      {data.faoiLoan > 0 && (
        <div>
          Empréstimo FAOI:{' '}
          <span className="font-medium text-orange-700">
            {formatCurrency(data.faoiLoan)}
          </span>
        </div>
      )}
    </div>
  );
};

interface TimelineProps {
  entryValue: number;
  totalValue: number;
  updatedAt?: string;
  months?: Month[];
}

export default function TempleTimeline({
  entryValue,
  totalValue,
  updatedAt,
  months = [],
}: TimelineProps) {
  const totalPaid = entryValue + months.reduce((s, m) => s + m.paidTotal, 0);
  const remaining = totalValue - totalPaid;
  const available = months.at(-1)?.available ?? 0;
  const faoiLoanTotal = months.reduce((s, m) => s + (m.faoiLoan ?? 0), 0);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const chartData = months.map((m) => {
    const totalDue = m.templeDue + m.loanDue;
    const totalPaid = m.templePayment + m.loanPayment;
    const faoiLoan = m.faoiLoan || 0;
    const available = m.available || 0;

    // Valor total que já foi pago (sem contar ajuda do fundo)
    const paymentBar = Math.min(totalPaid - faoiLoan, totalDue);

    // Valor disponível em caixa (não usado ainda)
    const availableBar = totalPaid >= totalDue ? 0 : available;

    const remaining = Math.max(totalDue - totalPaid - available, 0);

    return {
      ...m,
      totalDue,
      totalPaid,
      remaining,
      paymentBar,
      availableBar,
      faoiLoan,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <header className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          IPAD Ministério Restauração — Área Oeste do Paraná
        </h2>
        <p className="text-sm text-gray-500">Atualizado em {updatedAt}</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-green-100 p-3 rounded relative">
          <div className="text-xs text-green-700">Total pago</div>
          <div className="font-semibold text-green-800">
            {formatCurrency(totalPaid)}{' '}
            <span className="text-xs text-green-600">
              ({((totalPaid / totalValue) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-green-200 rounded-b-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-700"
              style={{
                width: `${(totalPaid / totalValue) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="bg-red-100 p-3 rounded relative">
          <div className="text-xs text-red-700">Falta pagar</div>
          <div className="font-semibold text-red-800">
            {formatCurrency(remaining)}{' '}
            <span className="text-xs text-red-600">
              ({((remaining / totalValue) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-red-200 rounded-b-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-700"
              style={{
                width: `${(remaining / totalValue) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="bg-yellow-100 p-3 rounded">
          <div className="text-xs text-yellow-700">Disponível em caixa</div>
          <div className="font-semibold text-yellow-800">
            {formatCurrency(available)}
          </div>
        </div>
        <div className="bg-orange-100 p-3 rounded">
          <div className="text-xs text-orange-700">
            Empréstimo{' '}
            <abbr title="Fundo de Apoio ao Obreiro Integrado">FAOI</abbr>
          </div>
          <div className="font-semibold text-orange-800">
            {formatCurrency(faoiLoanTotal)}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            content={CustomTooltip}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />

          {/* 🟧 Ajuda do fundo */}
          <Bar
            dataKey="faoiLoan"
            stackId="a"
            fill="#ff9800"
            fillOpacity={0.9}
            isAnimationActive={false}
          />

          {/* 🟦 / 🟩 Pagamentos realizados */}
          <Bar dataKey="paymentBar" stackId="a" fillOpacity={0.95}>
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.month}`}
                fill={
                  entry.paymentBar >= entry.totalDue ? '#28a745' : '#2196f3'
                } // verde se cobriu o total, azul se parcial
              />
            ))}
          </Bar>

          {/* 🟨 Valor disponível em caixa (ainda não usado) */}
          <Bar
            dataKey="availableBar"
            stackId="a"
            fill="#fdd835"
            fillOpacity={0.9}
            isAnimationActive={false}
          />

          {/* 🔴 Base — total devido */}
          <Bar
            dataKey="remaining"
            stackId="a"
            fill="#fca5a5" // vermelho claro
            fillOpacity={0.5}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>

      <footer className="text-xs text-gray-600 text-center flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
            <span>
              Empréstimo{' '}
              <abbr title="Fundo de Apoio ao Obreiro Integrado">FAOI</abbr>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Pago (parcial)</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600"></span>
            <span>Pago (integral)</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
            <span>Valor arrecadado (ainda não usado)</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <span>Falta para completar o valor necessário</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

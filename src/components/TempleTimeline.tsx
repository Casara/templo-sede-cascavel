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

const barColors: Record<string, string> = {
  paid: '#28a745', // green
  paidWithSupport: '#ff9800', // orange
  partial: '#fdd835', // yellow
  totalInCash: '#2196f3', // blue
  noPayment: '#f44336', // red
};

function getMonthStatus(month: Month): string {
  const totalDue = month.templeDue + month.loanDue;
  const totalPaid = month.templePayment + month.loanPayment;

  const paid = totalPaid >= totalDue;
  // const hasSupport = !!month.supportFund && month.supportFund > 0;
  const hasAvailable = month.available > 0;

  // if (paid && hasSupport) return 'paidWithSupport'; // 🟧 Orange
  if (paid) return 'paid'; // 🟩 Green
  if (!paid && hasAvailable && month.available < totalDue) return 'partial'; // 🟨 Yellow
  if (!paid && month.available >= totalDue) return 'totalInCash'; // 🟦 Blue
  return 'noPayment'; // 🟥 Red
}

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
        <span className="font-medium text-green-700">
          {formatCurrency(data.totalPaid)}
        </span>
      </div>
      {data.available > 0 && (
        <div>
          Disponível em caixa:{' '}
          <span className="font-medium text-blue-700">
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
      {data.supportFund > 0 && (
        <div>
          Ajuda do fundo:{' '}
          <span className="font-medium text-orange-700">
            {formatCurrency(data.supportFund)}
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
  const supportTotal = months.reduce((s, m) => s + (m.supportFund ?? 0), 0);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const chartData = months.map((m) => {
    const totalDue = m.templeDue + m.loanDue;
    const totalPaid = m.templePayment + m.loanPayment;
    const pending = Math.max(totalDue - totalPaid, 0);
    const paidOrAvailable = Math.min(
      totalDue,
      (m.templePayment || 0) + (m.loanPayment || 0) + (m.available || 0),
    );
    const remaining = Math.max(totalDue - paidOrAvailable, 0);

    return {
      ...m,
      totalDue,
      totalPaid,
      pending,
      progress: paidOrAvailable - (m.supportFund || 0),
      remaining,
      status: getMonthStatus(m),
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
          <div className="text-xs text-orange-700">Ajuda do fundo</div>
          <div className="font-semibold text-orange-800">
            {formatCurrency(supportTotal)}
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

          {/* Overlaid bar: amount paid/available */}
          <Bar
            dataKey="supportFund"
            stackId="a"
            fill="#ff9800"
            fillOpacity={0.8}
          />

          <Bar dataKey="progress" fillOpacity={0.95} stackId="a">
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.month}`}
                fill={barColors[entry.status]}
              />
            ))}
          </Bar>

          {/* Bar of what remains to be paid (top part) */}
          <Bar
            dataKey="remaining"
            stackId="a"
            fill="#f44336"
            fillOpacity={0.5}
          />
        </BarChart>
      </ResponsiveContainer>

      <footer className="text-xs text-gray-600 text-center flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600"></span>
            <span>Pago (valor já quitado)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
            <span>Ajuda do fundo convencional</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
            <span>Arrecadação parcial ainda não usada</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Valor total disponível (ainda não pago)</span>
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

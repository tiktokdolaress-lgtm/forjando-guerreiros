import { NextResponse } from 'next/server';

/* Devolve o preço DA REGIÃO do visitante (mesma trava geográfica do checkout).
   Assim o paywall mostra uma moeda só — nunca as duas. */
export async function GET(req) {
  const country = req.headers.get('x-vercel-ip-country') || 'BR';
  const br = country === 'BR';
  return NextResponse.json({
    country,
    currency: br ? 'BRL' : 'USD',
    price: br ? 'R$ 9,90/mês' : '$9.90/month',
    amount: br ? 'R$ 9,90' : '$9.90',
    amountYearly: br ? 'R$ 87,00' : '$87.00',
    yearlyPerMonth: br ? 'R$ 7,25' : '$7.25',
    savings: br ? 'Economize 27%' : 'Save 27%',
  });
}

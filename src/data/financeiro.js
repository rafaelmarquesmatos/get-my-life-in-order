export const features = [
  {
    id: "financeiro",
    label: "Financeiro",
    href: "/financeiro/dashboard",
    enabled: true,
  },
  {
    id: "tarefas",
    label: "Tarefas",
    href: "#",
    enabled: false,
  },
  {
    id: "saude",
    label: "Saúde",
    href: "#",
    enabled: false,
  },
];

export const financeiroSubnav = [
  { id: "dashboard", label: "Dashboard", href: "/financeiro/dashboard" },
  { id: "salario", label: "Salário", href: "/financeiro/salario" },
  { id: "contas", label: "Contas a Pagar", href: "/financeiro/contas" },
  { id: "recorrentes", label: "Recorrentes", href: "/financeiro/recorrentes" },
];

export const financeiro = {
  monthLabel: "Setembro 2026",
  salario: {
    valor: "R$ 8.500,00",
    competencia: "2026-09",
  },
  totais: {
    salario: "R$ 8.500,00",
    dividas: "R$ 3.240,00",
    saldo: "R$ 5.260,00",
  },
  contas: [
    {
      id: "conta-1",
      descricao: "Aluguel",
      valor: "R$ 1.800,00",
      vencimento: "10/09/2026",
      status: "Pendente",
    },
    {
      id: "conta-2",
      descricao: "Cartão de crédito",
      valor: "R$ 920,00",
      vencimento: "15/09/2026",
      status: "Pendente",
    },
    {
      id: "conta-3",
      descricao: "Academia",
      valor: "R$ 120,00",
      vencimento: "05/09/2026",
      status: "Pago",
    },
    {
      id: "conta-4",
      descricao: "Farmácia",
      valor: "R$ 400,00",
      vencimento: "20/09/2026",
      status: "Pendente",
    },
  ],
  recorrentes: [
    {
      id: "rec-1",
      descricao: "Aluguel",
      valor: "R$ 1.800,00",
      dia: "10",
    },
    {
      id: "rec-2",
      descricao: "Internet",
      valor: "R$ 129,90",
      dia: "08",
    },
    {
      id: "rec-3",
      descricao: "Streaming",
      valor: "R$ 55,90",
      dia: "12",
    },
    {
      id: "rec-4",
      descricao: "Academia",
      valor: "R$ 120,00",
      dia: "05",
    },
  ],
};

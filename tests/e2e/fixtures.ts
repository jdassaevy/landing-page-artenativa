export const E2E_FIXTURES = {
  location: {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Sede E2E Arte Nativa",
    address: "Rua das Tradições, 100",
    city: "Santo Amaro da Imperatriz",
    state: "SC",
  },
  period: {
    id: "20000000-0000-4000-8000-000000000001",
    name: "Período E2E",
  },
  classes: [
    {
      id: "30000000-0000-4000-8000-000000000001",
      modality: "Forró Básico",
      weekday: 1,
      startTime: "18:00:00",
      endTime: "19:00:00",
    },
    {
      id: "30000000-0000-4000-8000-000000000002",
      modality: "Tango",
      weekday: 1,
      startTime: "20:00:00",
      endTime: "21:00:00",
    },
    {
      id: "30000000-0000-4000-8000-000000000003",
      modality: "Forró Básico",
      weekday: 3,
      startTime: "19:00:00",
      endTime: "20:00:00",
    },
    {
      id: "30000000-0000-4000-8000-000000000004",
      modality: "Milonga",
      weekday: 7,
      startTime: "17:00:00",
      endTime: "18:00:00",
    },
  ],
  event: {
    id: "40000000-0000-4000-8000-000000000001",
    slug: "e2e-festa-da-tradicao",
    title: "Festa da Tradição E2E",
    description: "Uma noite E2E de dança, música e encontro da comunidade Arte Nativa.",
    date: "2035-10-20T22:00:00.000Z",
    reservationMessage: "Olá! Quero reservar uma mesa para a Festa da Tradição E2E.",
    ticketMessage: "Olá! Quero comprar ingresso para a Festa da Tradição E2E.",
    phone: "48999999999",
  },
  pastEvent: {
    id: "40000000-0000-4000-8000-000000000002",
    slug: "e2e-evento-passado",
    title: "Evento Passado E2E",
    date: "2020-01-10T22:00:00.000Z",
  },
  admin: {
    email: "admin.e2e@example.com",
    password: "ArteNativa-E2E-Admin-123!",
  },
  member: {
    email: "member.e2e@example.com",
    password: "ArteNativa-E2E-Member-123!",
  },
} as const;

export const E2E_CLASS_ORDER = E2E_FIXTURES.classes.map((item) => item.id);

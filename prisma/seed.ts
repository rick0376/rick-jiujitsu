// prisma/seed.ts

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { EventType, PrismaClient, SiteCardSection } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@rickpereira.com.br";
const OLD_ADMIN_EMAIL = "admin@mandiok.com.br";
const ADMIN_PASSWORD = "Admin@123";

const permissionSeeds = [
  ["dashboard.view", "Ver dashboard"],

  ["students.view", "Ver alunos"],
  ["students.create", "Cadastrar alunos"],
  ["students.edit", "Editar alunos"],
  ["students.delete", "Excluir alunos"],

  ["attendance.view", "Ver presença"],
  ["attendance.manage", "Gerenciar presença"],

  ["graduations.view", "Ver graduações"],
  ["graduations.manage", "Gerenciar graduações"],

  ["evaluations.view", "Ver avaliações"],
  ["evaluations.manage", "Gerenciar avaliações"],

  ["finance.view", "Ver financeiro"],
  ["finance.manage", "Gerenciar financeiro"],

  ["events.view", "Ver eventos"],
  ["events.manage", "Gerenciar eventos"],

  ["competitions.view", "Ver competições"],
  ["competitions.manage", "Gerenciar competições"],

  ["timer.use", "Usar cronômetro"],
  ["timer.manage_pairs", "Gerenciar duplas"],

  ["users.view", "Ver usuários"],
  ["users.manage", "Gerenciar usuários e permissões"],

  ["settings.manage", "Gerenciar configurações"],

  ["site.view", "Ver conteúdo do site"],
  ["site.manage", "Gerenciar conteúdo do site"],
] as const;
const siteSettings = [
  {
    key: "site.name",
    value: "Rick Pereira Jiu-Jitsu",
  },
  {
    key: "site.shortName",
    value: "Rick Pereira",
  },
  {
    key: "site.description",
    value: "Gestão, disciplina, evolução e tecnologia para equipes de Jiu-Jitsu.",
  },

  {
    key: "nav.home.label",
    value: "Início",
  },
  {
    key: "nav.home.href",
    value: "/",
  },
  {
    key: "nav.team.label",
    value: "Equipe",
  },
  {
    key: "nav.team.href",
    value: "#equipe",
  },
  {
    key: "nav.system.label",
    value: "Sistema",
  },
  {
    key: "nav.system.href",
    value: "#sistema",
  },
  {
    key: "nav.events.label",
    value: "Eventos",
  },
  {
    key: "nav.events.href",
    value: "#eventos",
  },
  {
    key: "nav.timer.label",
    value: "Cronômetro",
  },
  {
    key: "nav.timer.href",
    value: "#cronometro",
  },
  {
    key: "nav.contact.label",
    value: "Contato",
  },
  {
    key: "nav.contact.href",
    value: "#contato",
  },
  {
    key: "nav.login.label",
    value: "Entrar",
  },
  {
    key: "nav.login.href",
    value: "/login",
  },
  {
    key: "nav.cta.label",
    value: "Quero conhecer",
  },
  {
    key: "nav.cta.href",
    value: "#contato",
  },

  {
    key: "home.hero.eyebrow",
    value: "DISCIPLINA • RESPEITO • EVOLUÇÃO • FAMÍLIA",
  },
  {
    key: "home.hero.sideTextLeft",
    value: "DISCIPLINA\nRESPEITO\nEVOLUÇÃO\nFAMÍLIA",
  },
  {
    key: "home.hero.sideTextRight",
    value: "FOCO\nDISCIPLINA\nRESPEITO\nEVOLUÇÃO\nSEMPRE.",
  },
  {
    key: "home.hero.title",
    value: "RICK PEREIRA JIU-JITSU",
  },
  {
    key: "home.hero.subtitle",
    value: "MAIS QUE UM ESPORTE, UM ESTILO DE VIDA.",
  },
  {
    key: "home.hero.description",
    value: "Treinamento de alto nível, disciplina, evolução e tecnologia para fortalecer ainda mais a equipe.",
  },
  {
    key: "home.hero.primaryButtonLabel",
    value: "Entrar no sistema",
  },
  {
    key: "home.hero.primaryButtonHref",
    value: "/login",
  },
  {
    key: "home.hero.secondaryButtonLabel",
    value: "Agendar aula experimental",
  },
  {
    key: "home.hero.secondaryButtonHref",
    value: "#contato",
  },
  {
    key: "home.hero.imageUrl",
    value: "",
  },
  {
    key: "home.hero.imagePublicId",
    value: "",
  },

  {
    key: "home.stats.students.value",
    value: "186",
  },
  {
    key: "home.stats.students.label",
    value: "Alunos Ativos",
  },
  {
    key: "home.stats.students.change",
    value: "+12%",
  },

  {
    key: "home.stats.attendance.value",
    value: "78%",
  },
  {
    key: "home.stats.attendance.label",
    value: "Presença Média",
  },
  {
    key: "home.stats.attendance.change",
    value: "+8%",
  },

  {
    key: "home.stats.graduations.value",
    value: "24",
  },
  {
    key: "home.stats.graduations.label",
    value: "Graduações no Ano",
  },
  {
    key: "home.stats.graduations.change",
    value: "+33%",
  },

  {
    key: "home.stats.events.value",
    value: "12",
  },
  {
    key: "home.stats.events.label",
    value: "Eventos Realizados",
  },
  {
    key: "home.stats.events.change",
    value: "+100%",
  },

  {
    key: "home.stats.payments.value",
    value: "R$ 12.480",
  },
  {
    key: "home.stats.payments.label",
    value: "Mensalidades em dia",
  },
  {
    key: "home.stats.payments.change",
    value: "+18%",
  },

  {
    key: "home.highlights.title",
    value: "Alunos Destaques",
  },
  {
    key: "home.highlights.subtitle",
    value: "Exemplos de disciplina, evolução e comprometimento.",
  },
  {
    key: "home.highlights.linkLabel",
    value: "Ver todos os alunos",
  },
  {
    key: "home.highlights.linkHref",
    value: "/login",
  },

  {
    key: "home.events.title",
    value: "Eventos Realizados",
  },
  {
    key: "home.events.subtitle",
    value: "Momentos que fortalecem a nossa equipe.",
  },
  {
    key: "home.events.linkLabel",
    value: "Ver todos os eventos",
  },
  {
    key: "home.events.linkHref",
    value: "/login",
  },

  {
    key: "home.timer.title",
    value: "Cronômetro Inteligente de Treino",
  },
  {
    key: "home.timer.subtitle",
    value: "Ferramenta prática e completa para um treino mais organizado e dinâmico.",
  },
  {
    key: "home.timer.sideText",
    value: "DO INÍCIO AO OSS, SEM COMPLICAÇÃO. TECNOLOGIA A FAVOR DA EVOLUÇÃO.",
  },

  {
    key: "home.location.title",
    value: "Como chegar ao treino",
  },
  {
    key: "home.location.subtitle",
    value: "Nossa sede está de portas abertas para receber você.",
  },
  {
    key: "home.location.name",
    value: "Rick Pereira Jiu-Jitsu",
  },
  {
    key: "home.location.address",
    value: "Endereço a cadastrar",
  },
  {
    key: "home.location.city",
    value: "Pindamonhangaba - SP",
  },
  {
    key: "home.location.zipCode",
    value: "",
  },
  {
    key: "home.location.latitude",
    value: "",
  },
  {
    key: "home.location.longitude",
    value: "",
  },
  {
    key: "home.location.mapButtonLabel",
    value: "Abrir no mapa",
  },
  {
    key: "home.location.imageUrl",
    value: "",
  },
  {
    key: "home.location.imagePublicId",
    value: "",
  },

  {
    key: "home.schedule",
    value: JSON.stringify([
      { day: "Segunda-feira", time: "A definir" },
      { day: "Quarta-feira", time: "A definir" },
      { day: "Sexta-feira", time: "A definir" },
      { day: "Sábado", time: "A definir" },
    ]),
  },

  {
    key: "home.contact.title",
    value: "Fale com a nossa equipe",
  },
  {
    key: "home.contact.subtitle",
    value: "Tire suas dúvidas, agende uma aula ou saiba mais sobre o sistema.",
  },
  {
    key: "home.contact.whatsapp",
    value: "",
  },
  {
    key: "home.contact.whatsappHint",
    value: "Converse agora",
  },
  {
    key: "home.contact.instagram",
    value: "",
  },
  {
    key: "home.contact.instagramHint",
    value: "Acompanhe nossa rotina",
  },
  {
    key: "home.contact.phone",
    value: "",
  },
  {
    key: "home.contact.phoneHint",
    value: "Fale com nossa equipe",
  },
  {
    key: "home.contact.email",
    value: "",
  },
  {
    key: "home.contact.emailHint",
    value: "Envie sua mensagem",
  },

  {
    key: "home.contact.form.namePlaceholder",
    value: "Nome completo",
  },
  {
    key: "home.contact.form.emailPlaceholder",
    value: "Seu e-mail",
  },
  {
    key: "home.contact.form.messagePlaceholder",
    value: "Sua mensagem",
  },
  {
    key: "home.contact.form.submitLabel",
    value: "Enviar mensagem",
  },

  {
    key: "footer.slogan",
    value: "Jiu-Jitsu transforma pessoas.",
  },
  {
    key: "footer.description",
    value: "Disciplina, evolução, gestão. Em um só sistema.",
  },
  {
    key: "footer.copyright",
    value: "© 2026 Rick Pereira Jiu-Jitsu. Todos os direitos reservados.",
  },

  {
    key: "footer.links",
    value: JSON.stringify([
      { label: "Início", href: "/" },
      { label: "Equipe", href: "#equipe" },
      { label: "Sistema", href: "#sistema" },
      { label: "Eventos", href: "#eventos" },
      { label: "Cronômetro", href: "#cronometro" },
      { label: "Contato", href: "#contato" },
      { label: "Política de Privacidade", href: "/politica-de-privacidade" },
      { label: "Termos de Uso", href: "/termos-de-uso" },
    ]),
  },

  {
    key: "footer.instagram",
    value: "",
  },
  {
    key: "footer.youtube",
    value: "",
  },
  {
    key: "footer.facebook",
    value: "",
  },
];


const mainFeatures = [
  {
    slug: "sistema-gestao",
    title: "Sistema de Gestão Completo",
    description: "Controle de alunos, presença, mensalidades, graduações e muito mais.",
    linkLabel: "Ver mais",
    linkHref: "/login",
    sortOrder: 1,
  },
  {
    slug: "dashboard-inteligente",
    title: "Dashboard Inteligente",
    description: "Acompanhe o crescimento da equipe em tempo real com dados, indicadores e relatórios.",
    linkLabel: "Ver mais",
    linkHref: "/login",
    sortOrder: 2,
  },
  {
    slug: "cronometro-treino",
    title: "Cronômetro de Treino",
    description: "Organize seus treinos com cronômetro simples ou rodízio inteligente de duplas.",
    linkLabel: "Ver mais",
    linkHref: "/cronometro",
    sortOrder: 3,
  },
];

const timerFeatures = [
  {
    slug: "cronometro-simples",
    title: "Cronômetro Simples",
    description: "Ideal para treinos tradicionais. Configure tempo de luta, descanso e rounds de forma simples.",
    bullets: [
      "Tempo de luta",
      "Tempo de descanso",
      "Quantidade de rounds",
      "Sinal sonoro",
      "Alerta visual no último minuto",
      "Modo tela cheia",
    ],
    linkLabel: "Abrir cronômetro",
    linkHref: "/cronometro",
    sortOrder: 1,
  },
  {
    slug: "rodizio-duplas",
    title: "Rodízio de Duplas",
    description: "Utilize os alunos presentes no treino para organizar as duplas e controlar automaticamente as trocas.",
    bullets: [
      "Alunos presentes no dia",
      "Casamento livre de duplas",
      "Rodízio automático",
      "Evita repetições",
      "Opção por faixa",
      "Opção por peso",
      "Controle de rounds",
    ],
    linkLabel: "Abrir rodízio",
    linkHref: "/cronometro",
    sortOrder: 2,
  },
];

const highlights = [
  {
    studentName: "Aluno Destaque 01",
    title: "Maior frequência",
    description: "Aluno com excelente participação e presença nos treinos.",
    sortOrder: 1,
  },
  {
    studentName: "Aluno Destaque 02",
    title: "Destaque do mês",
    description: "Evolução técnica, dedicação e comprometimento durante o mês.",
    sortOrder: 2,
  },
  {
    studentName: "Aluno Destaque 03",
    title: "Evolução do mês",
    description: "Grande evolução técnica durante os treinamentos.",
    sortOrder: 3,
  },
  {
    studentName: "Aluno Destaque 04",
    title: "Espírito de equipe",
    description: "Referência de respeito e companheirismo dentro e fora do tatame.",
    sortOrder: 4,
  },
];

const events = [
  {
    title: "Campeonato Interno",
    description: "Competição interna para integração e desenvolvimento dos alunos.",
    type: EventType.COMPETITION,
    startsAt: new Date("2026-03-12T12:00:00.000Z"),
    location: "Rick Pereira Jiu-Jitsu",
  },
  {
    title: "Seminário Especial",
    description: "Seminário técnico para alunos e convidados.",
    type: EventType.SEMINAR,
    startsAt: new Date("2026-04-05T12:00:00.000Z"),
    location: "Rick Pereira Jiu-Jitsu",
  },
  {
    title: "Cerimônia de Graduação",
    description: "Momento especial de reconhecimento da evolução dos alunos.",
    type: EventType.GRADUATION,
    startsAt: new Date("2026-05-15T12:00:00.000Z"),
    location: "Rick Pereira Jiu-Jitsu",
  },
  {
    title: "Confraternização da Equipe",
    description: "Encontro de integração entre alunos, professores e familiares.",
    type: EventType.SOCIAL,
    startsAt: new Date("2026-06-20T12:00:00.000Z"),
    location: "Rick Pereira Jiu-Jitsu",
  },
];

async function seedPermissions() {
  for (const [code, label] of permissionSeeds) {
    await prisma.permission.upsert({
      where: { code },
      update: { label },
      create: { code, label },
    });
  }
}

async function seedAdmin() {
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {
      description: "Acesso administrativo total",
      isSystem: true,
    },
    create: {
      name: "ADMIN",
      description: "Acesso administrativo total",
      isSystem: true,
    },
  });

  const permissions = await prisma.permission.findMany();

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  let admin = await prisma.user.findFirst({
    where: {
      email: {
        in: [ADMIN_EMAIL, OLD_ADMIN_EMAIL],
      },
    },
  });

  if (admin) {
    admin = await prisma.user.update({
      where: { id: admin.id },
      data: {
        name: "Administrador Rick Pereira",
        email: ADMIN_EMAIL,
      },
    });
  } else {
    admin = await prisma.user.create({
      data: {
        name: "Administrador Rick Pereira",
        email: ADMIN_EMAIL,
        passwordHash,
      },
    });
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });
}

async function seedClassGroups() {
  const groups = ["Adulto Iniciante", "Adulto Avançado", "Infantil"];

  for (const name of groups) {
    await prisma.classGroup.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function seedSiteSettings() {
  for (const setting of siteSettings) {
    const exists = await prisma.siteSetting.findUnique({
      where: { key: setting.key },
    });

    if (!exists) {
      await prisma.siteSetting.create({
        data: {
          key: setting.key,
          value: setting.value,
        },
      });
    }
  }
}

async function seedMainFeatures() {
  for (const feature of mainFeatures) {
    await prisma.siteCard.upsert({
      where: { slug: feature.slug },
      update: {},
      create: {
        slug: feature.slug,
        section: SiteCardSection.MAIN_FEATURE,
        title: feature.title,
        description: feature.description,
        linkLabel: feature.linkLabel,
        linkHref: feature.linkHref,
        imageUrl: null,
        imagePublicId: null,
        active: true,
        sortOrder: feature.sortOrder,
      },
    });
  }
}

async function seedTimerFeatures() {
  for (const timer of timerFeatures) {
    await prisma.siteCard.upsert({
      where: { slug: timer.slug },
      update: {},
      create: {
        slug: timer.slug,
        section: SiteCardSection.TIMER_FEATURE,
        title: timer.title,
        description: timer.description,
        bullets: timer.bullets,
        linkLabel: timer.linkLabel,
        linkHref: timer.linkHref,
        imageUrl: null,
        imagePublicId: null,
        active: true,
        sortOrder: timer.sortOrder,
      },
    });
  }
}

async function seedHighlights() {
  const count = await prisma.highlight.count();

  if (count > 0) {
    return;
  }

  for (const highlight of highlights) {
    await prisma.highlight.create({
      data: {
        studentName: highlight.studentName,
        title: highlight.title,
        description: highlight.description,
        photoUrl: null,
        photoPublicId: null,
        active: true,
        sortOrder: highlight.sortOrder,
      },
    });
  }
}

async function seedEvents() {
  const count = await prisma.event.count();

  if (count > 0) {
    return;
  }

  for (const event of events) {
    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        type: event.type,
        startsAt: event.startsAt,
        location: event.location,
        coverUrl: null,
        coverPublicId: null,
        published: true,
      },
    });
  }
}

async function main() {
  console.log("");
  console.log("========================================");
  console.log("RICK PEREIRA JIU-JITSU");
  console.log("Iniciando seed...");
  console.log("========================================");
  console.log("");

  await seedPermissions();
  console.log("✓ Permissões");

  await seedAdmin();
  console.log("✓ Administrador");

  await seedClassGroups();
  console.log("✓ Turmas");

  await seedSiteSettings();
  console.log("✓ Configurações do site");

  await seedMainFeatures();
  console.log("✓ Cards principais");

  await seedTimerFeatures();
  console.log("✓ Cards dos cronômetros");

  await seedHighlights();
  console.log("✓ Alunos destaque");

  await seedEvents();
  console.log("✓ Eventos");

  console.log("");
  console.log("========================================");
  console.log("SEED CONCLUÍDO COM SUCESSO");
  console.log("========================================");
  console.log("");
  console.log(`Login: ${ADMIN_EMAIL}`);
  console.log(`Senha: ${ADMIN_PASSWORD}`);
  console.log("");
  console.log("Imagens aguardando cadastro no Cloudinary.");
  console.log("");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
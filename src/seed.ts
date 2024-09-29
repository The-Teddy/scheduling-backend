import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserEntity } from './database/entities/user.entity'; // Atualize o caminho conforme necessário
import { v4 as uuidv4 } from 'uuid';
import { hashSync as encrypt } from 'bcrypt';
import { CategoryEntity } from './database/entities/category.entity';

config(); // Carrega as variáveis do arquivo .env

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: configService.get<'mysql' | 'postgres'>('TYPEORM_TYPE'),
  host: configService.get<string>('TYPEORM_HOST'),
  port: configService.get<number>('TYPEORM_PORT'),
  username: configService.get<string>('TYPEORM_USER'),
  password: configService.get<string>('TYPEORM_PASSWORD'),
  database: configService.get<string>('TYPEORM_DATABASE'),
  entities: [__dirname + '/database/entities/**/*{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  synchronize: false,
});

const initializeConnection = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conexão com o banco de dados inicializada!');
    }
  } catch (error) {
    console.error('Erro ao inicializar a conexão com o banco de dados:', error);
    process.exit(1);
  }
};

// Função para fechar a conexão com o banco de dados
const closeConnection = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Conexão com o banco de dados fechada');
    }
  } catch (error) {
    console.error('Erro ao fechar a conexão com o banco de dados:', error);
    process.exit(1);
  }
};

const createUsers = async () => {
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);

    const superAdminEmail = 'superadmin@scheduling.com';
    const adminEmail = 'admin@scheduling.com';
    const supportEmail = 'support@scheduling.com';

    const superAdmin = userRepository.create({
      id: Buffer.from(uuidv4().replace(/-/g, ''), 'hex'),
      name: 'Marcio Super admin',
      email: superAdminEmail,
      role: 'super-admin',
      password: encrypt('marcio123', 15),
      isActive: true,
      emailVerified: true,
      birthDate: new Date('1999-05-24'),
    });
    const admin = userRepository.create({
      id: Buffer.from(uuidv4().replace(/-/g, ''), 'hex'),
      name: 'Marcio admin',
      email: adminEmail,
      role: 'admin',
      password: encrypt('marcio123', 15),
      isActive: true,
      emailVerified: true,
      birthDate: new Date('1999-05-24'),
    });
    const support = userRepository.create({
      id: Buffer.from(uuidv4().replace(/-/g, ''), 'hex'),
      name: 'Marcio Support',
      email: supportEmail,
      role: 'support',
      password: encrypt('marcio123', 15),
      isActive: true,
      emailVerified: true,
      birthDate: new Date('1999-05-24'),
    });

    let hasSuperAdmin = await userRepository.findOne({
      where: {
        role: 'super-admin',
        email: superAdminEmail,
      },
    });
    if (!hasSuperAdmin) {
      hasSuperAdmin = await userRepository.save(superAdmin);
      console.log('Super admin criado com sucesso');
    } else {
      console.log('Super admin já existe na base de dados');
    }

    const hasAdmin = await userRepository.findOne({
      where: {
        email: adminEmail,
      },
    });
    if (!hasAdmin) {
      await userRepository.save(admin);
      console.log('Admin criado com sucesso!');
    } else {
      console.log('Admin já existe na base de dados');
    }

    const hasSupport = await userRepository.findOne({
      where: {
        email: supportEmail,
      },
    });
    if (!hasSupport) {
      await userRepository.save(support);
      console.log('Support criado com sucesso');
    } else {
      console.log('Support já existe na base de dados');
    }

    return hasSuperAdmin;
  } catch (error) {
    console.error(
      'Erro durante a inicialização ou propagação da fonte de dados:',
      error,
    );
    process.exit(1);
  }
};

const createCategories = async (superAdmin: UserEntity) => {
  try {
    const categoryRepository = AppDataSource.getRepository(CategoryEntity);

    const categories = [
      {
        name: 'Academia',
        description:
          'Oferece serviços de condicionamento físico, como musculação, cardio, aulas de ginástica, e atividades voltadas para o bem-estar físico e a saúde. Academias geralmente possuem profissionais especializados em treinamento físico para ajudar os clientes a atingirem suas metas de saúde e fitness.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Barbearia',
        description:
          'Especializada no cuidado masculino, uma barbearia oferece serviços como corte de cabelo, barba, bigode e cuidados estéticos masculinos. Muitas vezes, elas também oferecem tratamentos de pele, relaxamento e atendimento personalizado.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Salão de Beleza',
        description:
          'Um espaço voltado para o público feminino (e masculino), que oferece serviços como cortes de cabelo, coloração, tratamentos capilares, maquiagem, manicure, pedicure, e até serviços de estética como limpeza de pele e depilação.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Personal Trainer',
        description:
          'Profissional especializado em treinos personalizados que ajudam a alcançar objetivos específicos de saúde e condicionamento físico. Um personal trainer oferece planos de exercícios individualizados e acompanhamento detalhado, ajustando rotinas de treino conforme as necessidades e progresso dos clientes.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Clínica de Estética',
        description:
          'Oferece tratamentos de beleza e estética, como limpeza de pele, peelings, tratamentos corporais (como drenagem linfática), depilação a laser, microagulhamento, entre outros serviços voltados para o bem-estar e melhoria da aparência física.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Tatuagem e Piercing',
        description:
          'Estabelecimentos especializados na criação de arte corporal, oferecendo serviços de tatuagem artística e aplicação de piercings. Artistas de tatuagem muitas vezes personalizam desenhos para os clientes e seguem rigorosos padrões de higiene para a segurança do procedimento.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Manicure e Pedicure',
        description:
          'Focados no cuidado das unhas das mãos e dos pés, oferecendo serviços como corte, polimento, esmaltação, hidratação e tratamento de unhas. Além disso, muitos profissionais também oferecem técnicas avançadas, como alongamento de unhas e designs personalizados.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Massoterapia',
        description:
          'Profissionais especializados em técnicas de massagem que promovem o relaxamento, alívio de tensões musculares, melhora da circulação sanguínea e bem-estar geral. Massoterapeutas podem oferecer diferentes tipos de massagens, como relaxante, terapêutica, desportiva, entre outras.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Fotografia',
        description:
          'Serviços profissionais de fotografia, que podem incluir desde sessões fotográficas pessoais (ensaios, casamentos, eventos), até fotografia publicitária ou de produtos. Fotógrafos profissionais têm conhecimento técnico para capturar imagens de qualidade e editar fotos conforme necessário.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Consultoria',
        description:
          'Oferece serviços especializados de aconselhamento e estratégia em diversas áreas, como negócios, finanças, marketing, recursos humanos, entre outros. Consultores ajudam empresas ou indivíduos a alcançarem suas metas com soluções personalizadas e orientações baseadas em análise e experiência.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Fisioterapia',
        description:
          'Tratamento de lesões e condições físicas por meio de técnicas de reabilitação para restaurar a mobilidade e função do corpo.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Nutrição',
        description:
          'Planejamento de dietas personalizadas para promover hábitos alimentares saudáveis e equilibrados.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Psicologia',
        description:
          'Atendimento terapêutico para apoio emocional e mental, promovendo bem-estar e saúde psicológica.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Aulas de Música',
        description:
          'Ensino de instrumentos musicais e teoria musical para alunos de diferentes níveis.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Aulas de Idiomas',
        description:
          'Ensino de línguas estrangeiras com foco em fluência e comunicação eficaz.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Pilates',
        description:
          'Exercícios físicos focados em fortalecimento, flexibilidade e alinhamento corporal.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Yoga',
        description:
          'Prática física e meditativa para equilíbrio, força e flexibilidade do corpo e mente.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Coaching',
        description:
          'Orientação e mentoria para alcançar metas pessoais ou profissionais.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Terapeuta Holístico',
        description:
          'Tratamentos alternativos para o equilíbrio entre corpo, mente e espírito.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Serviços de Pet Shop',
        description:
          'Cuidados e estética para animais de estimação, como banho e tosa.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Educação Infantil',
        description:
          'Serviços de educação e cuidado para crianças em fase de desenvolvimento.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Eventos e Decoração',
        description:
          'Planejamento e organização de eventos, além de decoração temática.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Reformas e Construção',
        description:
          'Execução de obras e reformas em espaços residenciais ou comerciais.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Serviços de TI',
        description:
          'Suporte e desenvolvimento de soluções tecnológicas para empresas e indivíduos.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Cabeleireiro',
        description:
          'Serviços de corte, coloração e tratamentos para diferentes tipos de cabelos.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Designer Gráfico',
        description:
          'Criação de materiais visuais como logos, banners e campanhas publicitárias.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Marketing Digital:',
        description:
          'Desenvolvimento de estratégias online para aumentar a visibilidade e conversão de negócios.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Desenvolvimento Web',
        description:
          'Criação e manutenção de sites e plataformas digitais personalizadas.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Consultoria Financeira',
        description:
          'Orientação e planejamento para gestão de finanças pessoais ou empresariais.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Advocacia',
        description:
          'Serviços jurídicos em diversas áreas do direito, como trabalhista, civil ou empresarial.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Contabilidade',
        description:
          'Gerenciamento de tributos, impostos e finanças para empresas e autônomos.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Jardinagem',
        description:
          'Manutenção e design de jardins e áreas verdes, oferecendo cuidados especializados para plantas.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Dedetização',
        description:
          'Controle de pragas urbanas, oferecendo soluções para eliminar insetos e roedores.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Transporte e Logística',
        description:
          'Serviços de entrega e transporte de cargas e mercadorias.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Mecânica Automotiva',
        description:
          'Reparos e manutenção em veículos automotivos, incluindo troca de peças e revisões.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Lavagem de Carros',
        description:
          'Limpeza completa de veículos, tanto interna quanto externamente.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Decoração de Interiores',
        description:
          'Planejamento e design de ambientes, incluindo escolha de móveis, cores e iluminação.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Babá e Cuidador Infantil',
        description:
          'Serviços de cuidados e monitoramento de crianças em tempo integral ou parcial.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Cuidador de Idosos',
        description:
          'Assistência a idosos, oferecendo suporte em atividades diárias e cuidados de saúde.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Costura e Ajustes de Roupas',
        description:
          'Consertos e ajustes de peças de vestuário para um caimento perfeito.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Chaveiro',
        description:
          'Serviços de abertura de portas e confecção de chaves para residências, veículos e comércios.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Eletricista',
        description:
          'Instalação e manutenção de sistemas elétricos em residências ou empresas.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Encanador',
        description:
          'Reparos e instalações de sistemas hidráulicos e encanamentos.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Marcenaria',
        description:
          'Fabricação e reparo de móveis sob medida, como armários e estantes.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Serviços de Limpeza',
        description:
          'Limpeza residencial, comercial e pós-obra, com atenção a todos os detalhes.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Manutenção de Equipamentos Eletrônicos',
        description:
          'Reparos e atualizações de computadores, celulares e outros dispositivos eletrônicos.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Produção Audiovisual',
        description:
          'Gravação e edição de vídeos para eventos, empresas ou projetos pessoais.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Aluguel de Equipamentos',
        description:
          'Locação de ferramentas, maquinários ou equipamentos para eventos e obras.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Personal Organizer',
        description:
          'Organização de espaços residenciais e comerciais para otimizar o uso e a estética.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
      {
        name: 'Gestão de Redes Sociais',
        description:
          'Criação e manutenção de perfis em redes sociais para aumentar o engajamento e a presença digital de empresas.',
        isActive: true,
        observation: `Categoria criada, revisada e aprovada por ${superAdmin.name}`,
        createdBy: superAdmin.id,
        isSuggested: false,
        analizedBy: superAdmin.id,
        analizedByName: superAdmin.name,
        createdByName: superAdmin.name,
        approvalStatus: 'aprovado',
      },
    ];

    for (const category of categories) {
      const existingCategory = await categoryRepository.findOne({
        where: { name: category.name },
      });

      if (!existingCategory) {
        await categoryRepository.save({
          name: category.name,
          description: category.description,
          observation: category.observation,
          isActive: category.isActive,
          createdBy: category.createdBy,
          isSuggested: category.isSuggested,
          analizedBy: category.analizedBy,
          analizedByName: category.analizedByName,
          createdByName: category.createdByName,
          approvalStatus: 'aprovado',
        });
        console.log(`Categoria ${category.name} criada com sucesso!`);
      } else {
        console.log(`Categoria ${category.name} já existe.`);
      }
    }
  } catch (error) {
    console.error(
      'Erro durante a inicialização ou propagação da fonte de dados:',
      error,
    );
    process.exit(1);
  }
};

// Executa a função de seeding
const main = async () => {
  try {
    await initializeConnection(); // Inicializar conexão

    const superAdmin = await createUsers(); // Criar usuários
    await createCategories(superAdmin); // Criar categorias
  } catch (error) {
    console.error('Erro no processo de criação:', error);
  } finally {
    await closeConnection(); // Fechar a conexão no final de tudo
  }
};

main();

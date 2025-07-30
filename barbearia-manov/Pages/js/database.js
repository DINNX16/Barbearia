// =======================================================
//          BANCO DE DADOS CENTRAL DE PRODUTOS
//  Este arquivo serve como um banco de dados temporário.
//  No futuro, você pode substituir o conteúdo deste arquivo
//  por uma chamada de API para buscar os dados de um
//  banco de dados real.
// =======================================================

// --- Produtos da Página "Ferramentas" ---
const masterProductsMaquinas = [
  { id: 1, title: "Wahl Magic Clip Cordless", price: "699.90", category: "maquinas-corte", brand: "Wahl", icon: "⚡️" },
  { id: 2, title: "Andis Slimline Pro Li", price: "489.90", category: "maquinas-acabamento", brand: "Andis", icon: "✒️" },
  { id: 3, title: "BabylissPRO GoldFX", price: "1299.90", category: "maquinas-corte", brand: "BabylissPRO", icon: "✨" },
  { id: 4, title: "Wahl Senior Cordless", price: "899.00", category: "maquinas-corte", brand: "Wahl", icon: "🔌" },
  { id: 5, title: "Andis Master Cordless", price: "1100.00", category: "maquinas-corte", brand: "Andis", icon: "🔥" },
  { id: 6, title: "BabylissPRO Lo-PROFX", price: "950.00", category: "maquinas-acabamento", brand: "BabylissPRO", icon: "✍️" },
];

const masterProductsLaminas = [
  { id: 7, title: "Tesoura Jaguar Fio Laser 6.0", price: "350.00", category: "tesouras", brand: "Jaguar", icon: "✂️" },
  { id: 8, title: "Navalhete de Aço Inox", price: "55.00", category: "laminas", brand: "Wahl", icon: "🔪" },
  { id: 9, title: "Tesoura de Desbaste Jaguar", price: "320.00", category: "tesouras", brand: "Jaguar", icon: "🌿" },
  { id: 10, title: "Lâmina de Cerâmica (Magic Clip)", price: "120.00", category: "laminas", brand: "Wahl", icon: "❄️" },
  { id: 11, title: "Navalhete Profissional Gold", price: "89.90", category: "laminas", brand: "BabylissPRO", icon: "🌟" },
  { id: 12, title: "Tesoura Fio Navalha 7.0", price: "450.00", category: "tesouras", brand: "Andis", icon: "💎" },
];

const tableProductsFerramentas = [
  { id: 13, title: "Kit Pentes Premium Wahl", price: "150.00", icon: "📊" },
  { id: 14, title: "Óleo Lubrificante", price: "25.00", icon: "💧" },
  { id: 15, title: "Escova de Disfarce", price: "35.00", icon: "🖌️" },
  { id: 16, title: "Espanador de Cerdas Macias", price: "45.00", icon: "💨" },
  { id: 17, title: "Capa de Corte Premium", price: "99.00", icon: "👕" },
  { id: 18, title: "Kit Completo BabylissPRO", price: "2500.00", icon: "💼" },
  { id: 19, title: "Bancada Auxiliar de Aço", price: "350.00", icon: "🔩" },
  { id: 20, title: "Esterilizador UV para Ferramentas", price: "299.00", icon: "💡" },
];


// --- Produtos da Página "Acessórios" ---
const masterProductsAcessorios = [
  { id: 21, title: "Pomada Clássica", price: "45.90", category: "pomadas", brand: "QOD", icon: "💧" },
  { id: 22, title: "Óleo para Barba", price: "35.90", category: "oleos", brand: "TrueMan", icon: "🧴" },
  { id: 23, title: "Pente de Madeira", price: "19.90", category: "acessorios", brand: "Uppercut", icon: "🪮" },
  { id: 24, title: "Gel Fixador", price: "25.90", category: "pomadas", brand: "TrueMan", icon: "💧" },
  { id: 25, title: "Shampoo Anticaspa", price: "29.90", category: "oleos", brand: "QOD", icon: "🧴" },
  { id: 26, title: "Cera Modeladora", price: "32.90", category: "pomadas", brand: "Uppercut", icon: "🕯️" },
];

const masterProductsFerramentasAcessorios = [
  { id: 27, title: "Máquina Profissional", price: "299.90", category: "ferramentas", brand: "QOD", icon: "✂️" },
  { id: 28, title: "Navalhete de Aço", price: "55.00", category: "ferramentas", brand: "Uppercut", icon: "🔪" },
  { id: 29, title: "Tesoura Fio Navalha", price: "120.00", category: "ferramentas", brand: "TrueMan", icon: "✂️" },
  { id: 30, title: "Borrifador de Alumínio", price: "25.00", category: "acessorios", brand: "QOD", icon: "💨" },
  { id: 31, title: "Capa de Corte", price: "49.90", category: "acessorios", brand: "TrueMan", icon: "👕" },
  { id: 32, title: "Pincéis Profissionais", price: "89.90", category: "ferramentas", brand: "Uppercut", icon: "🖌️" },
];

const tableProductsAcessorios = [
  { id: 33, title: "Loção Pós-Barba", price: "42.50", icon: "🌿" },
  { id: 34, title: "Balm Modelador", price: "38.00", icon: "✨" },
  { id: 35, title: "Escova de Cerdas", price: "22.00", icon: "🖌️" },
  { id: 36, title: "Pó Modelador", price: "55.00", icon: "💨" },
  { id: 37, title: "Spray de Brilho", price: "33.70", icon: "💧" },
  { id: 38, title: "Kit Viagem", price: "99.90", icon: "✈️" },
  { id: 39, title: "Toalha Quente", price: "15.00", icon: "🧖" },
  { id: 40, title: "Tônico Capilar", price: "65.00", icon: "🌱" },
];

// Mapeamento para identificar a origem de cada produto.
// Isso nos ajudará a saber onde cada produto pertence.
const allProductSources = {
    'masterProductsMaquinas': masterProductsMaquinas,
    'masterProductsLaminas': masterProductsLaminas,
    'tableProductsFerramentas': tableProductsFerramentas,
    'masterProductsAcessorios': masterProductsAcessorios,
    'masterProductsFerramentasAcessorios': masterProductsFerramentasAcessorios,
    'tableProductsAcessorios': tableProductsAcessorios,
}
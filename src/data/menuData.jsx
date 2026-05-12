import React from 'react';
import { Pizza, Sandwich, CupSoda, Utensils } from 'lucide-react';

export const MENU_DATA = {
  estabelecimento: {
    nome: "MC Padaria & Pizzaria",
    whatsapp: "5563984135972",
    instagram: "https://www.instagram.com/mcpadariaepizzaria/"
  },
  categorias: [
    {
      id: "pasteis",
      titulo: "Pastéis",
      fotoPadrao: "/items/1.webp",
      itens: [
        { nome: "Carne", preco: 10.00 }, { nome: "Frango", preco: 10.00 }, { nome: "Queijo", preco: 10.00 }, { nome: "Calabresa", preco: 10.00 },
        { nome: "Carne/Queijo", preco: 12.00 }, { nome: "Frango/Queijo", preco: 12.00 }, { nome: "Frango/Catupiry", preco: 12.00 },
        { nome: "Queijo Catupiry", preco: 12.00 }, { nome: "Presunto/Queijo", preco: 12.00 }, { nome: "Pizza", preco: 12.00 },
        { nome: "Calabresa/Queijo", preco: 12.00 }, { nome: "Bacon", preco: 13.00 }, { nome: "Carne de Sol", preco: 13.00 },
        { nome: "Bacon/Queijo", preco: 15.00 }, { nome: "Carne de Sol/Queijo", preco: 15.00 }
      ]
    },
    {
      id: "pizzas_tradicionais",
      titulo: "Pizzas Tradicionais",
      descricao: "Escolha entre 6 fatias (6 ft) ou 8 fatias (8 ft)",
      precos_base: { "6ft": 35.00, "8ft": 45.00 },
      opcionais_bordas: [
        { nome: "Sem Borda", preco: 0 }, { nome: "Borda Cheddar", preco: 5.00 },
        { nome: "Borda Catupiry", preco: 5.00 }, { nome: "Borda Queijo", preco: 10.00 }
      ],
      adicionais_pizza: [
        { nome: "Adicional Extra (Descreva na obs.)", preco: 7.00 }
      ],
      itens: [
        { nome: "Calabresa", ingredientes: "molho, mussarela, calabresa, orégano", imagem: "/items/Calabresa.webp" },
        { nome: "Moda da Casa", ingredientes: "molho, mussarela, frango, cebola, azeitona, orégano", imagem: "/items/Moda da Casa.webp" },
        { nome: "Portuguesa", ingredientes: "molho, mussarela, presunto, ovos, cebola, orégano", imagem: "/items/Portuguesa.webp" },
        { nome: "Marguerita", ingredientes: "molho, mussarela, tomate, azeitona, orégano", imagem: "/items/Marguerita.webp" },
        { nome: "Frango Crocante", ingredientes: "molho, mussarela, frango, batata palha, tomate, azeitona, orégano", imagem: "/items/Frango Crocante.webp" },
        { nome: "Calabresa/Acebolada", ingredientes: "molho, mussarela, calabresa, cebola, orégano", imagem: "/items/Calabresa-Acebolada.webp" },
        { nome: "Calabresa/Catupiry", ingredientes: "molho, mussarela, calabresa, catupiry, orégano", imagem: "/items/Calabresa-Catupiry.webp" },
        { nome: "Calabresa/Cheddar", ingredientes: "molho, mussarela, calabresa, cheddar, orégano", imagem: "/items/Calabresa-Cheddar.webp" },
        { nome: "Frango", ingredientes: "molho, mussarela, frango, milho, azeitona, orégano", imagem: "/items/Frango.webp" },
        { nome: "Frango Catupiry", ingredientes: "molho, mussarela, frango, catupiry, orégano", imagem: "/items/Frango Catupiry.webp" },
        { nome: "Bauru", ingredientes: "molho, mussarela, presunto, tomate, orégano", imagem: "/items/Bauru.webp" },
        { nome: "Presunto/Queijo", ingredientes: "molho, mussarela, presunto, azeitona, orégano", imagem: "/items/Presunto-Queijo.webp" },
        { nome: "Milho", ingredientes: "molho, mussarela, milho, azeitona, orégano", imagem: "/items/Milho.webp" },
        { nome: "Bacon", ingredientes: "molho, mussarela, bacon, azeitona, orégano", imagem: "/items/Bacon.webp" },
        { nome: "Baianinha", ingredientes: "molho, mussarela, calabresa, ovo, cebola, tomate, pimenta calabresa, orégano", imagem: "/items/Baianinha.webp" }
      ]
    },
    {
      id: "pizzas_especiais",
      titulo: "Pizzas Especiais",
      precos_base: { "6ft": 45.00, "8ft": 55.00 },
      opcionais_bordas: [
        { nome: "Sem Borda", preco: 0 }, { nome: "Borda Cheddar", preco: 5.00 },
        { nome: "Borda Catupiry", preco: 5.00 }, { nome: "Borda Queijo", preco: 10.00 }
      ],
      adicionais_pizza: [
        { nome: "Adicional Extra (Descreva na obs.)", preco: 7.00 }
      ],
      itens: [
        { nome: "Carne de Sol", ingredientes: "molho, mussarela, carne de sol, cebola, tomate, orégano", imagem: "/items/Carne de Sol.webp" },
        { nome: "Carne de Sol/Banana", ingredientes: "molho, mussarela, carne de sol, banana da terra, cebola, tomate, azeitona, orégano", imagem: "/items/Carne de Sol-Banana.webp" },
        { nome: "Nordestina", ingredientes: "molho, mussarela, carne de sol, pimentão, pimenta, tomate, azeitona, orégano", imagem: "/items/Nordestina.webp" },
        { nome: "Estrogonofe/Carne", ingredientes: "molho, mussarela, estrogonofe de carne, milho, azeitona, orégano", imagem: "/items/Estrogonofe-Carne.webp" },
        { nome: "Estrogonofe/Carne de Sol", ingredientes: "molho, mussarela, estrogonofe, carne de sol, milho, azeitona, orégano", imagem: "/items/Estrogonofe-Carne de Sol.webp" },
        { nome: "Estrogonofe/Carne (c/ Batata Palha)", ingredientes: "molho, mussarela, estrogonofe de carne, milho, batata palha, orégano", imagem: "/items/Estrogonofe-Carne (c-Batata Palha).webp" },
        { nome: "Estrogonofe/Frango", ingredientes: "molho, mussarela, estrogonofe de frango, batata palha, milho, orégano", imagem: "/items/Estrogonofe-Frango.webp" },
        { nome: "Frango Especial", ingredientes: "molho, mussarela, frango, bacon, milho, azeitona, orégano", imagem: "/items/Frango Especial.webp" },
        { nome: "Americana", ingredientes: "molho, mussarela, bacon, tomate, cebola, ovos, orégano", imagem: "/items/Americana.webp" },
        { nome: "4 Queijos", ingredientes: "molho, mussarela, catupiry, cheddar, parmesão, orégano", imagem: "/items/4 Queijos.webp" }
      ]
    },
    {
      id: "hamburgueres",
      titulo: "Hambúrgueres",
      adicionais_hamburguer: [
        { nome: "Salsicha", preco: 2.00 }, { nome: "Ovo", preco: 2.00 }, { nome: "Queijo", preco: 3.00 },
        { nome: "Hambúrguer Extra", preco: 5.00 }, { nome: "Bacon Extra", preco: 5.00 }, { nome: "Calabresa Extra", preco: 5.00 }
      ],
      itens: [
        { nome: "Hambúrguer", preco: 10.00, ingredientes: "Pão, hambúrguer, queijo, alface e tomate" },
        { nome: "X-Burguer", preco: 12.00, ingredientes: "Pão, hambúrguer, presunto, queijo, alface, tomate, milho e batata palha" },
        { nome: "X-Burguer Especial", preco: 15.00, ingredientes: "Pão, hambúrguer, presunto, queijo, alface, tomate, milho, batata palha e ovo" },
        { nome: "X-Bacon", preco: 15.00, ingredientes: "Pão, hambúrguer, bacon, presunto, queijo, alface, tomate e batata palha" },
        { nome: "X-Bacon Especial", preco: 18.00, ingredientes: "Pão, hambúrguer, bacon, presunto, queijo, ovo, alface, tomate, milho e batata palha" },
        { nome: "X-Calabresa", preco: 15.00, ingredientes: "Pão, hambúrguer, calabresa, presunto, queijo, alface, tomate, milho e batata palha" },
        { nome: "X-Calabresa Especial", preco: 18.00, ingredientes: "Pão, hambúrguer, calabresa, ovo, presunto, queijo, alface, tomate, milho e batata palha" },
        { nome: "X-Salada", preco: 10.00, ingredientes: "Pão, hambúrguer, alface e tomate" },
        { nome: "X-Milho", preco: 12.00, ingredientes: "Pão, hambúrguer, queijo, alface, tomate e milho" },
        { nome: "X-Milho Especial", preco: 15.00, ingredientes: "Pão, hambúrguer, queijo, ovo, alface, tomate e milho" },
        { nome: "X-Tudo", preco: 20.00, ingredientes: "Pão, hambúrguer, queijo, presunto, bacon, calabresa, alface, tomate, milho e batata palha" }
      ]
    },
    {
      id: "bebidas",
      titulo: "Bebidas",
      itens: [
        { nome: "Coca-Cola 2L", preco: 15.00, imagem: "/items/coca2lt.webp" }, 
        { nome: "Guaraná Antarctica 2L", preco: 12.00, imagem: "/items/guarana2lt.webp" },
        { nome: "Suco de Laranja 500ml", preco: 10.00 }, 
        { nome: "Água Mineral 500ml", preco: 4.00, imagem: "/items/agua500ml.webp" }
      ]
    }
  ]
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

export const getIconForCategory = (catId, className = "") => {
  if (catId.includes('pizza')) return <Pizza className={className} />;
  if (catId.includes('hamburguer')) return <Sandwich className={className} />;
  if (catId === 'bebidas') return <CupSoda className={className} />;
  return <Utensils className={className} />;
};

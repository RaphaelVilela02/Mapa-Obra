// Dados da obra: plantas, serviços (na ordem de execução) com seus itens de verificação, e setores.
// Coordenadas em pontos da prancha PDF (1 m = 28,35 pt na escala 1:100).
// Nunca altere o "id" de setor, serviço ou item já usado: as liberações gravadas apontam para ele.
window.OBRA={
"titulo": "Reforma do Grupamento do Corpo de Bombeiros — Jaboatão dos Guararapes",
"subtitulo": "Mapa de liberação do acabamento final · Plantas baixas Casas 01-02-03 (prancha 04/23, R01)",
"plantas": [
{
"id": "casa01",
"n": "Casa 01 — Térreo",
"b": [
100,
140,
940,
1460
],
"img": "casa01.webp"
},
{
"id": "casa02t",
"n": "Casa 02 — Térreo",
"b": [
1140,
160,
605,
1100
],
"img": "casa02t.webp"
},
{
"id": "casa02p1",
"n": "Casa 02 — Pav. 1",
"b": [
1745,
140,
635,
1120
],
"img": "casa02p1.webp"
},
{
"id": "casa03",
"n": "Casa 03 — Térreo",
"b": [
2380,
140,
420,
1120
],
"img": "casa03.webp"
}
],
"areasMolhadas": "WC|BWC|Lavabo|Vestiário|Cozinha|Copa|Lava Pés",
"servicos": [
{
"id": "forro",
"n": "Forro",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Instalações acima do forro concluídas e testadas",
"c": "Elétrica, dados, incêndio, climatização e hidráulica acima do forro testadas e liberadas antes do fechamento.",
"m": "Conferir as FVS e os registros de teste das instalações."
},
{
"id": "p2",
"et": "Pré-requisito",
"n": "Cota do forro marcada",
"c": "Cota conforme projeto (± 1 cm), marcada em todo o perímetro.",
"m": "Nível laser ou mangueira; trena a partir do piso acabado."
},
{
"id": "e1",
"et": "Execução",
"n": "Estrutura de sustentação",
"c": "Tirantes a cada ≤ 1,20 m, perfis alinhados, sem apoio em tubulações ou dutos.",
"m": "Inspeção e trena antes do fechamento; registrar foto."
},
{
"id": "e2",
"et": "Execução",
"n": "Placas fixadas e juntas tratadas",
"c": "Placas firmes, juntas tratadas e lixadas, sem trincas; dente entre placas ≤ 1 mm.",
"m": "Régua de 2 m e luz rasante."
},
{
"id": "e3",
"et": "Execução",
"n": "Recortes para luminárias, difusores e alçapões",
"c": "Nas posições do projeto, bordas limpas, peças centralizadas e alinhadas entre si.",
"m": "Visual e trena conforme projeto de forro e luminotécnico."
},
{
"id": "n1",
"et": "Entrega",
"n": "Planeza e nivelamento",
"c": "Flecha ≤ 3 mm em régua de 2 m; sem ondulações visíveis com luz rasante.",
"m": "Régua de 2 m em duas direções; lanterna rasante."
},
{
"id": "n2",
"et": "Entrega",
"n": "Arremate com as paredes (tabica ou negativo)",
"c": "Encontro contínuo e reto, sem frestas.",
"m": "Inspeção visual em todo o perímetro."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
]
},
{
"id": "revest",
"n": "Revestimento cerâmico de parede",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Base (emboço) pronta e curada",
"c": "Emboço curado (≥ 14 dias ou conforme projeto), sem som cavo; prumo ≤ 3 mm em 2 m.",
"m": "Percussão com martelo de borracha; régua e prumo."
},
{
"id": "p2",
"et": "Pré-requisito",
"n": "Instalações embutidas e impermeabilização concluídas",
"c": "Pontos hidráulicos e elétricos testados e na posição do projeto; impermeabilização das áreas molhadas liberada.",
"m": "Conferir FVS e registros de estanqueidade."
},
{
"id": "p3",
"et": "Pré-requisito",
"n": "Material e paginação conferidos",
"c": "Peça, lote e tonalidade conforme especificação; paginação aprovada, cortes simétricos e ≥ ½ peça nos cantos.",
"m": "Conferir caixas (lote e tonalidade) e o projeto de paginação."
},
{
"id": "e1",
"et": "Execução",
"n": "Assentamento com argamassa colante",
"c": "Argamassa AC-II/AC-III conforme especificação; dupla colagem em peças > 900 cm²; ≥ 90% de cobertura no tardoz.",
"m": "Remover 1 peça recém-assentada por pano e verificar a cobertura."
},
{
"id": "e2",
"et": "Execução",
"n": "Juntas e alinhamento",
"c": "Juntas uniformes (com espaçadores) e alinhadas; desvio ≤ 2 mm em 2 m.",
"m": "Linha ou régua e trena."
},
{
"id": "e3",
"et": "Execução",
"n": "Rejuntamento",
"c": "Após ≥ 72 h do assentamento; juntas totalmente preenchidas, sem falhas ou fissuras; cor conforme projeto.",
"m": "Inspeção visual peça a peça."
},
{
"id": "n1",
"et": "Entrega",
"n": "Aderência (som cavo)",
"c": "Nenhuma peça com som cavo; peça trincada ou lascada = NC.",
"m": "Percussão em 100% das peças com martelo de borracha (NBR 13755)."
},
{
"id": "n2",
"et": "Entrega",
"n": "Prumo e planeza",
"c": "Prumo ≤ 2 mm em 2 m; dente entre peças ≤ 1 mm.",
"m": "Régua de 2 m e prumo."
},
{
"id": "n3",
"et": "Entrega",
"n": "Recortes, cantoneiras e encontros",
"c": "Recortes sem trincas e cobertos por espelhos e canoplas; cantos com cantoneira ou meia-esquadria conforme projeto.",
"m": "Inspeção visual."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
],
"w": 1
},
{
"id": "piso",
"n": "Piso e rodapé",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Contrapiso nivelado e curado",
"c": "Cota e caimentos conforme projeto (áreas molhadas ≥ 0,5% para o ralo); sem som cavo nem fissuras.",
"m": "Nível ou laser, régua de 2 m e percussão."
},
{
"id": "p2",
"et": "Pré-requisito",
"n": "Impermeabilização testada (onde houver)",
"c": "Lâmina d'água por 72 h sem vazamento; impermeabilização sobe ≥ 30 cm no box.",
"m": "Conferir o registro do teste de estanqueidade."
},
{
"id": "p3",
"et": "Pré-requisito",
"n": "Material e paginação conferidos",
"c": "Peça, classe de abrasão (PEI), antiderrapante em áreas molhadas e rampas, lote e tonalidade conforme especificação.",
"m": "Conferir caixas e projeto de paginação."
},
{
"id": "e1",
"et": "Execução",
"n": "Assentamento e juntas",
"c": "Argamassa e dupla colagem conforme o formato; juntas uniformes; juntas de movimentação conforme NBR 13753.",
"m": "Trena e inspeção visual durante a execução."
},
{
"id": "e2",
"et": "Execução",
"n": "Caimento para ralos (onde houver)",
"c": "Toda a água escoa para o ralo, sem empoçamento.",
"m": "Jogar um balde de água; após 10 min não pode haver poça."
},
{
"id": "n1",
"et": "Entrega",
"n": "Aderência (som cavo)",
"c": "Nenhuma peça com som cavo, trinca ou lascamento.",
"m": "Percussão em 100% das peças."
},
{
"id": "n2",
"et": "Entrega",
"n": "Planeza e dentes",
"c": "Planeza ≤ 3 mm em 2 m; dente ≤ 1 mm (≤ 0,5 mm em rota acessível).",
"m": "Régua de 2 m e calibre de folga."
},
{
"id": "n3",
"et": "Entrega",
"n": "Rodapé",
"c": "Altura uniforme conforme projeto, firme, alinhado, juntas coincidindo com o piso e sem frestas na parede.",
"m": "Inspeção visual e percussão."
},
{
"id": "n4",
"et": "Entrega",
"n": "Soleiras e transições",
"c": "Desnível ≤ 5 mm; entre 5 e 20 mm só com chanfro 1:2 (NBR 9050); soleiras íntegras e firmes.",
"m": "Régua e trena."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
]
},
{
"id": "esq",
"n": "Portas e janelas",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Vãos conferidos",
"c": "Dimensões e prumo dos vãos conforme projeto (± 5 mm); vergas e contravergas executadas.",
"m": "Trena e prumo."
},
{
"id": "p2",
"et": "Pré-requisito",
"n": "Esquadria conforme o quadro de esquadrias",
"c": "Tipologia, dimensões, acabamento, vidro e ferragens conforme o código do projeto (PM, JA…).",
"m": "Conferir peça a peça com o quadro de esquadrias."
},
{
"id": "e1",
"et": "Execução",
"n": "Fixação, prumo e esquadro",
"c": "Marcos e batentes em prumo e esquadro (≤ 2 mm em 2 m), fixados conforme o fabricante.",
"m": "Prumo, esquadro e trena."
},
{
"id": "e2",
"et": "Execução",
"n": "Vedação do perímetro (janelas)",
"c": "Selante contínuo no perímetro externo, sem falhas.",
"m": "Inspeção visual externa."
},
{
"id": "n1",
"et": "Entrega",
"n": "Funcionamento",
"c": "Todas as folhas abrem e fecham sem esforço e sem raspar; folga uniforme ≤ 3 mm; fechaduras, trincos e dobradiças funcionando com todas as chaves.",
"m": "Abrir e fechar 3 vezes cada folha; testar todas as chaves."
},
{
"id": "n2",
"et": "Entrega",
"n": "Estanqueidade (janelas)",
"c": "Sem entrada de água pelo caixilho.",
"m": "Jato de mangueira por 10 min na face externa."
},
{
"id": "n3",
"et": "Entrega",
"n": "Vidros",
"c": "Íntegros, sem riscos, lascas ou manchas; tipo e espessura conforme especificação; baguetes firmes.",
"m": "Inspeção visual."
},
{
"id": "n4",
"et": "Entrega",
"n": "Acessibilidade (onde houver)",
"c": "Rota acessível: vão livre ≥ 80 cm, maçaneta de alavanca entre 0,80 e 1,10 m; puxador horizontal na porta do sanitário PNE (NBR 9050).",
"m": "Trena."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
]
},
{
"id": "elet",
"n": "Elétrica aparente e iluminação",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Circuitos testados e identificados no quadro",
"c": "Disjuntores identificados conforme diagrama; DR nas áreas molhadas; isolamento testado.",
"m": "Conferir o quadro e o registro de testes."
},
{
"id": "e1",
"et": "Execução",
"n": "Tomadas e interruptores instalados",
"c": "Alturas conforme projeto; espelhos nivelados e encostados na parede; tomadas padrão NBR 14136, identificadas quando 220 V.",
"m": "Trena e nível."
},
{
"id": "e2",
"et": "Execução",
"n": "Luminárias instaladas",
"c": "Modelo e posição conforme projeto luminotécnico; firmes, alinhadas e centralizadas nos recortes.",
"m": "Inspeção visual e trena."
},
{
"id": "n1",
"et": "Entrega",
"n": "Teste de todas as tomadas",
"c": "100% das tomadas com tensão correta, fase, neutro e terra.",
"m": "Testador de tomadas ou multímetro em cada ponto."
},
{
"id": "n2",
"et": "Entrega",
"n": "Teste de interruptores e iluminação",
"c": "Cada interruptor comanda o ponto certo; todas as lâmpadas acendem, sem cintilação.",
"m": "Acionar um a um."
},
{
"id": "n3",
"et": "Entrega",
"n": "Iluminação de emergência (onde houver)",
"c": "Acende ao faltar energia e mantém a autonomia de projeto (≥ 1 h).",
"m": "Desligar o disjuntor do circuito e cronometrar."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
]
},
{
"id": "loucas",
"n": "Louças, metais e acessórios",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Pontos de água e esgoto testados",
"c": "Estanqueidade testada; pontos nas alturas e posições do projeto.",
"m": "Conferir os registros de teste e medir com trena."
},
{
"id": "e1",
"et": "Execução",
"n": "Fixação das louças",
"c": "Bacias, lavatórios e cubas firmes (não se movem ao forçar), nivelados, com vedação contínua na base.",
"m": "Forçar lateralmente com a mão; nível."
},
{
"id": "e2",
"et": "Execução",
"n": "Ligações flexíveis e sifões",
"c": "Sem vazamento; sifões com fecho hídrico.",
"m": "Papel seco sob as conexões após uso."
},
{
"id": "n1",
"et": "Entrega",
"n": "Registros — acabamento e funcionamento",
"c": "Todos os registros abrem e fecham por completo, cortam totalmente a água no ponto atendido e não vazam na haste nem na canopla.",
"m": "Fechar o registro, abrir o ponto (não pode sair água), reabrir e conferir a vazão."
},
{
"id": "n2",
"et": "Entrega",
"n": "Torneiras e chuveiros",
"c": "Vazão adequada, sem respingos; sem pingar com o ponto fechado.",
"m": "Abrir cada ponto por 1 min e observar."
},
{
"id": "n3",
"et": "Entrega",
"n": "Descargas",
"c": "Acionamento completo; sem fluxo contínuo para a bacia após o ciclo.",
"m": "Acionar 3 vezes; papel seco na parede da bacia por 5 min."
},
{
"id": "n4",
"et": "Entrega",
"n": "Ralos e escoamento",
"c": "Escoamento livre, sem retorno de odor; grelhas firmes.",
"m": "Jogar um balde de água em cada ralo."
},
{
"id": "n5",
"et": "Entrega",
"n": "Acessórios",
"c": "Papeleira, saboneteira, toalheiro, espelho e barras firmes, nivelados e nas alturas do projeto.",
"m": "Trena e teste manual."
},
{
"id": "n6",
"et": "Entrega",
"n": "Sanitário acessível (onde houver)",
"c": "Barras de apoio, bacia a 0,43–0,45 m com assento e lavatório conforme NBR 9050.",
"m": "Trena."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
],
"w": 1
},
{
"id": "pint",
"n": "Pintura",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Base preparada",
"c": "Superfície seca, sem fissuras, umidade ou eflorescência; massa lixada e sem pó.",
"m": "Luz rasante; passar a mão (não pode soltar pó)."
},
{
"id": "p2",
"et": "Pré-requisito",
"n": "Tinta e cor conforme especificação",
"c": "Tipo, linha e cor conforme projeto; produto dentro da validade.",
"m": "Conferir as latas."
},
{
"id": "e1",
"et": "Execução",
"n": "Selador ou fundo aplicado",
"c": "Aplicado em toda a área antes da tinta.",
"m": "Inspeção durante a execução."
},
{
"id": "e2",
"et": "Execução",
"n": "Demãos de acabamento",
"c": "Mínimo de 2 demãos (ou conforme fabricante), respeitando o intervalo entre demãos.",
"m": "Acompanhar a execução."
},
{
"id": "n1",
"et": "Entrega",
"n": "Uniformidade e cobertura",
"c": "Sem manchas, marcas de rolo, escorridos, bolhas ou falhas.",
"m": "Observar a 1 m com luz natural e rasante."
},
{
"id": "n2",
"et": "Entrega",
"n": "Recortes e arestas",
"c": "Linhas retas nos encontros com teto, rodapé, esquadrias e espelhos; sem tinta nas superfícies vizinhas.",
"m": "Inspeção visual."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
]
},
{
"id": "clima",
"n": "Climatização (onde houver)",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Infraestrutura pronta",
"c": "Linhas frigoríficas isoladas e testadas (pressão e vácuo); dreno com caimento; ponto elétrico dedicado.",
"m": "Conferir o registro de testes."
},
{
"id": "e1",
"et": "Execução",
"n": "Equipamentos instalados",
"c": "Evaporadora e condensadora firmes e niveladas, com afastamentos do fabricante; condensadora ventilada e acessível.",
"m": "Nível e inspeção visual."
},
{
"id": "n1",
"et": "Entrega",
"n": "Funcionamento",
"c": "Liga, refrigera (≥ 8 °C de diferença entre retorno e insuflamento) e o controle funciona.",
"m": "Ligar por 15 min e medir com termômetro."
},
{
"id": "n2",
"et": "Entrega",
"n": "Dreno",
"c": "Sem gotejamento interno; água escoando no ponto previsto.",
"m": "Observar com o aparelho ligado."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
]
},
{
"id": "incendio",
"n": "Incêndio, sinalização e CFTV (onde houver)",
"itens": [
{
"id": "p1",
"et": "Pré-requisito",
"n": "Conforme o projeto aprovado",
"c": "Itens instalados conforme o projeto aprovado no Corpo de Bombeiros.",
"m": "Conferir com o projeto aprovado."
},
{
"id": "e1",
"et": "Execução",
"n": "Extintores",
"c": "Tipo e carga conforme projeto, selo do Inmetro e carga válidos, alça a ≤ 1,60 m do piso, sinalizados.",
"m": "Conferir etiqueta e medir."
},
{
"id": "e2",
"et": "Execução",
"n": "Sinalização de emergência",
"c": "Placas fotoluminescentes de rota de fuga, saída e equipamentos nas posições do projeto.",
"m": "Conferir com o projeto; apagar a luz e verificar a luminescência."
},
{
"id": "e3",
"et": "Execução",
"n": "Detectores e acionadores (onde houver)",
"c": "Instalados e testados com a central de alarme.",
"m": "Teste funcional com a central."
},
{
"id": "n1",
"et": "Entrega",
"n": "Câmeras de CFTV (onde houver)",
"c": "Câmera firme, imagem nítida no gravador e ângulo conforme projeto.",
"m": "Conferir a imagem no gravador."
},
{
"id": "qtd",
"et": "Entrega",
"n": "Quantidade executada x orçada",
"c": "Quantidade executada no ambiente confere com o orçamento/medição; diferença só com justificativa registrada.",
"m": "Medir com trena e comparar com a planilha orçamentária."
},
{
"id": "acab",
"et": "Entrega",
"n": "Acabamento limpo e alinhado",
"c": "Serviço sem sujeira, respingos ou peças desalinhadas.",
"m": "Inspeção visual a 1 m, com luz natural ou rasante."
}
]
},
{
"id": "limpeza",
"n": "Limpeza final",
"itens": [
{
"id": "e1",
"et": "Execução",
"n": "Entulho e sobras removidos",
"c": "Nenhum resíduo, embalagem ou material de obra no ambiente.",
"m": "Inspeção visual."
},
{
"id": "n1",
"et": "Entrega",
"n": "Pisos e revestimentos",
"c": "Sem respingos de tinta, argamassa ou rejunte; limpeza com produto adequado ao material (sem ácido em porcelanato).",
"m": "Inspeção visual."
},
{
"id": "n2",
"et": "Entrega",
"n": "Vidros, esquadrias e ferragens",
"c": "Sem etiquetas, fitas, respingos ou marcas.",
"m": "Inspeção visual."
},
{
"id": "n3",
"et": "Entrega",
"n": "Louças, metais e luminárias",
"c": "Limpos, sem resíduos de silicone ou poeira.",
"m": "Inspeção visual."
},
{
"id": "n4",
"et": "Entrega",
"n": "Ambiente pronto para uso",
"c": "Pode ser entregue sem nova limpeza.",
"m": "Inspeção final com o responsável da empreiteira."
}
]
}
],
"setores": [
{
"id": "casa01-dormitorio-de-pracas-fem-21-38",
"n": "Dormitório de Praças Fem.",
"a": 21.38,
"v": "casa01",
"x": 590,
"y": 1460,
"p": "499,1442 499,1450 496,1452 498,1521 530,1522 534,1516 538,1521 660,1520 658,1417 600,1417 599,1424 604,1430 600,1434 594,1431 598,1418 579,1417 578,1425 582,1432 578,1435 572,1432 576,1424 575,1417 556,1418 556,1425 560,1430 556,1435 550,1431 555,1425 554,1418 538,1417 534,1420 539,1430 536,1435 536,1450 534,1436 530,1432 534,1418 522,1417 514,1434 518,1446 512,1448 508,1440"
},
{
"id": "casa03-varanda-8-39",
"n": "Varanda",
"a": 8.39,
"v": "casa03",
"x": 2576,
"y": 487,
"p": "2557,428 2555,449 2560,453 2562,458 2555,465 2555,500 2560,504 2562,510 2555,516 2555,560 2568,561 2570,550 2582,550 2584,554 2582,560 2594,560 2596,429"
},
{
"id": "casa02p1-alojamento-st-e-sgt-f-13-05",
"n": "Alojamento ST e Sgt F.",
"a": 13.05,
"v": "casa02p1",
"x": 2149,
"y": 1086,
"p": "2078,1056 2084,1064 2078,1071 2078,1085 2102,1086 2104,1090 2114,1090 2103,1093 2104,1136 2126,1138 2216,1136 2216,1093 2212,1091 2216,1088 2216,1078 2199,1072 2190,1062 2196,1056 2206,1056 2210,1060 2212,1053 2142,1052 2140,1072 2136,1052 2102,1052 2097,1057"
},
{
"id": "casa02p1-wc-oficiais-feminino-5-69",
"n": "WC Oficiais Feminino",
"a": 5.69,
"v": "casa02p1",
"x": 2047,
"y": 1183
},
{
"id": "casa02p1-wc-pracas-f-4-71",
"n": "WC Praças F.",
"a": 4.71,
"v": "casa02p1",
"x": 2332,
"y": 993
},
{
"id": "casa02p1-alojamento-das-oficiais-f-9-83",
"n": "Alojamento das Oficiais F.",
"a": 9.83,
"v": "casa02p1",
"x": 1970,
"y": 1097,
"p": "1925,1054 1926,1136 2016,1136 2017,1130 2012,1128 2012,1123 2017,1119 2017,1093 2000,1092 2017,1088 2017,1071 2011,1066 2017,1060 2016,1056 1997,1057 1993,1052"
},
{
"id": "casa02p1-dorm-de-oficiais-m-13-97",
"n": "Dorm. de Oficiais M.",
"a": 13.97,
"v": "casa02p1",
"x": 2167,
"y": 936,
"p": "2078,926 2080,981 2103,980 2104,956 2106,958 2106,973 2120,972 2124,982 2216,980 2214,898 2142,898 2139,916 2137,898 2118,898 2112,911 2098,918 2096,924"
},
{
"id": "casa02p1-recepcao-16-11",
"n": "Recepção",
"a": 16.11,
"v": "casa02p1",
"x": 2155,
"y": 850,
"p": "2078,808 2078,856 2096,857 2099,864 2110,867 2120,878 2122,892 2136,892 2138,888 2142,892 2215,891 2215,851 2223,850 2224,822 2215,818 2214,808 2142,808 2139,822 2136,808"
},
{
"id": "casa01-bwc-pracas-masculino-21-16",
"n": "BWC Praças Masculino",
"a": 21.16,
"v": "casa01",
"x": 608,
"y": 1357,
"p": "503,1309 503,1324 506,1329 499,1330 499,1378 505,1377 510,1382 504,1388 503,1396 510,1396 510,1388 516,1386 519,1388 518,1396 530,1396 535,1368 539,1396 552,1396 551,1388 554,1386 560,1388 560,1396 573,1396 574,1388 583,1386 584,1376 632,1376 632,1389 626,1390 626,1406 634,1402 639,1410 642,1410 644,1389 644,1408 652,1402 660,1409 660,1346 652,1346 652,1352 638,1350 634,1346 626,1346 622,1350 610,1349 608,1363 607,1346 600,1346 596,1350 584,1348 584,1362 582,1363 582,1347 574,1346 571,1350 557,1350 556,1363 555,1347 548,1346 545,1350 536,1350 535,1357 534,1350 530,1350 528,1363 526,1325 530,1342 536,1335 534,1330 538,1327 534,1325 534,1309 528,1308 528,1320 522,1308"
},
{
"id": "casa02t-refeitorio-20-78",
"n": "Refeitório",
"a": 20.78,
"v": "casa02t",
"x": 1430,
"y": 1011,
"p": "1498,968 1468,966 1462,974 1458,974 1454,968 1404,968 1401,976 1399,968 1358,968 1356,974 1364,977 1364,984 1336,983 1328,988 1325,982 1330,977 1330,968 1305,968 1304,1050 1497,1050"
},
{
"id": "casa01-vestiario-de-pracas-feminino-17-22",
"n": "Vestiário de Praças Feminino",
"a": 17.22,
"v": "casa01",
"x": 460,
"y": 1313,
"p": "436,1221 436,1246 432,1250 432,1442 492,1442 494,1436 488,1433 488,1428 494,1424 494,1338 479,1336 479,1288 494,1287 494,1222 464,1221 462,1224 460,1221"
},
{
"id": "casa02p1-wc-dos-oficiais-m-4-9",
"n": "WC dos Oficiais M.",
"a": 4.9,
"v": "casa02p1",
"x": 1966,
"y": 1000
},
{
"id": "casa01-vestiario-de-pracas-masculino-24-0",
"n": "Vestiário de Praças Masculino",
"a": 24.0,
"v": "casa01",
"x": 588,
"y": 1218,
"p": "499,1188 499,1194 504,1200 499,1206 500,1302 506,1302 508,1294 520,1294 520,1302 533,1302 534,1298 538,1302 660,1302 660,1224 647,1222 648,1214 660,1214 660,1185 538,1184 535,1200 534,1186 531,1184 524,1188"
},
{
"id": "casa02p1-vestiario-de-st-e-sgt-m-20-06",
"n": "Vestiário de ST e Sgt M.",
"a": 20.06,
"v": "casa02p1",
"x": 2170,
"y": 666,
"p": "2040,606 2040,715 2044,714 2044,690 2062,696 2073,716 2136,716 2138,707 2142,716 2216,714 2216,683 2219,682 2219,679 2216,678 2215,633 2099,632 2098,660 2072,660 2072,654 2091,654 2091,626 2076,618 2070,604 2059,605 2055,614 2049,610 2048,605"
},
{
"id": "casa02t-cozinha-12-38",
"n": "Cozinha",
"a": 12.38,
"v": "casa02t",
"x": 1234,
"y": 998,
"p": "1204,968 1204,980 1212,986 1204,992 1204,1003 1212,1008 1204,1014 1204,1028 1210,1028 1210,1018 1258,1018 1258,1030 1244,1032 1245,1052 1248,1050 1248,1038 1284,1037 1284,1010 1302,1008 1302,982 1297,980 1286,990 1273,993 1272,968"
},
{
"id": "casa03-alojamento-socorristas-aph-16-95",
"n": "Alojamento Socorristas APH",
"a": 16.95,
"v": "casa03",
"x": 2520,
"y": 602,
"p": "2592,592 2572,586 2564,576 2564,569 2558,566 2514,566 2512,570 2508,566 2478,566 2476,574 2473,576 2463,576 2462,568 2456,568 2456,664 2508,665 2512,660 2514,665 2590,664"
},
{
"id": "casa01-dormitorio-de-pracas-masculino-28-09",
"n": "Dormitório de Praças Masculino",
"a": 28.09,
"v": "casa01",
"x": 585,
"y": 1080,
"p": "500,1041 500,1178 627,1179 630,1177 630,1172 635,1163 648,1154 648,1146 660,1144 660,1041 538,1040 535,1044 529,1040"
},
{
"id": "casa02p1-circulacao-21-67",
"n": "Circulação (21,67 m²)",
"a": 21.67,
"v": "casa02p1",
"x": 2070,
"y": 753
},
{
"id": "casa01-graduado-de-dia-5-82",
"n": "Graduado de Dia",
"a": 5.82,
"v": "casa01",
"x": 870,
"y": 952
},
{
"id": "casa01-bwc-comando-4-2",
"n": "BWC Comando",
"a": 4.2,
"v": "casa01",
"x": 554,
"y": 1004
},
{
"id": "casa01-bwc-subcomando-5-82",
"n": "BWC Subcomando",
"a": 5.82,
"v": "casa01",
"x": 347,
"y": 995,
"p": "306,982 306,1024 314,1028 306,1031 308,1046 382,1045 380,1029 384,1027 384,986 380,978 351,977 348,982 344,977 319,976"
},
{
"id": "casa02t-gremio-17-02",
"n": "Grêmio",
"a": 17.02,
"v": "casa02t",
"x": 1368,
"y": 854,
"p": "1336,818 1336,960 1399,960 1402,956 1406,960 1409,955 1429,957 1424,947 1430,943 1430,818 1404,817 1402,820 1399,817"
},
{
"id": "casa02p1-alojamento-de-st-e-sgt-m-15-92",
"n": "Alojamento de ST e Sgt M.",
"a": 15.92,
"v": "casa02p1",
"x": 2158,
"y": 572,
"p": "2096,521 2098,610 2102,614 2098,625 2136,626 2138,613 2142,626 2216,624 2216,588 2208,593 2201,587 2206,579 2216,583 2214,520 2142,520 2140,540 2136,520"
},
{
"id": "casa01-wc-pne-unissex-5-34",
"n": "WC PNE Unissex",
"a": 5.34,
"v": "casa01",
"x": 489,
"y": 934
},
{
"id": "casa01-comando-25-29",
"n": "Comando",
"a": 25.29,
"v": "casa01",
"x": 704,
"y": 900,
"p": "604,858 604,865 609,872 604,876 604,966 620,970 630,988 668,986 667,948 672,942 682,946 797,944 798,866 796,857 684,857 677,863 672,862 666,857"
},
{
"id": "casa02t-almoxerifado-9-99",
"n": "Almoxarifado",
"a": 9.99,
"v": "casa02t",
"x": 1374,
"y": 758,
"p": "1430,728 1336,728 1336,810 1399,811 1402,800 1402,810 1406,810 1412,794 1429,786"
},
{
"id": "casa01-reservado-comando-9-25",
"n": "Reservado Comando",
"a": 9.25,
"v": "casa01",
"x": 544,
"y": 891,
"p": "514,858 514,942 529,945 533,943 534,930 538,944 578,942 581,935 592,935 594,942 598,942 598,876 594,874 592,869 598,865 598,862 582,860 578,863 574,857"
},
{
"id": "casa01-lava-pes-4-69",
"n": "Lava Pés",
"a": 4.69,
"v": "casa01",
"x": 254,
"y": 919
},
{
"id": "casa01-reservado-subcomando-7-94",
"n": "Reservado Subcomando",
"a": 7.94,
"v": "casa01",
"x": 344,
"y": 863,
"p": "306,830 306,862 313,862 318,867 313,876 306,874 306,906 325,908 386,906 386,851 378,852 368,847 356,829"
},
{
"id": "casa03-copa-5-46",
"n": "Copa",
"a": 5.46,
"v": "casa03",
"x": 2400,
"y": 503
},
{
"id": "casa01-da-scp-div-op-36-59",
"n": "DA / SCP / Div. Op.",
"a": 36.59,
"v": "casa01",
"x": 585,
"y": 781,
"p": "680,681 672,682 666,676 648,674 536,676 534,678 536,680 535,700 532,693 533,684 529,682 514,682 514,750 522,748 528,754 532,754 535,742 538,755 535,763 532,756 528,756 522,762 514,759 514,851 533,851 534,836 538,852 666,852 672,847 680,846 680,758 671,756 667,748 670,741 680,740"
},
{
"id": "casa01-subcomando-26-03",
"n": "Subcomando",
"a": 26.03,
"v": "casa01",
"x": 407,
"y": 781,
"p": "306,726 306,753 316,756 306,758 306,769 316,769 318,776 314,782 306,780 306,822 392,823 392,902 436,903 436,896 442,898 460,898 461,892 456,888 457,882 461,880 460,758 451,756 460,753 460,726"
},
{
"id": "casa01-espelho-d-agua-88-46",
"n": "Espelho d'Água",
"a": 88.46,
"v": "casa01",
"x": 908,
"y": 702,
"p": "814,582 814,619 828,620 814,622 814,864 836,864 836,758 826,755 836,753 836,656 842,655 842,753 848,755 842,758 842,864 974,864 974,583 844,582 842,614 837,614 836,583"
},
{
"id": "casa02p1-wc-pracas-m-4-89",
"n": "WC Praças M.",
"a": 4.89,
"v": "casa02p1",
"x": 1980,
"y": 572
},
{
"id": "casa01-area-exposicao-38-45",
"n": "Área Exposição",
"a": 38.45,
"v": "casa01",
"x": 742,
"y": 703,
"p": "796,586 686,586 686,753 691,754 686,758 688,852 797,850 798,617"
},
{
"id": "casa02t-lavabo-1-33",
"n": "Lavabo",
"a": 1.33,
"v": "casa02t",
"x": 1267,
"y": 621
},
{
"id": "casa03-bwc-2-96",
"n": "BWC",
"a": 2.96,
"v": "casa03",
"x": 2399,
"y": 449
},
{
"id": "casa01-bicicletario-20-84",
"n": "Bicicletário",
"a": 20.84,
"v": "casa01",
"x": 274,
"y": 685
},
{
"id": "casa01-centro-telefonico-11-06",
"n": "Centro Telefônico",
"a": 11.06,
"v": "casa01",
"x": 632,
"y": 623,
"p": "575,588 576,670 608,670 610,668 607,665 614,658 620,664 635,665 620,666 618,670 667,670 672,666 680,666 680,588 630,588 622,600 610,605 606,588"
},
{
"id": "casa01-wc-f-2-8",
"n": "WC F.",
"a": 2.8,
"v": "casa01",
"x": 485,
"y": 638,
"p": "468,588 468,656 508,657 508,638 502,637 499,634 501,628 508,628 509,603 502,598 508,588"
},
{
"id": "casa01-sala-de-aula-26-09",
"n": "Sala de Aula",
"a": 26.09,
"v": "casa01",
"x": 384,
"y": 627,
"p": "461,588 306,588 306,631 314,630 319,637 314,643 306,641 306,719 440,720 443,704 452,696 461,693"
},
{
"id": "casa02t-stc-21-1",
"n": "STC",
"a": 21.1,
"v": "casa02t",
"x": 1361,
"y": 570,
"p": "1308,538 1308,630 1399,631 1401,612 1404,631 1468,632 1474,626 1481,627 1481,614 1476,610 1484,608 1484,588 1478,592 1474,591 1470,584 1475,578 1484,582 1484,538"
},
{
"id": "casa02t-material-operacional-20-97",
"n": "Material Operacional",
"a": 20.97,
"v": "casa02t",
"x": 1370,
"y": 481,
"p": "1308,450 1310,532 1399,532 1401,518 1404,532 1484,530 1484,462 1479,458 1484,450 1482,442 1460,445 1457,443 1460,440 1459,438 1424,438 1422,446 1428,454 1424,460 1415,455 1421,446 1420,438 1404,438 1402,445 1399,438 1384,438 1383,446 1389,453 1384,460 1376,455 1382,446 1380,438 1346,438 1345,446 1351,453 1346,460 1338,455 1344,446 1342,438 1318,438 1316,448"
},
{
"id": "casa01-circulacao-60-8",
"n": "Circulação (60,80 m²)",
"a": 60.8,
"v": "casa01",
"x": 592,
"y": 535,
"p": "798,493 777,490 538,492 534,513 532,492 295,492 294,575 308,576 310,574 316,576 322,574 324,580 330,580 330,574 333,574 334,580 340,580 341,574 344,574 346,580 352,580 352,574 356,574 357,580 362,580 363,574 366,575 367,580 372,580 374,574 378,574 380,580 386,580 386,574 390,574 391,580 396,580 397,574 399,580 532,580 535,576 539,580 611,580 610,572 612,568 568,567 568,554 616,554 616,568 625,571 624,580 676,580 678,526 684,522 688,526 684,528 679,527 680,580 731,580 732,570 744,569 746,572 746,580 774,580 774,582 777,584 780,580 798,579"
},
{
"id": "casa01-wc-m-2-83",
"n": "WC M.",
"a": 2.83,
"v": "casa01",
"x": 485,
"y": 532
},
{
"id": "casa03-alojamento-aph-12-7",
"n": "Alojamento APH",
"a": 12.7,
"v": "casa03",
"x": 2496,
"y": 373,
"p": "2565,332 2524,332 2522,341 2510,344 2508,332 2456,332 2456,413 2488,414 2490,430 2510,430 2511,418 2514,430 2543,430 2543,414 2560,416 2565,414"
},
{
"id": "casa02t-manutencao-de-embarcacoes-35-27",
"n": "Manutenção de Embarcações",
"a": 35.27,
"v": "casa02t",
"x": 1393,
"y": 339,
"p": "1298,274 1296,416 1302,418 1302,425 1314,425 1314,400 1340,400 1342,396 1338,394 1344,386 1352,394 1348,396 1349,400 1388,400 1389,410 1399,412 1402,392 1400,373 1368,371 1368,358 1398,358 1402,354 1400,275 1320,273 1316,275 1316,282 1309,282 1307,274"
},
{
"id": "casa01-garagem-viaturas-120-26",
"n": "Garagem Viaturas",
"a": 120.26,
"v": "casa01",
"x": 481,
"y": 292,
"p": "810,202 770,200 765,206 738,206 732,200 654,200 648,206 622,206 616,200 536,200 534,208 532,204 503,206 497,200 418,200 412,206 386,206 380,200 332,200 330,212 343,214 344,220 338,221 338,232 334,232 334,221 330,221 330,377 334,377 334,366 338,366 338,377 344,378 344,384 330,385 330,397 428,398 431,376 466,376 468,377 470,398 670,398 672,376 706,375 710,377 711,398 808,398 810,386 796,384 796,378 802,377 802,366 806,366 806,377 810,377 810,221 806,221 806,232 802,232 802,221 796,220 796,214 810,213"
},
{
"id": "casa01-bwc-pracas-feminino-9-04",
"n": "BWC Praças Feminino",
"a": 9.04,
"v": "casa01",
"x": 427,
"y": 1567
},
{
"id": "casa02t-circulacao-4-94",
"n": "Circulação (4,94 m²)",
"a": 4.94,
"v": "casa02t",
"x": 1463,
"y": 812
}
]
};

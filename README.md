# Software de Preenchimento de Polígonos Convexos com Z-Buffer Incremental

Este software especializado implementa o algoritmo Z-Buffer Incremental para preencher polígonos convexos com cores sólidas de maneira otimizada. É ideal para aplicações que exigem alta performance em renderização gráfica 3D, eliminando superfícies ocultas e garantindo a correta visualização de objetos sobrepostos.

O Algoritmo Z-Buffer Incremental diferentemente do Z-Buffer convencional, esta implementação utiliza a técnica incremental que:

 * Reduz cálculos redundantes: Aproveita a coerência espacial entre pixels adjacentes
 * Otimiza o desempenho: Atualiza valores de profundidade de forma progressiva
 * Minimiza uso de memória: Requer menos armazenamento temporário durante o processamento


## Como Funciona?
Para cada polígono convexo:

 * Os vértices são processados e transformados no espaço da tela
 * As arestas são determinadas e organizadas
 * O algoritmo calcula incrementalmente os valores de profundidade (z) para cada pixel
 * Apenas os pixels visíveis (com menor valor z) são coloridos
 * O processo é otimizado usando técnicas de varredura por linha (scanlines)

![alt text](https://github.com/MaduhCrema/PollyFill/blob/master/GravaodeTela2025-05-05135817-ezgif.com-video-to-gif-converter.gif)


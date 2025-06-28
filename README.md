# Calculadora THD de Corrente

Uma calculadora online interativa para análise de Distorção Harmônica Total (THD) em sistemas elétricos.

## Funcionalidades

### 📊 Cálculos Realizados
- **THD (%)**: Distorção Harmônica Total em porcentagem
- **Corrente RMS (A)**: Valor eficaz da corrente total
- **Fator de Crista**: Relação entre corrente de pico e RMS
- **Corrente de Pico (A)**: Valor máximo da corrente

### 📈 Visualizações Gráficas
1. **Contribuição das Harmônicas**: Gráfico de barras mostrando a amplitude de cada harmônica
2. **Formas de Onda**: Visualização de tensão e corrente em 4 ciclos
3. **Espectro de Frequência**: Análise do conteúdo harmônico no domínio da frequência

### 🎛️ Entrada de Dados
- Corrente fundamental (1ª harmônica)
- Frequência fundamental (padrão: 60 Hz)
- Correntes harmônicas de 2ª a 10ª ordem

## Como Usar

1. **Abra o arquivo `index.html`** em qualquer navegador moderno
2. **Insira os dados**:
   - Corrente fundamental (ex: 100A)
   - Frequência (ex: 60Hz)
   - Valores das harmônicas desejadas
3. **Os cálculos são automáticos** - os resultados e gráficos se atualizam em tempo real
4. **Analise os gráficos** para entender o impacto das harmônicas

## Fórmulas Utilizadas

### THD
```
THD (%) = (√(Σ I²_harmônicas) / I_fundamental) × 100
```

### Corrente RMS Total
```
I_RMS = √(I²_fundamental + Σ I²_harmônicas)
```

### Fator de Crista
```
CF = I_pico / I_RMS
```

## Exemplos de Uso

### Exemplo 1: Sistema com 3ª Harmônica
- Fundamental: 100A
- 3ª Harmônica: 30A
- Resultado: THD ≈ 30%

### Exemplo 2: Sistema com Múltiplas Harmônicas
- Fundamental: 100A
- 3ª Harmônica: 20A
- 5ª Harmônica: 15A
- 7ª Harmônica: 10A
- Resultado: THD ≈ 26.9%

## Interpretação dos Resultados

### THD
- **< 5%**: Excelente qualidade
- **5-10%**: Boa qualidade
- **10-20%**: Qualidade aceitável
- **> 20%**: Qualidade ruim

### Fator de Crista
- **1.414**: Senoide pura
- **> 1.414**: Presença de harmônicas
- **> 2.0**: Alto conteúdo harmônico

## Características Técnicas

- **Interface Responsiva**: Funciona em desktop, tablet e mobile
- **Cálculos em Tempo Real**: Atualização automática dos resultados
- **Gráficos Interativos**: Usando Chart.js
- **Sem Dependências Externas**: Apenas CDN para Chart.js
- **Compatibilidade**: Funciona em todos os navegadores modernos

## Estrutura dos Arquivos

```
web-harmonicos/
├── index.html      # Interface principal
├── styles.css      # Estilos e layout
├── script.js       # Lógica de cálculos e gráficos
└── README.md       # Este arquivo
```

## Funcionalidades Avançadas

### API JavaScript
A calculadora expõe uma API global `THDCalculator`:

```javascript
// Recalcular
THDCalculator.calculate();

// Obter dados atuais
const data = THDCalculator.getData();

// Limpar dados
THDCalculator.clear();

// Exportar dados (se implementado)
THDCalculator.export();
```

### Personalização
- Modifique as cores no arquivo `styles.css`
- Ajuste as fórmulas no arquivo `script.js`
- Adicione novas harmônicas editando o HTML e JavaScript

## Limitações

- Análise até 10ª harmônica
- Fase das harmônicas considerada como 0°
- Tensão considerada como senoide pura
- Frequência fundamental fixa por análise

## Contribuições

Para melhorar a calculadora, considere:
- Adicionar análise de fase das harmônicas
- Implementar análise de potência
- Adicionar mais ordens harmônicas
- Incluir análise de tensão distorcida
- Implementar exportação de relatórios

## Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e comerciais. 
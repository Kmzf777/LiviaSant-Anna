import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
      AVIF antes de WebP. O padrão do Next é só WebP; o briefing § 9 pede as
      duas, e a ordem importa porque o navegador fica com a primeira que
      souber ler.

      Nas fotos dela — retrato em fundo liso e quente, sem textura fina — o
      AVIF costuma sair bem menor que o WebP no mesmo nível de qualidade, e é
      exatamente o retrato do hero que carrega o LCP da home. O custo é tempo
      de conversão no primeiro acesso a cada variante, pago uma vez e servido
      do cache depois.
    */
    formats: ["image/avif", "image/webp"],

    /*
      As larguras que o site realmente pede.

      Os retratos ocupam 100vw no celular e ~30vw a partir de 1024px, e o selo
      do rodapé nunca passa de 160px. A lista padrão do Next gera oito
      variantes por imagem, quase todas inúteis aqui.
    */
    imageSizes: [160, 256, 384],
    deviceSizes: [640, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;

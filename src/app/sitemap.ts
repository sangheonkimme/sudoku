import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: 'https://sudoku.example.com/ko',
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://sudoku.example.com/en',
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://sudoku.example.com/jp',
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
}

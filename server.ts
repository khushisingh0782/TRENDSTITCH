import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { catalogDb } from './src/services/catalogDatabase';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Paginated and filtered Catalog API
  app.get('/api/products', (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 36;
      const query = (req.query.q as string) || (req.query.query as string) || undefined;
      const category = (req.query.category as string) || undefined;
      const retailer = (req.query.retailer as string) || undefined;
      const brand = (req.query.brand as string) || undefined;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const minDiscount = req.query.minDiscount ? parseFloat(req.query.minDiscount as string) : undefined;
      const minRating = req.query.minRating ? parseFloat(req.query.minRating as string) : undefined;
      const color = (req.query.color as string) || undefined;
      const size = (req.query.size as string) || undefined;
      const section = (req.query.section as any) || undefined;
      const inventoryScope = (req.query.inventoryScope as any) || undefined;
      const sortBy = (req.query.sort as any) || (req.query.sortBy as any) || 'trending';

      const response = catalogDb.queryProducts({
        page,
        limit,
        query,
        category,
        retailer,
        brand,
        minPrice,
        maxPrice,
        minDiscount,
        minRating,
        color,
        size,
        section,
        inventoryScope,
        sortBy,
      });

      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to query catalog', details: err?.message });
    }
  });

  // Catalog Health & Provenance Audit API
  app.get('/api/catalog/health', (req, res) => {
    try {
      const report = catalogDb.getHealthReport();
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate catalog audit', details: err?.message });
    }
  });

  // Catalog Provenance Ledger API
  app.get('/api/catalog/provenance', (req, res) => {
    try {
      const records = catalogDb.getProvenanceRecords();
      res.json({ total: records.length, records });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve provenance records', details: err?.message });
    }
  });

  // Product detail by ID
  app.get('/api/products/:id', (req, res) => {
    const product = catalogDb.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // Retailers list & connectivity
  app.get('/api/retailers', (req, res) => {
    res.json(catalogDb.getRetailers());
  });

  // Catalog telemetry stats
  app.get('/api/stats', (req, res) => {
    res.json({
      totalProducts: catalogDb.getProductCount(),
      retailersCount: 8,
      categoriesCount: 25,
      priceDropsToday: 260,
      mode: 'Demo data (8 retailers indexed, real APIs connectable in settings)',
    });
  });

  // Vite middleware in dev / static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrendStitch Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

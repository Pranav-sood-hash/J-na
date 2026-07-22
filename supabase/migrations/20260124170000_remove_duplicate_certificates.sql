-- Cleanup duplicate entries in portfolio_content table by title and type
-- Keeps only the first created row (lowest id) for each unique title

DELETE FROM public.portfolio_content a
USING public.portfolio_content b
WHERE a.id > b.id
  AND LOWER(TRIM(a.title)) = LOWER(TRIM(b.title))
  AND a.type = b.type;

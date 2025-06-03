-- Script para corregir el enum tipo_envio y agregar el valor "recogida"
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar los valores actuales del enum
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid 
  FROM pg_type 
  WHERE typname = 'tipo_envio'
);

-- 2. Agregar el valor "recogida" al enum si no existe
DO $$ 
BEGIN
  -- Verificar si el valor ya existe
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_enum 
    WHERE enumlabel = 'recogida' 
    AND enumtypid = (
      SELECT oid 
      FROM pg_type 
      WHERE typname = 'tipo_envio'
    )
  ) THEN
    -- Agregar el nuevo valor al enum
    ALTER TYPE tipo_envio ADD VALUE 'recogida';
    RAISE NOTICE 'Valor "recogida" agregado al enum tipo_envio';
  ELSE
    RAISE NOTICE 'El valor "recogida" ya existe en el enum tipo_envio';
  END IF;
END $$;

-- 3. Verificar que el enum ahora incluye ambos valores
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid 
  FROM pg_type 
  WHERE typname = 'tipo_envio'
)
ORDER BY enumlabel;

-- 4. Verificar que la tabla acepta ambos valores
SELECT column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'envios' 
AND column_name = 'tipo_envio';

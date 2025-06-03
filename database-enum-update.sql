-- Script para verificar y actualizar los enums en la base de datos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar los valores actuales de los enums
SELECT 
  t.typname AS enum_name,
  e.enumlabel AS enum_value
FROM 
  pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
WHERE 
  t.typname IN ('estado_envio', 'estado_reparto', 'tipo_envio')
ORDER BY 
  t.typname, e.enumsortorder;

-- 2. Verificar si el enum tipo_envio tiene los valores correctos
DO $$ 
BEGIN
  -- Verificar si el valor "origen" existe en tipo_envio
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_enum 
    WHERE enumlabel = 'origen' 
    AND enumtypid = (
      SELECT oid 
      FROM pg_type 
      WHERE typname = 'tipo_envio'
    )
  ) THEN
    -- Agregar el valor "origen" al enum
    ALTER TYPE tipo_envio ADD VALUE 'origen';
    RAISE NOTICE 'Valor "origen" agregado al enum tipo_envio';
  ELSE
    RAISE NOTICE 'El valor "origen" ya existe en el enum tipo_envio';
  END IF;
  
  -- Verificar si el valor "entrega" existe en tipo_envio
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_enum 
    WHERE enumlabel = 'entrega' 
    AND enumtypid = (
      SELECT oid 
      FROM pg_type 
      WHERE typname = 'tipo_envio'
    )
  ) THEN
    -- Agregar el valor "entrega" al enum
    ALTER TYPE tipo_envio ADD VALUE 'entrega';
    RAISE NOTICE 'Valor "entrega" agregado al enum tipo_envio';
  ELSE
    RAISE NOTICE 'El valor "entrega" ya existe en el enum tipo_envio';
  END IF;
  
  -- Verificar si el valor "recogida" existe en tipo_envio
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
    -- Agregar el valor "recogida" al enum
    ALTER TYPE tipo_envio ADD VALUE 'recogida';
    RAISE NOTICE 'Valor "recogida" agregado al enum tipo_envio';
  ELSE
    RAISE NOTICE 'El valor "recogida" ya existe en el enum tipo_envio';
  END IF;
END $$;

-- 3. Verificar si el enum estado_envio tiene los valores correctos
DO $$ 
BEGIN
  -- Verificar si el valor "en_transito" existe en estado_envio
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_enum 
    WHERE enumlabel = 'en_transito' 
    AND enumtypid = (
      SELECT oid 
      FROM pg_type 
      WHERE typname = 'estado_envio'
    )
  ) THEN
    -- Agregar el valor "en_transito" al enum
    ALTER TYPE estado_envio ADD VALUE 'en_transito';
    RAISE NOTICE 'Valor "en_transito" agregado al enum estado_envio';
  ELSE
    RAISE NOTICE 'El valor "en_transito" ya existe en el enum estado_envio';
  END IF;
  
  -- Verificar si el valor "entregado" existe en estado_envio
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_enum 
    WHERE enumlabel = 'entregado' 
    AND enumtypid = (
      SELECT oid 
      FROM pg_type 
      WHERE typname = 'estado_envio'
    )
  ) THEN
    -- Agregar el valor "entregado" al enum
    ALTER TYPE estado_envio ADD VALUE 'entregado';
    RAISE NOTICE 'Valor "entregado" agregado al enum estado_envio';
  ELSE
    RAISE NOTICE 'El valor "entregado" ya existe en el enum estado_envio';
  END IF;
END $$;

-- 4. Verificar los valores actualizados de los enums
SELECT 
  t.typname AS enum_name,
  e.enumlabel AS enum_value
FROM 
  pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
WHERE 
  t.typname IN ('estado_envio', 'estado_reparto', 'tipo_envio')
ORDER BY 
  t.typname, e.enumsortorder;

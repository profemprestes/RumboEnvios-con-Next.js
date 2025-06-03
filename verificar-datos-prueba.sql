-- Script para verificar que los datos de prueba estén correctamente configurados
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar empresas
SELECT 
  'EMPRESAS' as tabla,
  count(*) as total,
  string_agg(nombre, ', ') as nombres
FROM public.empresas;

-- 2. Verificar repartidores activos
SELECT 
  'REPARTIDORES' as tabla,
  count(*) as total,
  string_agg(nombre || ' ' || apellido, ', ') as nombres
FROM public.repartidores 
WHERE activo = true;

-- 3. Verificar clientes por empresa
SELECT 
  e.nombre as empresa,
  count(c.id) as total_clientes,
  string_agg(c.nombre || ' ' || COALESCE(c.apellido, ''), ', ') as clientes
FROM public.empresas e
LEFT JOIN public.clientes c ON e.id = c.empresa_id
GROUP BY e.id, e.nombre
ORDER BY e.nombre;

-- 4. Verificar que los enums estén correctamente configurados
SELECT 
  'ENUM tipo_envio' as enum_name,
  enumlabel as valores
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'tipo_envio')
ORDER BY enumsortorder;

SELECT 
  'ENUM estado_envio' as enum_name,
  enumlabel as valores
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'estado_envio')
ORDER BY enumsortorder;

SELECT 
  'ENUM estado_reparto' as enum_name,
  enumlabel as valores
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'estado_reparto')
ORDER BY enumsortorder;

-- 5. Verificar permisos RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('empresas', 'clientes', 'repartidores', 'repartos', 'envios', 'paradas_reparto')
ORDER BY tablename, policyname;

-- 6. Verificar que RLS esté habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('empresas', 'clientes', 'repartidores', 'repartos', 'envios', 'paradas_reparto')
ORDER BY tablename;

-- 7. Verificar función get_current_repartidor_id
SELECT get_current_repartidor_id() as current_repartidor_id;

-- 8. Verificar últimos repartos creados
SELECT 
  r.id,
  r.fecha,
  r.estado,
  rep.nombre || ' ' || rep.apellido as repartidor,
  r.created_at
FROM public.repartos r
JOIN public.repartidores rep ON r.repartidor_id = rep.id
ORDER BY r.created_at DESC
LIMIT 5;

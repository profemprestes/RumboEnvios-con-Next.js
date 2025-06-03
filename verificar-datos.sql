-- Script para verificar que los datos estén correctamente insertados
-- Ejecutar en Supabase SQL Editor

-- Verificar empresas
SELECT 'EMPRESAS' as tabla, count(*) as total FROM public.empresas;
SELECT * FROM public.empresas;

-- Verificar clientes
SELECT 'CLIENTES' as tabla, count(*) as total FROM public.clientes;
SELECT c.*, e.nombre as empresa_nombre 
FROM public.clientes c 
LEFT JOIN public.empresas e ON c.empresa_id = e.id;

-- Verificar repartidores
SELECT 'REPARTIDORES' as tabla, count(*) as total FROM public.repartidores;
SELECT * FROM public.repartidores;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('empresas', 'clientes', 'repartidores');

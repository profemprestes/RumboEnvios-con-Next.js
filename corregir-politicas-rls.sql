-- Script para corregir las políticas RLS (Row Level Security)
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la función get_current_repartidor_id
CREATE OR REPLACE FUNCTION get_current_repartidor_id()
RETURNS uuid AS $$
DECLARE
  repartidor_id uuid;
  auth_id uuid;
BEGIN
  -- Obtener el ID de autenticación del usuario actual
  auth_id := auth.uid();
  
  -- Registrar para diagnóstico
  RAISE NOTICE 'Auth ID: %', auth_id;
  
  -- Buscar el ID del repartidor asociado
  SELECT id INTO repartidor_id
  FROM public.repartidores
  WHERE user_auth_id = auth_id
  AND activo = true
  LIMIT 1;
  
  -- Registrar para diagnóstico
  RAISE NOTICE 'Repartidor ID encontrado: %', repartidor_id;
  
  RETURN repartidor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear tabla de diagnóstico RLS
CREATE TABLE IF NOT EXISTS public.rls_diagnostico (
  id serial PRIMARY KEY,
  nombre text,
  descripcion text,
  created_at timestamp with time zone DEFAULT now()
);

-- Insertar datos de prueba
INSERT INTO public.rls_diagnostico (nombre, descripcion)
VALUES ('test', 'Registro de prueba para diagnóstico RLS');

-- Crear política permisiva
DROP POLICY IF EXISTS "rls_diagnostico_select_all" ON public.rls_diagnostico;
CREATE POLICY "rls_diagnostico_select_all" ON public.rls_diagnostico
  FOR SELECT USING (true);

-- Habilitar RLS
ALTER TABLE public.rls_diagnostico ENABLE ROW LEVEL SECURITY;

-- 3. Verificar y corregir políticas para repartos
-- Eliminar políticas existentes para repartos
DROP POLICY IF EXISTS "repartos_select_own" ON public.repartos;
DROP POLICY IF EXISTS "repartos_insert_own" ON public.repartos;
DROP POLICY IF EXISTS "repartos_update_own" ON public.repartos;
DROP POLICY IF EXISTS "repartos_insert_admin" ON public.repartos;

-- Crear nuevas políticas más permisivas para repartos
CREATE POLICY "repartos_select_all" ON public.repartos
  FOR SELECT USING (true);

CREATE POLICY "repartos_insert_all" ON public.repartos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "repartos_update_all" ON public.repartos
  FOR UPDATE USING (true);

-- 4. Verificar y corregir políticas para envíos
DROP POLICY IF EXISTS "envios_select_assigned" ON public.envios;
DROP POLICY IF EXISTS "envios_update_assigned" ON public.envios;
DROP POLICY IF EXISTS "envios_insert_admin" ON public.envios;

CREATE POLICY "envios_select_all" ON public.envios
  FOR SELECT USING (true);

CREATE POLICY "envios_insert_all" ON public.envios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "envios_update_all" ON public.envios
  FOR UPDATE USING (true);

-- 5. Verificar y corregir políticas para paradas_reparto
DROP POLICY IF EXISTS "paradas_reparto_select_own" ON public.paradas_reparto;
DROP POLICY IF EXISTS "paradas_reparto_update_own" ON public.paradas_reparto;
DROP POLICY IF EXISTS "paradas_reparto_insert_own" ON public.paradas_reparto;

CREATE POLICY "paradas_reparto_select_all" ON public.paradas_reparto
  FOR SELECT USING (true);

CREATE POLICY "paradas_reparto_insert_all" ON public.paradas_reparto
  FOR INSERT WITH CHECK (true);

CREATE POLICY "paradas_reparto_update_all" ON public.paradas_reparto
  FOR UPDATE USING (true);

-- 6. Verificar que RLS esté habilitado en todas las tablas
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('empresas', 'clientes', 'repartidores', 'repartos', 'envios', 'paradas_reparto', 'rls_diagnostico')
ORDER BY tablename;

-- 7. Verificar las políticas actualizadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('empresas', 'clientes', 'repartidores', 'repartos', 'envios', 'paradas_reparto', 'rls_diagnostico')
ORDER BY tablename, policyname;

-- 8. Probar la función get_current_repartidor_id
SELECT get_current_repartidor_id() as current_repartidor_id;

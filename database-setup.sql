-- =====================================================
-- RUMBO ENVÍOS - DATABASE SETUP SCRIPT
-- =====================================================
-- Este script configura la base de datos completa para Rumbo Envíos
-- Incluye: ENUMs, Tablas, Funciones, RLS y datos de prueba

-- =====================================================
-- 1. CREAR TIPOS ENUM
-- =====================================================

-- Enum para estados de envío
CREATE TYPE estado_envio AS ENUM (
  'pendiente',
  'asignado', 
  'en_progreso',
  'completado',
  'fallido',
  'cancelado'
);

-- Enum para estados de reparto
CREATE TYPE estado_reparto AS ENUM (
  'pendiente',
  'en_progreso', 
  'completado',
  'cancelado'
);

-- Enum para tipos de envío
CREATE TYPE tipo_envio AS ENUM (
  'entrega',
  'recogida'
);

-- =====================================================
-- 2. CREAR TABLAS
-- =====================================================

-- Tabla de empresas
CREATE TABLE IF NOT EXISTS public.empresas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  direccion text,
  telefono text,
  email text,
  latitud_empresa double precision,
  longitud_empresa double precision,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT empresas_pkey PRIMARY KEY (id)
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  apellido text,
  telefono text,
  email text,
  direccion text,
  latitud numeric,
  longitud numeric,
  empresa_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT clientes_pkey PRIMARY KEY (id),
  CONSTRAINT clientes_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE SET NULL
);

-- Tabla de repartidores
CREATE TABLE IF NOT EXISTS public.repartidores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_auth_id uuid NOT NULL UNIQUE,
  nombre text NOT NULL,
  apellido text NOT NULL,
  telefono text,
  vehiculo text,
  matricula text,
  activo boolean NOT NULL DEFAULT true,
  empresa_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT repartidores_pkey PRIMARY KEY (id),
  CONSTRAINT repartidores_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE SET NULL,
  CONSTRAINT repartidores_user_auth_id_fkey FOREIGN KEY (user_auth_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla de repartos
CREATE TABLE IF NOT EXISTS public.repartos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  repartidor_id uuid NOT NULL,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  estado estado_reparto NOT NULL DEFAULT 'pendiente',
  notas text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT repartos_pkey PRIMARY KEY (id),
  CONSTRAINT repartos_repartidor_id_fkey FOREIGN KEY (repartidor_id) REFERENCES public.repartidores(id) ON DELETE CASCADE
);

-- Tabla de envíos
CREATE TABLE IF NOT EXISTS public.envios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  numero_seguimiento text NOT NULL UNIQUE,
  cliente_id uuid NOT NULL,
  repartidor_id uuid,
  reparto_id uuid,
  direccion_origen text NOT NULL DEFAULT '',
  latitud_origen numeric NOT NULL,
  longitud_origen numeric NOT NULL,
  direccion_destino text NOT NULL,
  latitud_destino numeric NOT NULL,
  longitud_destino numeric NOT NULL,
  estado estado_envio NOT NULL DEFAULT 'pendiente',
  descripcion text,
  peso numeric,
  valor_declarado numeric,
  fecha_estimada date,
  fecha_entrega timestamp with time zone,
  notas_entrega text,
  orden_parada integer,
  tipo_envio tipo_envio DEFAULT 'entrega',
  es_parada_origen boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT envios_pkey PRIMARY KEY (id),
  CONSTRAINT envios_reparto_id_fkey FOREIGN KEY (reparto_id) REFERENCES public.repartos(id) ON DELETE SET NULL,
  CONSTRAINT envios_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE,
  CONSTRAINT envios_repartidor_id_fkey FOREIGN KEY (repartidor_id) REFERENCES public.repartidores(id) ON DELETE SET NULL
);

-- Tabla de paradas de reparto
CREATE TABLE IF NOT EXISTS public.paradas_reparto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reparto_id uuid NOT NULL,
  envio_id uuid NOT NULL,
  orden integer NOT NULL,
  completada boolean NOT NULL DEFAULT false,
  hora_llegada timestamp with time zone,
  hora_salida timestamp with time zone,
  notas text,
  estado text DEFAULT 'pendiente' CHECK (estado = ANY (ARRAY['pendiente', 'asignado', 'en_progreso', 'completado', 'fallido'])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT paradas_reparto_pkey PRIMARY KEY (id),
  CONSTRAINT paradas_reparto_reparto_id_fkey FOREIGN KEY (reparto_id) REFERENCES public.repartos(id) ON DELETE CASCADE,
  CONSTRAINT paradas_reparto_envio_id_fkey FOREIGN KEY (envio_id) REFERENCES public.envios(id) ON DELETE CASCADE,
  CONSTRAINT paradas_reparto_unique_orden UNIQUE (reparto_id, orden)
);

-- =====================================================
-- 3. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para mejorar performance de consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_id ON public.clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_repartidores_user_auth_id ON public.repartidores(user_auth_id);
CREATE INDEX IF NOT EXISTS idx_repartidores_activo ON public.repartidores(activo);
CREATE INDEX IF NOT EXISTS idx_repartos_repartidor_id ON public.repartos(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_repartos_fecha ON public.repartos(fecha);
CREATE INDEX IF NOT EXISTS idx_repartos_estado ON public.repartos(estado);
CREATE INDEX IF NOT EXISTS idx_envios_cliente_id ON public.envios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_envios_repartidor_id ON public.envios(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_envios_reparto_id ON public.envios(reparto_id);
CREATE INDEX IF NOT EXISTS idx_envios_estado ON public.envios(estado);
CREATE INDEX IF NOT EXISTS idx_envios_numero_seguimiento ON public.envios(numero_seguimiento);
CREATE INDEX IF NOT EXISTS idx_paradas_reparto_reparto_id ON public.paradas_reparto(reparto_id);
CREATE INDEX IF NOT EXISTS idx_paradas_reparto_envio_id ON public.paradas_reparto(envio_id);
CREATE INDEX IF NOT EXISTS idx_paradas_reparto_orden ON public.paradas_reparto(reparto_id, orden);

-- =====================================================
-- 4. FUNCIONES AUXILIARES
-- =====================================================

-- Función para obtener el ID del repartidor actual
CREATE OR REPLACE FUNCTION get_current_repartidor_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT id 
    FROM public.repartidores 
    WHERE user_auth_id = auth.uid()
    AND activo = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar número de seguimiento único
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS text AS $$
DECLARE
  tracking_number text;
  exists_check boolean;
BEGIN
  LOOP
    -- Generar número de seguimiento: RE + timestamp + 4 dígitos aleatorios
    tracking_number := 'RE' || 
                      to_char(now(), 'YYYYMMDD') || 
                      lpad(floor(random() * 10000)::text, 4, '0');
    
    -- Verificar si ya existe
    SELECT EXISTS(
      SELECT 1 FROM public.envios WHERE numero_seguimiento = tracking_number
    ) INTO exists_check;
    
    -- Si no existe, salir del loop
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN tracking_number;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar orden de paradas
CREATE OR REPLACE FUNCTION actualizar_orden_paradas_reparto(
  p_reparto_id uuid,
  p_paradas_actualizadas jsonb
)
RETURNS void AS $$
DECLARE
  parada_record record;
BEGIN
  -- Iterar sobre las paradas a actualizar
  FOR parada_record IN 
    SELECT 
      (value->>'parada_id')::uuid as parada_id,
      (value->>'nuevo_orden')::integer as nuevo_orden
    FROM jsonb_array_elements(p_paradas_actualizadas)
  LOOP
    UPDATE public.paradas_reparto 
    SET orden = parada_record.nuevo_orden,
        updated_at = now()
    WHERE id = parada_record.parada_id 
    AND reparto_id = p_reparto_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Función trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a todas las tablas
CREATE TRIGGER update_empresas_updated_at 
  BEFORE UPDATE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at 
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repartidores_updated_at 
  BEFORE UPDATE ON public.repartidores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repartos_updated_at 
  BEFORE UPDATE ON public.repartos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_envios_updated_at 
  BEFORE UPDATE ON public.envios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paradas_reparto_updated_at 
  BEFORE UPDATE ON public.paradas_reparto
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para generar número de seguimiento automáticamente
CREATE OR REPLACE FUNCTION set_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_seguimiento IS NULL OR NEW.numero_seguimiento = '' THEN
    NEW.numero_seguimiento = generate_tracking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_envios_tracking_number
  BEFORE INSERT ON public.envios
  FOR EACH ROW EXECUTE FUNCTION set_tracking_number();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repartidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paradas_reparto ENABLE ROW LEVEL SECURITY;

-- Políticas para repartidores
CREATE POLICY "repartidores_select_own" ON public.repartidores
  FOR SELECT USING (user_auth_id = auth.uid());

CREATE POLICY "repartidores_update_own" ON public.repartidores
  FOR UPDATE USING (user_auth_id = auth.uid());

-- Políticas para repartos
CREATE POLICY "repartos_select_own" ON public.repartos
  FOR SELECT USING (repartidor_id = get_current_repartidor_id());

CREATE POLICY "repartos_insert_own" ON public.repartos
  FOR INSERT WITH CHECK (repartidor_id = get_current_repartidor_id());

CREATE POLICY "repartos_update_own" ON public.repartos
  FOR UPDATE USING (repartidor_id = get_current_repartidor_id());

-- Políticas para envíos
CREATE POLICY "envios_select_assigned" ON public.envios
  FOR SELECT USING (
    repartidor_id = get_current_repartidor_id() OR
    reparto_id IN (
      SELECT id FROM public.repartos WHERE repartidor_id = get_current_repartidor_id()
    )
  );

CREATE POLICY "envios_update_assigned" ON public.envios
  FOR UPDATE USING (
    repartidor_id = get_current_repartidor_id() OR
    reparto_id IN (
      SELECT id FROM public.repartos WHERE repartidor_id = get_current_repartidor_id()
    )
  );

-- Políticas para paradas de reparto
CREATE POLICY "paradas_reparto_select_own" ON public.paradas_reparto
  FOR SELECT USING (
    reparto_id IN (
      SELECT id FROM public.repartos WHERE repartidor_id = get_current_repartidor_id()
    )
  );

CREATE POLICY "paradas_reparto_update_own" ON public.paradas_reparto
  FOR UPDATE USING (
    reparto_id IN (
      SELECT id FROM public.repartos WHERE repartidor_id = get_current_repartidor_id()
    )
  );

CREATE POLICY "paradas_reparto_insert_own" ON public.paradas_reparto
  FOR INSERT WITH CHECK (
    reparto_id IN (
      SELECT id FROM public.repartos WHERE repartidor_id = get_current_repartidor_id()
    )
  );

-- Políticas para empresas y clientes (solo lectura)
CREATE POLICY "empresas_select_all" ON public.empresas
  FOR SELECT USING (true);

CREATE POLICY "clientes_select_all" ON public.clientes
  FOR SELECT USING (true);

-- Políticas adicionales para permitir operaciones administrativas
CREATE POLICY "repartos_insert_admin" ON public.repartos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.repartidores 
      WHERE id = repartidor_id AND activo = true
    )
  );

CREATE POLICY "envios_insert_admin" ON public.envios
  FOR INSERT WITH CHECK (
    repartidor_id IN (
      SELECT id FROM public.repartidores WHERE activo = true
    )
  );

-- Política para permitir ver todos los repartidores activos
CREATE POLICY "repartidores_select_all_active" ON public.repartidores
  FOR SELECT USING (activo = true);

-- =====================================================
-- 7. DATOS DE PRUEBA
-- =====================================================

-- Insertar empresas de ejemplo
INSERT INTO public.empresas (nombre, direccion, telefono, email, latitud_empresa, longitud_empresa) VALUES
('Empresa ABC Logística', 'Av. Corrientes 1234, CABA, Argentina', '+54 11 1234-5678', 'contacto@empresaabc.com', -34.6037, -58.3816),
('Distribuidora XYZ', 'Av. Santa Fe 5678, CABA, Argentina', '+54 11 8765-4321', 'info@distribuidoraxyz.com', -34.5956, -58.3772),
('Comercial Del Sur', 'Av. Rivadavia 9876, CABA, Argentina', '+54 11 5555-0000', 'ventas@comercialdelsur.com', -34.6118, -58.3960)
ON CONFLICT DO NOTHING;

-- Insertar clientes de ejemplo
INSERT INTO public.clientes (nombre, apellido, direccion, telefono, email, latitud, longitud, empresa_id) 
SELECT 
  'Juan', 'Pérez', 'Av. Rivadavia 1000, CABA', '+54 11 1111-1111', 'juan.perez@email.com', -34.6118, -58.3960, e.id
FROM public.empresas e WHERE e.nombre = 'Empresa ABC Logística'
UNION ALL
SELECT 
  'María', 'González', 'Av. Cabildo 2000, CABA', '+54 11 2222-2222', 'maria.gonzalez@email.com', -34.5601, -58.4601, e.id
FROM public.empresas e WHERE e.nombre = 'Empresa ABC Logística'
UNION ALL
SELECT 
  'Carlos', 'López', 'Av. Las Heras 3000, CABA', '+54 11 3333-3333', 'carlos.lopez@email.com', -34.5889, -58.3974, e.id
FROM public.empresas e WHERE e.nombre = 'Distribuidora XYZ'
UNION ALL
SELECT 
  'Ana', 'Martínez', 'Av. Belgrano 4000, CABA', '+54 11 4444-4444', 'ana.martinez@email.com', -34.6092, -58.3731, e.id
FROM public.empresas e WHERE e.nombre = 'Distribuidora XYZ'
UNION ALL
SELECT 
  'Luis', 'Rodríguez', 'Av. Callao 5000, CABA', '+54 11 5555-5555', 'luis.rodriguez@email.com', -34.5998, -58.3925, e.id
FROM public.empresas e WHERE e.nombre = 'Comercial Del Sur'
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.empresas IS 'Empresas cliente que solicitan servicios de reparto';
COMMENT ON TABLE public.clientes IS 'Clientes finales que reciben las entregas';
COMMENT ON TABLE public.repartidores IS 'Personal de reparto registrado en el sistema';
COMMENT ON TABLE public.repartos IS 'Agrupaciones de entregas asignadas a un repartidor para una fecha específica';
COMMENT ON TABLE public.envios IS 'Entregas individuales con información completa de origen y destino';
COMMENT ON TABLE public.paradas_reparto IS 'Paradas individuales dentro de un reparto, vinculando envíos específicos';

COMMENT ON FUNCTION get_current_repartidor_id() IS 'Obtiene el ID del repartidor basado en el usuario autenticado';
COMMENT ON FUNCTION generate_tracking_number() IS 'Genera un número de seguimiento único para envíos';
COMMENT ON FUNCTION actualizar_orden_paradas_reparto(uuid, jsonb) IS 'Actualiza el orden de visita de múltiples paradas de manera atómica';

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================
-- 
-- INSTRUCCIONES POST-INSTALACIÓN:
-- 
-- 1. Después de ejecutar este script, crea un usuario en Supabase Auth
-- 2. Inserta el repartidor asociado con el siguiente comando:
--    
--    INSERT INTO public.repartidores (nombre, apellido, user_auth_id, telefono, vehiculo) 
--    VALUES ('Tu Nombre', 'Tu Apellido', 'UUID_DEL_USUARIO_AUTH', '+54 11 0000-0000', 'Moto Honda');
--
-- 3. Verifica que las políticas RLS estén funcionando correctamente
-- 4. Prueba la aplicación con los datos de ejemplo
--
-- =====================================================

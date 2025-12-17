-- Vehicles table with telematics data
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  owner_name TEXT NOT NULL,
  owner_email TEXT,
  owner_phone TEXT,
  vin TEXT UNIQUE,
  license_plate TEXT,
  health_score INTEGER DEFAULT 85 CHECK (health_score >= 0 AND health_score <= 100),
  mileage INTEGER DEFAULT 0,
  last_service_date TIMESTAMP WITH TIME ZONE,
  next_service_date TIMESTAMP WITH TIME ZONE,
  telematics_status TEXT DEFAULT 'active' CHECK (telematics_status IN ('active', 'inactive', 'error')),
  engine_temp DECIMAL(5,2) DEFAULT 85.0,
  battery_voltage DECIMAL(4,2) DEFAULT 12.6,
  oil_pressure DECIMAL(5,2) DEFAULT 40.0,
  tire_pressure_fl DECIMAL(4,1) DEFAULT 32.0,
  tire_pressure_fr DECIMAL(4,1) DEFAULT 32.0,
  tire_pressure_rl DECIMAL(4,1) DEFAULT 32.0,
  tire_pressure_rr DECIMAL(4,1) DEFAULT 32.0,
  fuel_level INTEGER DEFAULT 75,
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maintenance alerts table
CREATE TABLE public.maintenance_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  component TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  description TEXT NOT NULL,
  predicted_failure_date TIMESTAMP WITH TIME ZONE,
  confidence_score DECIMAL(5,2) DEFAULT 0.85,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  ai_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service centers table
CREATE TABLE public.service_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INTEGER DEFAULT 20,
  current_load INTEGER DEFAULT 0,
  available_slots INTEGER DEFAULT 15,
  specializations TEXT[],
  operating_hours TEXT DEFAULT '8:00 AM - 6:00 PM',
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_center_id UUID REFERENCES public.service_centers(id) ON DELETE SET NULL,
  alert_id UUID REFERENCES public.maintenance_alerts(id) ON DELETE SET NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_duration INTEGER DEFAULT 60,
  service_type TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  customer_notes TEXT,
  technician_notes TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RCA/CAPA analysis table
CREATE TABLE public.rca_capa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component TEXT NOT NULL,
  failure_type TEXT NOT NULL,
  root_cause TEXT NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  affected_models TEXT[],
  corrective_action TEXT,
  preventive_action TEXT,
  manufacturing_feedback TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'implemented', 'verified', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  assigned_team TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- UEBA security logs table
CREATE TABLE public.ueba_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  resource_accessed TEXT,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  is_anomaly BOOLEAN DEFAULT false,
  anomaly_type TEXT,
  ip_address TEXT,
  session_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer feedback table
CREATE TABLE public.customer_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI chat history for customer engagement
CREATE TABLE public.ai_chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_vehicles_health_score ON public.vehicles(health_score);
CREATE INDEX idx_alerts_severity ON public.maintenance_alerts(severity);
CREATE INDEX idx_alerts_vehicle ON public.maintenance_alerts(vehicle_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_date ON public.appointments(scheduled_date);
CREATE INDEX idx_ueba_risk ON public.ueba_logs(risk_score);
CREATE INDEX idx_ueba_anomaly ON public.ueba_logs(is_anomaly);
CREATE INDEX idx_rca_status ON public.rca_capa(status);

-- Enable Row Level Security (public access for demo)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rca_capa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ueba_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Create public read policies for demo
CREATE POLICY "Allow public read on vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on vehicles" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on vehicles" ON public.vehicles FOR UPDATE USING (true);

CREATE POLICY "Allow public read on alerts" ON public.maintenance_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on alerts" ON public.maintenance_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on alerts" ON public.maintenance_alerts FOR UPDATE USING (true);

CREATE POLICY "Allow public read on service_centers" ON public.service_centers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on service_centers" ON public.service_centers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on appointments" ON public.appointments FOR UPDATE USING (true);

CREATE POLICY "Allow public read on rca_capa" ON public.rca_capa FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rca_capa" ON public.rca_capa FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rca_capa" ON public.rca_capa FOR UPDATE USING (true);

CREATE POLICY "Allow public read on ueba_logs" ON public.ueba_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ueba_logs" ON public.ueba_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on feedback" ON public.customer_feedback FOR SELECT USING (true);
CREATE POLICY "Allow public insert on feedback" ON public.customer_feedback FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on chat_history" ON public.ai_chat_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert on chat_history" ON public.ai_chat_history FOR INSERT WITH CHECK (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rca_capa_updated_at BEFORE UPDATE ON public.rca_capa FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
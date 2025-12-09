// Mock data for the AutoMaintain AI platform

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  mileage: number;
  lastService: string;
  nextServiceDue: string;
  healthScore: number;
  status: 'healthy' | 'warning' | 'critical';
  location: string;
  telematicsConnected: boolean;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  predictedFailureDate: string;
  confidence: number;
  description: string;
  recommendedAction: string;
  estimatedCost: number;
  status: 'pending' | 'scheduled' | 'completed' | 'dismissed';
  createdAt: string;
}

export interface ServiceAppointment {
  id: string;
  vehicleId: string;
  customerName: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceCenterId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  estimatedDuration: number;
  assignedTechnician: string;
}

export interface ServiceCenter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentLoad: number;
  availableSlots: number;
  rating: number;
}

export interface RCAInsight {
  id: string;
  defectType: string;
  affectedComponent: string;
  occurrenceCount: number;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  manufacturingFeedback: string;
}

export interface UEBAEvent {
  id: string;
  agentType: string;
  eventType: 'normal' | 'anomaly' | 'alert';
  action: string;
  timestamp: string;
  riskScore: number;
  description: string;
  resolved: boolean;
}

export const vehicles: Vehicle[] = [
  {
    id: 'VH001',
    vin: 'MAHFX1234567890AB',
    make: 'Mahindra',
    model: 'XUV700',
    year: 2023,
    ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 98765 43210',
    ownerEmail: 'rajesh.kumar@email.com',
    mileage: 45230,
    lastService: '2024-10-15',
    nextServiceDue: '2025-01-15',
    healthScore: 92,
    status: 'healthy',
    location: 'Mumbai, Maharashtra',
    telematicsConnected: true
  },
  {
    id: 'VH002',
    vin: 'TATFX9876543210CD',
    make: 'Tata',
    model: 'Nexon EV',
    year: 2024,
    ownerName: 'Priya Sharma',
    ownerPhone: '+91 87654 32109',
    ownerEmail: 'priya.sharma@email.com',
    mileage: 12450,
    lastService: '2024-11-01',
    nextServiceDue: '2025-02-01',
    healthScore: 78,
    status: 'warning',
    location: 'Bangalore, Karnataka',
    telematicsConnected: true
  },
  {
    id: 'VH003',
    vin: 'MARHX5432109876EF',
    make: 'Maruti',
    model: 'Grand Vitara',
    year: 2023,
    ownerName: 'Amit Patel',
    ownerPhone: '+91 76543 21098',
    ownerEmail: 'amit.patel@email.com',
    mileage: 67890,
    lastService: '2024-08-20',
    nextServiceDue: '2024-11-20',
    healthScore: 45,
    status: 'critical',
    location: 'Delhi NCR',
    telematicsConnected: true
  },
  {
    id: 'VH004',
    vin: 'HONFX6789012345GH',
    make: 'Honda',
    model: 'City Hybrid',
    year: 2024,
    ownerName: 'Sneha Reddy',
    ownerPhone: '+91 65432 10987',
    ownerEmail: 'sneha.reddy@email.com',
    mileage: 8900,
    lastService: '2024-11-10',
    nextServiceDue: '2025-02-10',
    healthScore: 98,
    status: 'healthy',
    location: 'Hyderabad, Telangana',
    telematicsConnected: true
  },
  {
    id: 'VH005',
    vin: 'KIAFX3456789012IJ',
    make: 'Kia',
    model: 'Seltos',
    year: 2022,
    ownerName: 'Vikram Singh',
    ownerPhone: '+91 54321 09876',
    ownerEmail: 'vikram.singh@email.com',
    mileage: 89500,
    lastService: '2024-09-05',
    nextServiceDue: '2024-12-05',
    healthScore: 68,
    status: 'warning',
    location: 'Chennai, Tamil Nadu',
    telematicsConnected: true
  },
  {
    id: 'VH006',
    vin: 'HYUFX7890123456KL',
    make: 'Hyundai',
    model: 'Creta',
    year: 2023,
    ownerName: 'Meera Nair',
    ownerPhone: '+91 43210 98765',
    ownerEmail: 'meera.nair@email.com',
    mileage: 34560,
    lastService: '2024-10-28',
    nextServiceDue: '2025-01-28',
    healthScore: 85,
    status: 'healthy',
    location: 'Kochi, Kerala',
    telematicsConnected: true
  },
  {
    id: 'VH007',
    vin: 'MGAFX1234567890MN',
    make: 'MG',
    model: 'Hector Plus',
    year: 2023,
    ownerName: 'Arjun Mehta',
    ownerPhone: '+91 32109 87654',
    ownerEmail: 'arjun.mehta@email.com',
    mileage: 56780,
    lastService: '2024-09-15',
    nextServiceDue: '2024-12-15',
    healthScore: 72,
    status: 'warning',
    location: 'Pune, Maharashtra',
    telematicsConnected: true
  },
  {
    id: 'VH008',
    vin: 'SKOFX9012345678OP',
    make: 'Skoda',
    model: 'Kushaq',
    year: 2024,
    ownerName: 'Kavita Joshi',
    ownerPhone: '+91 21098 76543',
    ownerEmail: 'kavita.joshi@email.com',
    mileage: 15670,
    lastService: '2024-11-05',
    nextServiceDue: '2025-02-05',
    healthScore: 94,
    status: 'healthy',
    location: 'Ahmedabad, Gujarat',
    telematicsConnected: true
  },
  {
    id: 'VH009',
    vin: 'JEWFX5678901234QR',
    make: 'Jeep',
    model: 'Meridian',
    year: 2023,
    ownerName: 'Rahul Verma',
    ownerPhone: '+91 10987 65432',
    ownerEmail: 'rahul.verma@email.com',
    mileage: 42100,
    lastService: '2024-10-01',
    nextServiceDue: '2025-01-01',
    healthScore: 88,
    status: 'healthy',
    location: 'Jaipur, Rajasthan',
    telematicsConnected: true
  },
  {
    id: 'VH010',
    vin: 'VOLFX2345678901ST',
    make: 'Volkswagen',
    model: 'Taigun',
    year: 2024,
    ownerName: 'Ananya Das',
    ownerPhone: '+91 09876 54321',
    ownerEmail: 'ananya.das@email.com',
    mileage: 22340,
    lastService: '2024-10-20',
    nextServiceDue: '2025-01-20',
    healthScore: 91,
    status: 'healthy',
    location: 'Kolkata, West Bengal',
    telematicsConnected: true
  }
];

export const maintenanceAlerts: MaintenanceAlert[] = [
  {
    id: 'MA001',
    vehicleId: 'VH003',
    component: 'Brake Pads',
    severity: 'critical',
    predictedFailureDate: '2024-12-15',
    confidence: 94,
    description: 'Brake pad wear detected at 92%. Immediate replacement recommended.',
    recommendedAction: 'Replace front and rear brake pads',
    estimatedCost: 8500,
    status: 'pending',
    createdAt: '2024-12-01'
  },
  {
    id: 'MA002',
    vehicleId: 'VH002',
    component: 'Battery Health',
    severity: 'high',
    predictedFailureDate: '2025-01-20',
    confidence: 87,
    description: 'EV battery degradation detected. Capacity reduced to 85%.',
    recommendedAction: 'Schedule battery health check and potential module replacement',
    estimatedCost: 45000,
    status: 'scheduled',
    createdAt: '2024-11-28'
  },
  {
    id: 'MA003',
    vehicleId: 'VH005',
    component: 'Transmission',
    severity: 'medium',
    predictedFailureDate: '2025-02-10',
    confidence: 76,
    description: 'Unusual transmission vibration patterns detected during gear shifts.',
    recommendedAction: 'Inspect transmission fluid and clutch assembly',
    estimatedCost: 12000,
    status: 'pending',
    createdAt: '2024-11-25'
  },
  {
    id: 'MA004',
    vehicleId: 'VH007',
    component: 'Air Filter',
    severity: 'low',
    predictedFailureDate: '2025-01-15',
    confidence: 92,
    description: 'Air filter efficiency decreased by 40%. Affecting fuel economy.',
    recommendedAction: 'Replace engine air filter',
    estimatedCost: 1500,
    status: 'pending',
    createdAt: '2024-11-20'
  },
  {
    id: 'MA005',
    vehicleId: 'VH003',
    component: 'Engine Oil',
    severity: 'high',
    predictedFailureDate: '2024-12-20',
    confidence: 91,
    description: 'Engine oil viscosity degraded. Metal particles detected.',
    recommendedAction: 'Immediate oil change with full synthetic oil',
    estimatedCost: 4500,
    status: 'pending',
    createdAt: '2024-12-02'
  }
];

export const serviceAppointments: ServiceAppointment[] = [
  {
    id: 'SA001',
    vehicleId: 'VH002',
    customerName: 'Priya Sharma',
    serviceType: 'Battery Health Check',
    scheduledDate: '2024-12-10',
    scheduledTime: '10:00 AM',
    serviceCenterId: 'SC001',
    status: 'scheduled',
    estimatedDuration: 120,
    assignedTechnician: 'Tech. Suresh Kumar'
  },
  {
    id: 'SA002',
    vehicleId: 'VH006',
    customerName: 'Meera Nair',
    serviceType: 'Routine Service',
    scheduledDate: '2024-12-11',
    scheduledTime: '11:30 AM',
    serviceCenterId: 'SC003',
    status: 'scheduled',
    estimatedDuration: 90,
    assignedTechnician: 'Tech. Ramesh Iyer'
  },
  {
    id: 'SA003',
    vehicleId: 'VH001',
    customerName: 'Rajesh Kumar',
    serviceType: 'Tire Rotation',
    scheduledDate: '2024-12-09',
    scheduledTime: '02:00 PM',
    serviceCenterId: 'SC002',
    status: 'in-progress',
    estimatedDuration: 60,
    assignedTechnician: 'Tech. Anil Patil'
  }
];

export const serviceCenters: ServiceCenter[] = [
  {
    id: 'SC001',
    name: 'AutoMaintain Bangalore Central',
    location: 'Koramangala, Bangalore',
    capacity: 25,
    currentLoad: 18,
    availableSlots: 7,
    rating: 4.8
  },
  {
    id: 'SC002',
    name: 'AutoMaintain Mumbai West',
    location: 'Andheri, Mumbai',
    capacity: 30,
    currentLoad: 22,
    availableSlots: 8,
    rating: 4.6
  },
  {
    id: 'SC003',
    name: 'AutoMaintain Kochi Hub',
    location: 'Edapally, Kochi',
    capacity: 20,
    currentLoad: 15,
    availableSlots: 5,
    rating: 4.9
  }
];

export const rcaInsights: RCAInsight[] = [
  {
    id: 'RCA001',
    defectType: 'Premature Brake Wear',
    affectedComponent: 'Brake Pads - Front',
    occurrenceCount: 47,
    rootCause: 'Suboptimal friction material composition in batch B2024-Q3',
    correctiveAction: 'Replaced affected brake pads under warranty',
    preventiveAction: 'Enhanced quality control for friction material testing',
    status: 'in-progress',
    priority: 'high',
    manufacturingFeedback: 'Manufacturing team notified. New QC protocol implemented for incoming material inspection.'
  },
  {
    id: 'RCA002',
    defectType: 'EV Battery Cell Imbalance',
    affectedComponent: 'Lithium-ion Battery Pack',
    occurrenceCount: 23,
    rootCause: 'Inconsistent thermal management in high-temperature zones',
    correctiveAction: 'Software update for improved BMS algorithms',
    preventiveAction: 'Redesigned cooling channel layout for 2025 models',
    status: 'closed',
    priority: 'high',
    manufacturingFeedback: 'Design change approved. New thermal management system integrated in production line.'
  },
  {
    id: 'RCA003',
    defectType: 'Transmission Vibration',
    affectedComponent: 'CVT Assembly',
    occurrenceCount: 15,
    rootCause: 'Bearing tolerance deviation in supplier batch',
    correctiveAction: 'Bearing replacement and recalibration',
    preventiveAction: 'Stricter incoming quality inspection for bearings',
    status: 'open',
    priority: 'medium',
    manufacturingFeedback: 'Supplier audit scheduled. Alternative supplier evaluation in progress.'
  }
];

export const uebaEvents: UEBAEvent[] = [
  {
    id: 'UE001',
    agentType: 'Scheduling Agent',
    eventType: 'anomaly',
    action: 'Attempted to access vehicle telematics database',
    timestamp: '2024-12-09T08:45:23Z',
    riskScore: 78,
    description: 'Scheduling Agent attempted unauthorized access to telematics data outside its normal scope.',
    resolved: false
  },
  {
    id: 'UE002',
    agentType: 'Customer Engagement Agent',
    eventType: 'normal',
    action: 'Initiated customer callback for VH002',
    timestamp: '2024-12-09T09:15:00Z',
    riskScore: 5,
    description: 'Standard customer outreach for scheduled maintenance reminder.',
    resolved: true
  },
  {
    id: 'UE003',
    agentType: 'Diagnosis Agent',
    eventType: 'normal',
    action: 'Analyzed sensor data for VH003',
    timestamp: '2024-12-09T09:30:45Z',
    riskScore: 3,
    description: 'Routine diagnostic analysis completed within expected parameters.',
    resolved: true
  },
  {
    id: 'UE004',
    agentType: 'Data Analysis Agent',
    eventType: 'alert',
    action: 'Unusual API call frequency detected',
    timestamp: '2024-12-09T10:05:12Z',
    riskScore: 65,
    description: 'Data Analysis Agent made 150% more API calls than baseline. Investigating potential loop or malfunction.',
    resolved: false
  },
  {
    id: 'UE005',
    agentType: 'Master Agent',
    eventType: 'normal',
    action: 'Orchestrated multi-agent workflow for VH005',
    timestamp: '2024-12-09T10:20:00Z',
    riskScore: 2,
    description: 'Standard orchestration of predictive maintenance workflow.',
    resolved: true
  }
];

export const agentStats = {
  masterAgent: {
    status: 'active',
    tasksProcessed: 1247,
    successRate: 98.5,
    avgResponseTime: 1.2
  },
  workerAgents: {
    dataAnalysis: { status: 'active', tasksProcessed: 5642, successRate: 99.1 },
    diagnosis: { status: 'active', tasksProcessed: 3421, successRate: 97.8 },
    customerEngagement: { status: 'active', tasksProcessed: 2156, successRate: 94.2 },
    scheduling: { status: 'active', tasksProcessed: 1893, successRate: 96.5 },
    feedback: { status: 'active', tasksProcessed: 1124, successRate: 98.9 },
    manufacturing: { status: 'active', tasksProcessed: 456, successRate: 100 }
  }
};

export const demandForecast = [
  { month: 'Jan', predicted: 245, actual: 238 },
  { month: 'Feb', predicted: 268, actual: 272 },
  { month: 'Mar', predicted: 312, actual: 305 },
  { month: 'Apr', predicted: 289, actual: 291 },
  { month: 'May', predicted: 356, actual: 348 },
  { month: 'Jun', predicted: 398, actual: 412 },
  { month: 'Jul', predicted: 421, actual: null },
  { month: 'Aug', predicted: 445, actual: null },
  { month: 'Sep', predicted: 389, actual: null },
  { month: 'Oct', predicted: 367, actual: null },
  { month: 'Nov', predicted: 334, actual: null },
  { month: 'Dec', predicted: 412, actual: null }
];

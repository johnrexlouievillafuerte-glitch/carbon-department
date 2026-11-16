import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Printer, 
  X, 
  Car, 
  Camera, 
  Activity, 
  Plus, 
  Phone, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { VEHICLE_RECORDS, SAMPLE_PRESENTATION_RECORDS, type VehicleRecord } from '../data/documents';

interface AdminDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  initialSearchPlate?: string;
}

export const AdminDocumentsModal: React.FC<AdminDocumentsModalProps> = ({ 
  isOpen, 
  onClose,
  userRole = 'Workshop Administrator',
  initialSearchPlate = ''
}) => {
  const [records, setRecords] = useState<VehicleRecord[]>(VEHICLE_RECORDS);
  const [searchTerm, setSearchTerm] = useState(initialSearchPlate);

  React.useEffect(() => {
    if (initialSearchPlate) {
      setSearchTerm(initialSearchPlate);
    }
  }, [initialSearchPlate]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(VEHICLE_RECORDS[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<'overview' | 'jobOrder' | 'photos' | 'timeline'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Record State
  const [newPlate, setNewPlate] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newVehicle, setNewVehicle] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newCategory, setNewCategory] = useState<'Mechanical' | 'Electrical' | 'Body Repair' | 'Carbon Fiber' | 'Detailing'>('Mechanical');
  const [newConcern, setNewConcern] = useState('');
  const [newPreInspectionDamage, setNewPreInspectionDamage] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Mechanical', 'Electrical', 'Body Repair', 'Carbon Fiber', 'Detailing'];

  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term ||
      rec.plateNumber.toLowerCase().replace(/\s+/g, '').includes(term.replace(/\s+/g, '')) ||
      rec.customerName.toLowerCase().includes(term) ||
      rec.vehicleMakeModel.toLowerCase().includes(term) ||
      rec.jobOrderNo.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'All' || rec.serviceCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeRecord = records.find((r) => r.id === selectedRecordId) || filteredRecords[0] || records[0];

  const handlePrint = () => {
    window.print();
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newCustomer || !newVehicle) return;

    const newRec: VehicleRecord = {
      id: `rec-${Date.now()}`,
      plateNumber: newPlate.toUpperCase().trim(),
      customerName: newCustomer.trim(),
      contactNumber: newPhone || '0917-000-0000',
      address: 'Cainta, Rizal',
      vehicleMakeModel: newVehicle.trim(),
      vehicleYear: '2024',
      vehicleColor: newColor || 'Standard',
      vin: `VIN-${Date.now().toString().slice(-8)}`,
      chassisNumber: `CH-${Date.now().toString().slice(-6)}`,
      dateReceived: new Date().toISOString().split('T')[0],
      serviceCategory: newCategory,
      specificConcern: newConcern || 'Initial check-in and inspection.',
      jobOrderNo: `JO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Intake & Pre-Inspection',
      progressPercent: 20,
      mechanicAssigned: 'Lead Mechanical Technician',
      adminInCharge: 'Service Advisor',
      preInspectionNotes: newPreInspectionDamage || 'No pre-existing exterior damage recorded at intake.',
      preInspectionPhotos: [
        {
          url: '',
          caption: 'Intake catalog record',
          damageType: 'Intake Documentation',
        },
      ],
      amount: 5000,
      isPaid: false,
      notes: 'Logged in CARBONTrack.',
      tasks: [
        { task: 'Intake & pre-inspection damage scan', status: 'Completed' },
        { task: 'Diagnostic assessment', status: 'In Progress' },
        { task: 'Service execution', status: 'Pending' },
        { task: 'Quality check and release', status: 'Pending' },
      ],
    };

    setRecords([newRec, ...records]);
    setSelectedRecordId(newRec.id);
    setShowAddModal(false);

    setNewPlate('');
    setNewCustomer('');
    setNewPhone('');
    setNewVehicle('');
    setNewColor('');
    setNewConcern('');
    setNewPreInspectionDamage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-2xl bg-[#090A0E] border border-white/10 shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Minimal Header */}
        <div className="px-5 py-3.5 bg-[#0E1017] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F0FF]">
              <Car size={16} />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                CARBON<span className="text-[#00F0FF]">Track</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                {userRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {records.length > 0 ? (
              <button
                onClick={() => {
                  setRecords([]);
                  setSelectedRecordId('');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/10 text-slate-400 text-xs transition-colors cursor-pointer"
                title="Clear all records back to brand new empty state"
              >
                Clear (Brand New)
              </button>
            ) : (
              <button
                onClick={() => {
                  setRecords(SAMPLE_PRESENTATION_RECORDS);
                  setSelectedRecordId(SAMPLE_PRESENTATION_RECORDS[0].id);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                title="Load benchmark demonstration records for presentation"
              >
                <span>Load Demo Records</span>
              </button>
            )}

            <button
              onClick={() => {
                if (searchTerm) setNewPlate(searchTerm.toUpperCase());
                setShowAddModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#00F0FF] hover:bg-[#33F5FF] text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-cyan-500/20"
            >
              <Plus size={14} />
              <span>New Entry</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dashboard Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Minimal Vehicle List */}
          <div className="lg:col-span-5 border-r border-white/10 bg-[#0B0C12] flex flex-col h-full overflow-hidden">
            
            {/* Minimal Search & Filters */}
            <div className="p-3 border-b border-white/10 bg-[#0E1017]/50 space-y-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search plate or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Minimal Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#00F0FF] text-black font-semibold'
                        : 'bg-[#12131A] text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Records List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
              {filteredRecords.length === 0 ? (
                records.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#00F0FF]">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        CARBONTrack Initialized
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Brand new database. Ready for customer vehicle check-in.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-2 max-w-[200px] mx-auto">
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-cyan py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        + First Job Order
                      </button>
                      <button
                        onClick={() => {
                          setRecords(SAMPLE_PRESENTATION_RECORDS);
                          setSelectedRecordId(SAMPLE_PRESENTATION_RECORDS[0].id);
                        }}
                        className="text-[11px] text-cyan-300 hover:underline pt-1 cursor-pointer"
                      >
                        Load demo records
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 px-4 text-center space-y-2.5">
                    <p className="text-xs text-slate-400">
                      No records match "{searchTerm}"
                    </p>
                    <button
                      onClick={() => {
                        setNewPlate(searchTerm.toUpperCase().trim());
                        setShowAddModal(true);
                      }}
                      className="btn-cyan px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Create JO for {searchTerm.toUpperCase()}</span>
                    </button>
                  </div>
                )
              ) : (
                filteredRecords.map((rec) => {
                  const isSelected = activeRecord?.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#141724] border-cyan-400/80 shadow-md shadow-cyan-500/10'
                          : 'bg-[#0E1017] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="plate-font text-xs text-[#00F0FF] px-1.5 py-0.5 rounded bg-black/60 border border-cyan-500/30">
                          {rec.plateNumber}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          rec.status === 'Released'
                            ? 'bg-slate-800 text-slate-400'
                            : rec.status === 'Ready for Release'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : rec.status === 'In Progress'
                            ? 'bg-cyan-500/15 text-cyan-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}>
                          {rec.status}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-white truncate">
                        {rec.vehicleMakeModel}
                      </div>

                      <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                        <span>{rec.customerName}</span>
                        <span className="text-slate-500">{rec.serviceCategory}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-3 py-2 bg-[#0E1017] border-t border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{filteredRecords.length} vehicles</span>
              <span className="text-[#00F0FF] text-[10px] uppercase font-semibold">Active Session</span>
            </div>

          </div>

          {/* Right Column: Console & Inspection */}
          <div className="lg:col-span-7 bg-[#07080B] flex flex-col h-full overflow-hidden">
            {activeRecord ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Minimal Tab Bar */}
                <div className="px-4 py-2.5 bg-[#0E1017] border-b border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeTab === 'overview'
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('jobOrder')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'jobOrder'
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileText size={13} />
                      <span>Job Order</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('photos')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'photos'
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Camera size={13} />
                      <span>Inspection ({activeRecord.preInspectionPhotos.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'timeline'
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Activity size={13} />
                      <span>Progress</span>
                    </button>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                </div>

                {/* Tab Content View */}
                <div id="print-area" className="flex-1 overflow-y-auto p-4 sm:p-5">
                  
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="max-w-2xl mx-auto space-y-4">
                      
                      {/* 4 Metric Tiles */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="p-3 rounded-xl bg-[#0E1017] border border-white/5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Plate</span>
                          <span className="plate-font text-sm text-[#00F0FF] font-bold mt-0.5 block">{activeRecord.plateNumber}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0E1017] border border-white/5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Job Order</span>
                          <span className="mono-spec text-xs text-white font-medium mt-0.5 block">{activeRecord.jobOrderNo}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0E1017] border border-white/5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Service</span>
                          <span className="text-xs text-white font-medium mt-0.5 block truncate">{activeRecord.serviceCategory}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0E1017] border border-white/5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Estimate</span>
                          <span className="text-xs text-white font-medium mt-0.5 block">
                            {activeRecord.amount ? `₱${activeRecord.amount.toLocaleString()}` : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Client & Vehicle Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-[#0E1017] border border-white/5 space-y-2">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client Info</div>
                          <div className="text-sm font-semibold text-white">{activeRecord.customerName}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Phone size={12} className="text-cyan-400" />
                            <span>{activeRecord.contactNumber}</span>
                          </div>
                          <div className="text-xs text-slate-500">{activeRecord.address}</div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0E1017] border border-white/5 space-y-2">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vehicle Specs</div>
                          <div className="text-sm font-semibold text-white">{activeRecord.vehicleMakeModel}</div>
                          <div className="text-xs text-slate-400">Color: {activeRecord.vehicleColor} ({activeRecord.vehicleYear})</div>
                          <div className="mono-spec text-[11px] text-slate-500 truncate">VIN: {activeRecord.vin}</div>
                          <div className="mono-spec text-[11px] text-slate-500 truncate">Chassis: {activeRecord.chassisNumber}</div>
                        </div>
                      </div>

                      {/* Concern & Diagnostics */}
                      <div className="p-4 rounded-xl bg-[#0E1017] border border-white/5 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Reported Issue</div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-[#07080B] p-3 rounded-lg border border-white/5">
                          {activeRecord.specificConcern}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          <span>Assigned: <strong className="text-white">{activeRecord.mechanicAssigned}</strong></span>
                          <span>Received: {activeRecord.dateReceived}</span>
                        </div>
                      </div>

                      {/* Compact Pre-inspection Flag */}
                      {activeRecord.preInspectionNotes && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-semibold text-amber-300">Intake Condition: </span>
                            <span>{activeRecord.preInspectionNotes}</span>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 2: DIGITAL JOB ORDER (Print-Friendly) */}
                  {activeTab === 'jobOrder' && (
                    <div className="max-w-2xl mx-auto bg-[#0E1017] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5 text-slate-200 print:bg-white print:text-black">
                      
                      {/* Job Order Header */}
                      <div className="flex items-start justify-between pb-4 border-b border-white/10">
                        <div>
                          <div className="text-base font-extrabold text-white tracking-tight">
                            CARBON DEPARTMENT AUTO-BODY
                          </div>
                          <div className="text-xs text-slate-400">
                            009 Felix Ave, Vista Verde, Cainta Rizal • Landline: (02) 8655-0842
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="mono-spec text-sm font-bold text-[#00F0FF]">{activeRecord.jobOrderNo}</div>
                          <div className="text-xs text-slate-400">{activeRecord.dateReceived}</div>
                        </div>
                      </div>

                      {/* Compact Client & Car Summary */}
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#07080B] border border-white/5 text-xs">
                        <div>
                          <div className="text-slate-500 text-[10px] uppercase">Client</div>
                          <div className="text-white font-medium">{activeRecord.customerName}</div>
                          <div className="text-slate-400">{activeRecord.contactNumber}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px] uppercase">Vehicle</div>
                          <div className="text-white font-medium">{activeRecord.vehicleMakeModel}</div>
                          <div className="plate-font text-cyan-300 text-[11px]">{activeRecord.plateNumber}</div>
                        </div>
                      </div>

                      {/* Scope of Work */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Scope of Work
                        </div>
                        <div className="space-y-1.5 text-xs">
                          {activeRecord.tasks.map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#07080B] border border-white/5">
                              <span className="text-slate-300">{idx + 1}. {t.task}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded ${
                                t.status === 'Completed'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : t.status === 'In Progress'
                                  ? 'bg-cyan-500/15 text-cyan-300'
                                  : 'bg-white/5 text-slate-500'
                              }`}>
                                {t.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Intake Damage Notes */}
                      <div className="p-3 rounded-lg bg-[#07080B] border border-white/5 text-xs">
                        <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Pre-Inspection Recorded Damage</span>
                        <p className="text-slate-300">{activeRecord.preInspectionNotes}</p>
                      </div>

                      {/* Sign-off Row */}
                      <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center text-xs">
                        <div>
                          <div className="h-7 border-b border-white/20 flex items-end justify-center text-[11px] text-cyan-300">
                            {activeRecord.mechanicAssigned.split(' ')[0]}
                          </div>
                          <span className="text-slate-500 text-[10px] block mt-1">Lead Mechanic</span>
                        </div>
                        <div>
                          <div className="h-7 border-b border-white/20 flex items-end justify-center text-[11px] text-cyan-300">
                            {activeRecord.adminInCharge.split(' ')[0]}
                          </div>
                          <span className="text-slate-500 text-[10px] block mt-1">Admin Sign-Off</span>
                        </div>
                        <div>
                          <div className="h-7 border-b border-white/20 flex items-end justify-center text-[11px] text-cyan-300">
                            Approved
                          </div>
                          <span className="text-slate-500 text-[10px] block mt-1">Owner Approval</span>
                        </div>
                      </div>

                      {/* Settlement */}
                      {activeRecord.amount && (
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-slate-400">Total Settlement:</span>
                          <span className="text-base font-bold text-[#00F0FF]">
                            ₱{activeRecord.amount.toLocaleString()}
                          </span>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 3: PRE-INSPECTION DAMAGE AUDIT */}
                  {activeTab === 'photos' && (
                    <div className="max-w-2xl mx-auto space-y-3">
                      <div className="p-3.5 rounded-xl bg-[#0E1017] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={15} className="text-amber-400" />
                          <span className="text-xs font-semibold text-white uppercase tracking-wider">
                            Intake Condition &amp; Damage Audit
                          </span>
                        </div>
                        <span className="plate-font text-xs text-[#00F0FF]">
                          {activeRecord.plateNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeRecord.preInspectionPhotos.map((photo, i) => (
                          <div key={i} className="p-4 rounded-xl bg-[#0E1017] border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                {photo.damageType}
                              </span>
                              <span className="text-[10px] mono-spec text-slate-500">
                                ENTRY #{i + 1}
                              </span>
                            </div>
                            <div className="text-xs text-white font-medium">
                              {photo.caption}
                            </div>
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                              <span>Cataloged on JO</span>
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={11} /> Verified
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                        <span className="font-semibold text-amber-300 block">Pre-Inspection Remarks on Record:</span>
                        <p className="text-slate-300 leading-relaxed">{activeRecord.preInspectionNotes}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0E1017] border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Inspector: <strong className="text-white">{activeRecord.adminInCharge}</strong></span>
                        <span>Date: <strong className="text-white">{activeRecord.dateReceived}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PROGRESS */}
                  {activeTab === 'timeline' && (
                    <div className="max-w-2xl mx-auto space-y-4">
                      
                      {/* Stage Card */}
                      <div className="p-4 rounded-xl bg-[#0E1017] border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase">Phase</span>
                            <div className="text-base font-bold text-white">{activeRecord.status}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-extrabold text-[#00F0FF]">{activeRecord.progressPercent}%</span>
                          </div>
                        </div>

                        {/* Progress Line */}
                        <div className="w-full bg-[#07080B] h-2 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-[#00F0FF] h-full rounded-full transition-all duration-500"
                            style={{ width: `${activeRecord.progressPercent}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                          {['Intake', 'Diagnosis', 'Repair', 'QC', 'Release'].map((stg, i) => (
                            <div 
                              key={i} 
                              className={`py-1 rounded ${
                                activeRecord.progressPercent >= (i + 1) * 20
                                  ? 'bg-cyan-500/15 text-[#00F0FF] font-medium'
                                  : 'text-slate-600 bg-[#07080B]'
                              }`}
                            >
                              {stg}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Milestones List */}
                      <div className="p-4 rounded-xl bg-[#0E1017] border border-white/5 space-y-2">
                        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Milestones
                        </div>
                        {activeRecord.tasks.map((task, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#07080B] border border-white/5 text-xs">
                            <div className="flex items-center gap-2">
                              {task.status === 'Completed' ? (
                                <CheckCircle2 size={14} className="text-emerald-400" />
                              ) : (
                                <Clock size={14} className="text-cyan-400" />
                              )}
                              <span className="text-slate-300">{task.task}</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : task.status === 'In Progress'
                                ? 'bg-cyan-500/15 text-cyan-300'
                                : 'bg-white/5 text-slate-500'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-[#00F0FF]">
                  <FileText size={26} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    CARBONTrack Database Initialized
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    Connected to 009 Felix Ave workshop bays. The system is brand new with zero pending liabilities or unresolved customer disputes.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (searchTerm) setNewPlate(searchTerm.toUpperCase());
                      setShowAddModal(true);
                    }}
                    className="btn-cyan px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Issue First Job Order</span>
                  </button>
                  <button
                    onClick={() => {
                      setRecords(SAMPLE_PRESENTATION_RECORDS);
                      setSelectedRecordId(SAMPLE_PRESENTATION_RECORDS[0].id);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-300 font-medium transition-colors cursor-pointer"
                  >
                    Load Presentation Demo
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Minimal Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0E1017] border border-white/10 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus size={15} className="text-[#00F0FF]" />
                <span>New Vehicle Entry</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Plate Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NDB 4821"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400 font-bold uppercase plate-font"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Reyes"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Make &amp; Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota LC200"
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0917-..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Pearl White"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Service Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400"
                  >
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Body Repair">Body Repair</option>
                    <option value="Carbon Fiber">Carbon Fiber</option>
                    <option value="Detailing">Detailing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Customer Stated Issue</label>
                <textarea
                  rows={2}
                  placeholder="Primary complaint or requested service..."
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                  className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Pre-Inspection Damage (if any)</label>
                <input
                  type="text"
                  placeholder="e.g. Minor curb scratch on left fender"
                  value={newPreInspectionDamage}
                  onChange={(e) => setNewPreInspectionDamage(e.target.value)}
                  className="w-full bg-[#07080B] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] hover:bg-[#33F5FF] text-black text-xs font-bold transition-all cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

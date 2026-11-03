import React, { useState, useMemo } from 'react';
import {
  Database,
  MapPin,
  Tag,
  Building2,
  Plus,
  Search,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Hash,
  Phone,
  Mail,
  ShieldCheck,
  RotateCcw,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Check,
  Layers,
  ArrowRight,
  FileText,
  X,
} from 'lucide-react';
import { useKua } from '../context/KuaContext';
import { KelurahanItem, CustomKodeSurat } from '../types';

interface MasterDataViewProps {
  onOpenGoogleSheets?: () => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({ onOpenGoogleSheets }) => {
  const {
    kuaSettings,
    updateKuaSettings,
    addKelurahan,
    updateKelurahan,
    deleteKelurahan,
    addCustomKodeSurat,
    deleteCustomKodeSurat,
    activeStaff,
    nikahList,
    suratList,
    arsipList,
    resetTransactionData,
    resetToBlankKua,
    resetToDefaultData,
  } = useKua();

  const [activeTab, setActiveTab] = useState<'kelurahan' | 'kodeSurat' | 'profilKua' | 'googleSheets' | 'databaseReset'>('kelurahan');
  const [resetModalType, setResetModalType] = useState<'transaksi' | 'total' | 'demo' | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Kelurahan Search & Modal States
  const [searchKelurahan, setSearchKelurahan] = useState('');
  const [isKelurahanModalOpen, setIsKelurahanModalOpen] = useState(false);
  const [editingKelurahan, setEditingKelurahan] = useState<KelurahanItem | null>(null);
  const [kelurahanForm, setKelurahanForm] = useState({
    nama: '',
    kodePos: '',
    namaLurah: '',
    kontakLurah: '',
    alamatKantor: '',
  });

  // Custom Kode Surat States
  const [newKode, setNewKode] = useState('');
  const [newNamaKode, setNewNamaKode] = useState('');
  const [newKategoriKode, setNewKategoriKode] = useState('Kepenghuluan');
  const [searchKode, setSearchKode] = useState('');

  // Profil Form
  const [profilForm, setProfilForm] = useState({ ...kuaSettings });

  // Filtered Kelurahan List
  const filteredKelurahan = useMemo(() => {
    return (kuaSettings.daftarKelurahan || []).filter(
      (k) =>
        k.nama.toLowerCase().includes(searchKelurahan.toLowerCase()) ||
        (k.kodePos && k.kodePos.includes(searchKelurahan)) ||
        (k.namaLurah && k.namaLurah.toLowerCase().includes(searchKelurahan.toLowerCase()))
    );
  }, [kuaSettings.daftarKelurahan, searchKelurahan]);

  // Filtered Kode Surat List
  const filteredKodeSurat = useMemo(() => {
    return (kuaSettings.kodeSuratCustomList || []).filter(
      (k) =>
        k.kode.toLowerCase().includes(searchKode.toLowerCase()) ||
        k.nama.toLowerCase().includes(searchKode.toLowerCase()) ||
        k.kategori.toLowerCase().includes(searchKode.toLowerCase())
    );
  }, [kuaSettings.kodeSuratCustomList, searchKode]);

  // Kelurahan Form Handlers
  const handleOpenAddKelurahan = () => {
    setEditingKelurahan(null);
    setKelurahanForm({
      nama: '',
      kodePos: '15310',
      namaLurah: '',
      kontakLurah: '0812-',
      alamatKantor: '',
    });
    setIsKelurahanModalOpen(true);
  };

  const handleOpenEditKelurahan = (item: KelurahanItem) => {
    setEditingKelurahan(item);
    setKelurahanForm({
      nama: item.nama,
      kodePos: item.kodePos || '',
      namaLurah: item.namaLurah || '',
      kontakLurah: item.kontakLurah || '',
      alamatKantor: item.alamatKantor || '',
    });
    setIsKelurahanModalOpen(true);
  };

  const handleSubmitKelurahan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelurahanForm.nama.trim()) {
      alert('Nama kelurahan wajib diisi.');
      return;
    }

    if (editingKelurahan) {
      updateKelurahan(editingKelurahan.id, {
        nama: kelurahanForm.nama.trim(),
        kodePos: kelurahanForm.kodePos.trim(),
        namaLurah: kelurahanForm.namaLurah.trim(),
        kontakLurah: kelurahanForm.kontakLurah.trim(),
        alamatKantor: kelurahanForm.alamatKantor.trim(),
      });
    } else {
      addKelurahan({
        nama: kelurahanForm.nama.trim(),
        kodePos: kelurahanForm.kodePos.trim(),
        namaLurah: kelurahanForm.namaLurah.trim(),
        kontakLurah: kelurahanForm.kontakLurah.trim(),
        alamatKantor: kelurahanForm.alamatKantor.trim(),
      });
    }
    setIsKelurahanModalOpen(false);
  };

  const handleDeleteKelurahan = (item: KelurahanItem) => {
    if (confirm(`Yakin ingin menghapus data kelurahan "${item.nama}" dari Master Data KUA?`)) {
      deleteKelurahan(item.id);
    }
  };

  // Add Custom Kode Surat
  const handleAddKodeSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode.trim() || !newNamaKode.trim()) {
      alert('Harap isi kode surat dan nama klasifikasi.');
      return;
    }
    addCustomKodeSurat(newKode, newNamaKode, newKategoriKode);
    setNewKode('');
    setNewNamaKode('');
  };

  // Save Profil KUA
  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    updateKuaSettings(profilForm);
    alert('Pengaturan Master Data & Profil KUA berhasil diperbarui!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>Master Data Wilayah & Konfigurasi Administrasi</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Master Data Kantor Urusan Agama (KUA)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Pusat pengelolaan data referensi kelurahan/desa di wilayah kerja KUA {kuaSettings.kecamatan}, kode klasifikasi persuratan dinas, dan parameter penomoran otomatis.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('kelurahan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'kelurahan'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Data Kelurahan ({kuaSettings.daftarKelurahan?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kodeSurat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'kodeSurat'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Kode Surat Dinas ({kuaSettings.kodeSuratCustomList?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setProfilForm({ ...kuaSettings });
              setActiveTab('profilKua');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'profilKua'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Profil Satker KUA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('googleSheets')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'googleSheets'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Spreadsheet</span>
            {kuaSettings.googleSheetsConfig?.spreadsheetId && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('databaseReset')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'databaseReset'
                ? 'bg-white text-rose-800 shadow-xs border border-rose-200'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Reset &amp; Kelola Database</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DATA KELURAHAN / DESA */}
      {activeTab === 'kelurahan' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKelurahan}
                onChange={(e) => setSearchKelurahan(e.target.value)}
                placeholder="Cari kelurahan, kodepos, nama lurah..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddKelurahan}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Kelurahan Baru</span>
            </button>
          </div>

          {/* Kelurahan Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredKelurahan.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 font-bold shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          Kel. {item.nama}
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                          Kodepos: {item.kodePos || '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditKelurahan(item)}
                        className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors"
                        title="Edit Data Kelurahan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteKelurahan(item)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Hapus Kelurahan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1.5">
                    <p>
                      <span className="text-slate-400">Kepala Desa / Lurah:</span>{' '}
                      <strong className="text-slate-800 block truncate">{item.namaLurah || 'Belum diisi'}</strong>
                    </p>
                    <p>
                      <span className="text-slate-400">Kontak Kantor:</span>{' '}
                      <span className="font-mono text-slate-700">{item.kontakLurah || '-'}</span>
                    </p>
                    {item.alamatKantor && (
                      <p className="line-clamp-2 text-slate-500" title={item.alamatKantor}>
                        <span className="text-slate-400">Alamat:</span> {item.alamatKantor}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Kec. {kuaSettings.kecamatan}</span>
                  <span className="text-emerald-700 font-medium">Terdaftar di SIMKUA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KODE KLASIFIKASI SURAT DINAS */}
      {activeTab === 'kodeSurat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Tambah Kode Klasifikasi Surat Baru</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tambahkan kode surat baru untuk penomoran surat dinas otomatis
              </p>
            </div>

            <form onSubmit={handleAddKodeSurat} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  Kode Surat (Singkatan Resmi) *
                </label>
                <input
                  type="text"
                  required
                  value={newKode}
                  onChange={(e) => setNewKode(e.target.value.toUpperCase())}
                  placeholder="Contoh: PW.03 atau HM.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-emerald-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  Nama Klasifikasi Urusan *
                </label>
                <input
                  type="text"
                  required
                  value={newNamaKode}
                  onChange={(e) => setNewNamaKode(e.target.value)}
                  placeholder="Contoh: Rekomendasi Nikah Luar Negeri"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  Kategori Urusan Dinas
                </label>
                <select
                  value={newKategoriKode}
                  onChange={(e) => setNewKategoriKode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Kepenghuluan">Kepenghuluan</option>
                  <option value="Syariah">Syariah & Kemasjidan</option>
                  <option value="Zawa">Zakat & Wakaf</option>
                  <option value="Kepegawaian">Kepegawaian</option>
                  <option value="Keuangan">Keuangan / PNBP</option>
                  <option value="Humas">Humas & Umum</option>
                  <option value="Hukum">Hukum & Advokasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Kode Klasifikasi</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 block">Template Format Surat Keluar:</span>
              <code className="text-[10px] bg-slate-100 p-1.5 rounded block text-emerald-800 font-mono break-all">
                B-&#123;nomor&#125;/KUA.{kuaSettings.kodeKua}/[KODE]/[BULAN]/[TAHUN]
              </code>
            </div>
          </div>

          {/* List of Custom Codes */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKode}
                  onChange={(e) => setSearchKode(e.target.value)}
                  placeholder="Cari kode atau nama..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Total: <strong>{filteredKodeSurat.length}</strong> Kode Aktif
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredKodeSurat.map((k) => (
                <div key={k.kode} className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      {k.kode}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{k.nama}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Kategori: {k.kategori}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteCustomKodeSurat(k.kode)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Hapus Kode Klasifikasi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROFIL SATKER KUA */}
      {activeTab === 'profilKua' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-3xl">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
            Identitas Resmi Satuan Kerja Kantor Urusan Agama
          </h3>

          <form onSubmit={handleSaveProfil} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Nama Resmi Lembaga *</label>
              <input
                type="text"
                required
                value={profilForm.namaKua}
                onChange={(e) => setProfilForm({ ...profilForm, namaKua: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Kecamatan *</label>
                <input
                  type="text"
                  required
                  value={profilForm.kecamatan}
                  onChange={(e) => setProfilForm({ ...profilForm, kecamatan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Kabupaten / Kota *</label>
                <input
                  type="text"
                  required
                  value={profilForm.kabupatenKota}
                  onChange={(e) => setProfilForm({ ...profilForm, kabupatenKota: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Provinsi *</label>
                <input
                  type="text"
                  required
                  value={profilForm.provinsi}
                  onChange={(e) => setProfilForm({ ...profilForm, provinsi: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Kode KUA Kemenag *</label>
                <input
                  type="text"
                  required
                  value={profilForm.kodeKua}
                  onChange={(e) => setProfilForm({ ...profilForm, kodeKua: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Alamat Kantor Lengkap</label>
              <textarea
                rows={2}
                value={profilForm.alamatLengkap}
                onChange={(e) => setProfilForm({ ...profilForm, alamatLengkap: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Nomor Telepon Dinas</label>
                <input
                  type="text"
                  value={profilForm.telepon}
                  onChange={(e) => setProfilForm({ ...profilForm, telepon: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Email Dinas Kemenag</label>
                <input
                  type="email"
                  value={profilForm.email}
                  onChange={(e) => setProfilForm({ ...profilForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Legalitas Kepala KUA */}
            <div className="pt-3 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">Penandatangan Laporan & Pengesahan:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Nama Kepala KUA *</label>
                  <input
                    type="text"
                    required
                    value={profilForm.kepalaKuaNama}
                    onChange={(e) => setProfilForm({ ...profilForm, kepalaKuaNama: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">NIP Kepala KUA *</label>
                  <input
                    type="text"
                    required
                    value={profilForm.kepalaKuaNip}
                    onChange={(e) => setProfilForm({ ...profilForm, kepalaKuaNip: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Counters */}
            <div className="pt-3 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">Urutan Nomor Berlanjut Terakhir:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Nomor Urut Surat Keluar</label>
                  <input
                    type="number"
                    min="1"
                    value={profilForm.counterSuratKeluar || 40}
                    onChange={(e) => setProfilForm({ ...profilForm, counterSuratKeluar: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Nomor Urut Agenda Masuk</label>
                  <input
                    type="number"
                    min="1"
                    value={profilForm.counterAgendaMasuk || 85}
                    onChange={(e) => setProfilForm({ ...profilForm, counterAgendaMasuk: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-blue-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Profil Master Data</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: INTEGRASI GOOGLE SPREADSHEET */}
      {activeTab === 'googleSheets' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pencadangan &amp; Sinkronisasi Data Hibrida</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Integrasi Google Spreadsheet KUA {kuaSettings.kecamatan}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Menghubungkan basis data register nikah, surat dinas, dan data kelurahan langsung ke Google Spreadsheet di Google Drive kantor Anda secara otomatis.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenGoogleSheets}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>
                {kuaSettings.googleSheetsConfig?.spreadsheetId
                  ? 'Pengaturan & Sinkronisasi'
                  : 'Hubungkan Google Sheets'}
              </span>
            </button>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Pendaftaran Nikah Siap Sync
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {nikahList.length}
                </span>
                <span className="text-xs text-slate-500">Berkas Register</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Agenda Surat Siap Sync
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {suratList.length}
                </span>
                <span className="text-xs text-slate-500">Surat Masuk &amp; Keluar</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Master Kelurahan
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {kuaSettings.daftarKelurahan?.length || 0}
                </span>
                <span className="text-xs text-slate-500">Wilayah Kerja</span>
              </div>
            </div>
          </div>

          {/* Detail Spreadsheet Card */}
          {kuaSettings.googleSheetsConfig?.spreadsheetId ? (
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {kuaSettings.googleSheetsConfig.spreadsheetTitle}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Akun: {kuaSettings.googleSheetsConfig.userEmail || 'Terhubung'} · ID:{' '}
                      {kuaSettings.googleSheetsConfig.spreadsheetId}
                    </p>
                  </div>
                </div>

                <a
                  href={kuaSettings.googleSheetsConfig.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Google Drive</span>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        kuaSettings.googleSheetsConfig.autoSyncEnabled
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-slate-300'
                      }`}
                    />
                    <span>
                      Auto-Sync:{' '}
                      <strong className="text-slate-800">
                        {kuaSettings.googleSheetsConfig.autoSyncEnabled ? 'Aktif' : 'Non-aktif'}
                      </strong>
                    </span>
                  </span>
                  <span>·</span>
                  <span>
                    Terakhir disinkronkan:{' '}
                    <strong className="text-slate-800">
                      {kuaSettings.googleSheetsConfig.lastSyncedAt || 'Belum ada'}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenGoogleSheets}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Buka Panel Sinkronisasi &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Google Spreadsheet Belum Terhubung
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Hubungkan akun Google kantor Anda untuk mengaktifkan pencadangan otomatis data nikah dan surat dinas ke Google Sheets.
              </p>
              <button
                type="button"
                onClick={onOpenGoogleSheets}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mulai Hubungkan Google Sheets</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RESET & KELOLA DATABASE */}
      {activeTab === 'databaseReset' && (
        <div className="space-y-6">
          {/* Success Banner */}
          {resetSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-950">Berhasil Dijalankan</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">{resetSuccessMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetSuccessMessage(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}

          {/* Workflow Guide: Memulai Kantor KUA Baru */}
          <div className="p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl text-white shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  Alur Rekomendasi: Memulai Sistem untuk Kantor KUA Baru
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ikuti 4 langkah terstruktur berikut agar sistem siap digunakan secara resmi oleh pegawai Anda:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
                    Langkah Awal
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Kosongkan Data Simulasi</h4>
                <p className="text-[11px] text-slate-300">
                  Bersihkan data contoh pendaftaran nikah &amp; surat bawaan demo agar angka counter kembali ke 0.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setProfilForm({ ...kuaSettings });
                      setActiveTab('profilKua');
                    }}
                    className="text-[10px] font-bold text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    Buka Form &rarr;
                  </button>
                </div>
                <h4 className="text-xs font-bold text-white">Lengkapi Profil Satker</h4>
                <p className="text-[11px] text-slate-300">
                  Isi nama kantor KUA, kecamatan, alamat lengkap, kontak telepon, dan kode satker Kemenag.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kelurahan')}
                    className="text-[10px] font-bold text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    Buka Data &rarr;
                  </button>
                </div>
                <h4 className="text-xs font-bold text-white">Input Master Kelurahan</h4>
                <p className="text-[11px] text-slate-300">
                  Masukkan daftar desa/kelurahan di wilayah kerja kecamatan Anda beserta kode pos &amp; nama Lurah.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
                    Siap Pakai
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Mulai Layanan Resmi</h4>
                <p className="text-[11px] text-slate-300">
                  Input pendaftaran nikah baru, register surat dinas otomatis, dan sinkronkan ke Google Spreadsheet.
                </p>
              </div>
            </div>
          </div>

          {/* Current Database Summary Metrics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              Ringkasan Data yang Tersimpan Saat Ini di Sistem:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Register Nikah</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{nikahList.length} berkas</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Agenda Surat Dinas</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{suratList.length} surat</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Master Kelurahan</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{kuaSettings.daftarKelurahan?.length || 0} kelurahan</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Satker Aktif</span>
                <span className="text-xs font-bold text-emerald-800 truncate block mt-1" title={kuaSettings.namaKua}>
                  KUA {kuaSettings.kecamatan || '(Belum diset)'}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Reset Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* OPSI 1: KOSONGKAN DATA TRANSAKSI SAJA */}
            <div className="p-5 bg-white border-2 border-emerald-500/60 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Paling Direkomendasikan
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    1. Kosongkan Data Transaksi Saja
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Menghapus seluruh berkas simulasi Register Nikah, Agenda Surat Dinas, dan Arsip Digital.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Data Master &amp; Profil Kantor Tetap Aman:</span>
                  </div>
                  <p className="text-slate-600 pl-5 text-[10px]">
                    Profil KUA, daftar kelurahan, dan akun pegawai tidak akan dihapus. Siap langsung pakai untuk pendaftaran resmi pertama.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResetModalType('transaksi')}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Kosongkan Data Transaksi
              </button>
            </div>

            {/* OPSI 2: RESET TOTAL KUA BARU */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Mulai dari Nol
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    2. Reset Bersih Total &amp; Setup Baru
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Mengosongkan semua transaksi dan mereset profil kantor KUA dan kelurahan ke form kosong siap isi.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <span className="font-bold block text-slate-800">Setelah Reset:</span>
                  <p className="text-slate-500 text-[10px]">
                    Sistem langsung membuka tab <strong>Profil Satker KUA</strong> agar Anda mengisi nama kantor, kecamatan, kode KUA, dan alamat Anda.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResetModalType('total')}
                className="w-full py-2.5 px-4 text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              >
                Reset Bersih Total
              </button>
            </div>

            {/* OPSI 3: PULIHKAN DATA DEMO CANDISARI */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Data Simulasi
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    3. Pulihkan Data Demo Candisari
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Mengembalikan data contoh simulasi lengkap KUA Candisari (pendaftaran nikah, surat, kelurahan, staf) untuk pelatihan.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <span className="font-bold block text-slate-800">Cocok Untuk:</span>
                  <p className="text-slate-500 text-[10px]">
                    Simulasi pengujian fitur, demo kepada pimpinan Kemenag, atau pelatihan petugas tata usaha.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResetModalType('demo')}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Pulihkan Data Simulasi Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL UNTUK RESET */}
      {resetModalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                    resetModalType === 'demo' ? 'bg-blue-600' : 'bg-rose-600'
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {resetModalType === 'transaksi' && 'Konfirmasi Kosongkan Data Transaksi'}
                    {resetModalType === 'total' && 'Konfirmasi Reset Total Basis Data'}
                    {resetModalType === 'demo' && 'Konfirmasi Pulihkan Data Demo'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tindakan ini akan memperbarui penyimpanan data di browser Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetModalType(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              {resetModalType === 'transaksi' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Anda akan mengosongkan seluruh data transaksi simulasi:
                  </p>
                  <ul className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium text-[11px]">
                    <li className="flex items-center gap-2 text-rose-700">
                      <span>&bull;</span>
                      <span>{nikahList.length} data Register Nikah akan dihapus</span>
                    </li>
                    <li className="flex items-center gap-2 text-rose-700">
                      <span>&bull;</span>
                      <span>{suratList.length} berkas Agenda Surat Dinas akan dihapus</span>
                    </li>
                    <li className="flex items-center gap-2 text-rose-700">
                      <span>&bull;</span>
                      <span>{arsipList.length} Arsip Digital akan dihapus</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-700 font-bold pt-1 border-t border-slate-200">
                      <Check className="w-3.5 h-3.5" />
                      <span>Data Kantor ({kuaSettings.kecamatan}) &amp; Kelurahan ({kuaSettings.daftarKelurahan?.length || 0}) tetap dipertahankan.</span>
                    </li>
                  </ul>
                  <p className="text-[11px] text-slate-500">
                    Setelah ini, Anda dapat langsung mengedit Profil KUA dan mulai mendaftarkan data nikah serta surat dinas yang asli.
                  </p>
                </div>
              )}

              {resetModalType === 'total' && (
                <div className="space-y-3">
                  <p className="leading-relaxed text-rose-900 font-medium">
                    PERINGATAN: Semua data transaksi, profil kantor, dan data kelurahan akan dikosongkan.
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Sistem akan membuka form pengisian <strong>Profil Satker KUA</strong> sehingga Anda harus mengisi nama kantor, kecamatan, kode satker, dan alamat kantor KUA Anda dari awal.
                  </p>
                </div>
              )}

              {resetModalType === 'demo' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Sistem akan memulihkan data demo awal resmi KUA Kecamatan Candisari Kota Semarang lengkap dengan pendaftaran nikah dan surat dinas contoh.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setResetModalType(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (resetModalType === 'transaksi') {
                    resetTransactionData();
                    setResetSuccessMessage('Data transaksi berhasil dikosongkan! Database sekarang bersih (0 berkas) dan siap untuk mencatat kegiatan resmi KUA Anda.');
                  } else if (resetModalType === 'total') {
                    resetToBlankKua();
                    setProfilForm({
                      namaKua: '',
                      kecamatan: '',
                      kabupatenKota: '',
                      provinsi: 'Provinsi Jawa Tengah',
                      kodeKua: '',
                      alamatLengkap: '',
                      telepon: '',
                      email: '',
                      kepalaKuaNama: '',
                      kepalaKuaNip: '',
                      formatNomorSuratKeluar: 'B-{nomor}/KUA.{kodeKua}/{kodeKlasifikasi}/{bulanRomawi}/{tahun}',
                      formatAgendaMasuk: 'AG-SM/{tahun}/{bulan}/{nomor}',
                      formatAgendaKeluar: 'AG-SK/{tahun}/{bulan}/{nomor}',
                      counterSuratKeluar: 0,
                      counterAgendaMasuk: 0,
                      counterAgendaKeluar: 0,
                      daftarKelurahan: [],
                      kodeSuratCustomList: kuaSettings.kodeSuratCustomList,
                    });
                    setActiveTab('profilKua');
                    setResetSuccessMessage('Database berhasil direset bersih total. Silakan isi form Profil Satker KUA Anda di bawah ini!');
                  } else if (resetModalType === 'demo') {
                    resetToDefaultData();
                    setResetSuccessMessage('Data simulasi demo KUA Candisari berhasil dipulihkan.');
                  }
                  setResetModalType(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                  resetModalType === 'demo'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {resetModalType === 'transaksi' && 'Ya, Kosongkan Transaksi'}
                  {resetModalType === 'total' && 'Ya, Reset Bersih Total'}
                  {resetModalType === 'demo' && 'Ya, Pulihkan Data Demo'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tambah / Edit Kelurahan */}
      {isKelurahanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingKelurahan ? 'Edit Data Kelurahan' : 'Tambah Kelurahan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsKelurahanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitKelurahan}>
              <div className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Nama Kelurahan / Desa *</label>
                  <input
                    type="text"
                    required
                    value={kelurahanForm.nama}
                    onChange={(e) => setKelurahanForm({ ...kelurahanForm, nama: e.target.value })}
                    placeholder="Contoh: Cilenggang, Serpong, dll."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Kode Pos</label>
                    <input
                      type="text"
                      value={kelurahanForm.kodePos}
                      onChange={(e) => setKelurahanForm({ ...kelurahanForm, kodePos: e.target.value })}
                      placeholder="15310"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Kontak Kantor / WA</label>
                    <input
                      type="text"
                      value={kelurahanForm.kontakLurah}
                      onChange={(e) => setKelurahanForm({ ...kelurahanForm, kontakLurah: e.target.value })}
                      placeholder="0812-..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Nama Lurah / Kepala Desa</label>
                  <input
                    type="text"
                    value={kelurahanForm.namaLurah}
                    onChange={(e) => setKelurahanForm({ ...kelurahanForm, namaLurah: e.target.value })}
                    placeholder="Nama pejabat kelurahan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Alamat Kantor Kelurahan</label>
                  <input
                    type="text"
                    value={kelurahanForm.alamatKantor}
                    onChange={(e) => setKelurahanForm({ ...kelurahanForm, alamatKantor: e.target.value })}
                    placeholder="Jl. Raya Kelurahan No. ..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsKelurahanModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingKelurahan ? 'Simpan Perubahan' : 'Tambahkan Kelurahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
